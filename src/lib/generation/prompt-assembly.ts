/**
 * @file prompt-assembly.ts
 * @description Prompt Assembly Service — the "conductor" that gathers all context
 *   sources and assembles them into structured prompts for Claude.
 * 
 *   This is the central orchestration layer that connects:
 *   - Project Seed (creative team's input)
 *   - RAG Context (JL institutional knowledge from vector store)
 *   - Cultural Intelligence (real-time trends from Exa/Tavily)
 *   - Evolution Context (feedback patterns from past generations)
 *   - Framework Templates (the 9-section participation framework)
 * 
 *   Into a single, precisely structured prompt that produces the best output.
 * 
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-06
 * @updated 2026-02-06
 */

import { config } from 'dotenv';
import { mergeContext, type MergedContext, type MergeOptions, type UnifiedResult } from '../cultural/merger.js';
import { getContextInjector, type ContextInjector } from '../learning/context-injector.js';
import type { VectorStoreConfig } from '../embeddings/index.js';
import type { ProjectSeed } from './index.js';
import {
  buildSystemPrompt,
  buildWriteupPrompt,
  buildPackPrompt,
} from '../../prompts/participation-framework.js';

// Load environment variables
config();

// ─────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────

/**
 * Options for prompt assembly
 */
export interface AssemblyOptions {
  /** Which tiers to generate: A only, B only, or both */
  tier?: 'A' | 'B' | 'both';

  /** Include the Participation Pack prompt */
  includePack?: boolean;

  /** Number of RAG results to retrieve */
  ragTopK?: number;

  /** Number of cultural results per source */
  culturalTopK?: number;

  /** Include Tavily as backup cultural source */
  includeTavily?: boolean;

  /** Filter RAG results by client */
  ragClientFilter?: string;

  /** Skip cultural intelligence (useful for testing) */
  skipCultural?: boolean;

  /** Skip evolution context (useful for first runs) */
  skipEvolution?: boolean;

  /** Maximum tokens for retrieved context (prevents prompt overflow) */
  maxRetrievedTokens?: number;

  /** Maximum tokens for cultural context */
  maxCulturalTokens?: number;
}

/**
 * An assembled prompt ready to send to Claude
 */
export interface AssembledPrompt {
  /** The system prompt (persona + framework + output format) */
  systemPrompt: string;

  /** The user prompt (seed + context + task) */
  userPrompt: string;

  /** Metadata about what was assembled */
  assembly: {
    /** How many RAG results were included */
    ragResultCount: number;

    /** How many cultural results were included */
    culturalResultCount: number;

    /** Whether evolution context was injected */
    evolutionInjected: boolean;

    /** Approximate token count for the full prompt */
    estimatedTokens: number;

    /** Sources used */
    sourcesUsed: string[];

    /** Assembly duration in ms */
    assemblyDurationMs: number;
  };
}

// ─────────────────────────────────────────────────
// Context Formatting
// ─────────────────────────────────────────────────

/**
 * Format unified results into prompt-ready text.
 * 
 * This converts raw search results (from RAG or cultural APIs) into
 * clean, readable context that Claude can use for generation.
 * Results are grouped by source type with clear attribution.
 */
function formatResultsForPrompt(results: UnifiedResult[], maxTokens: number): string {
  if (results.length === 0) return 'No relevant context found.';

  const parts: string[] = [];
  let estimatedTokens = 0;

  for (const result of results) {
    // Rough token estimate: ~4 chars per token
    const resultTokens = Math.ceil((result.title.length + result.content.length) / 4);
    if (estimatedTokens + resultTokens > maxTokens) break;

    const sourceLabel = result.source === 'rag'
      ? `[JL: ${result.metadata.filename || 'Past Work'}]`
      : `[${result.source.toUpperCase()}: ${result.sourceType}]`;

    parts.push(`${sourceLabel}\n${result.content}`);
    estimatedTokens += resultTokens;
  }

  return parts.join('\n\n---\n\n');
}

/**
 * Format the institutional context (JL past work from vector store)
 * 
 * Organizes RAG results into relevant cases, patterns, and frameworks
 * so Claude can absorb JL's strategic thinking.
 */
function formatInstitutionalContext(context: MergedContext, maxTokens: number): string {
  const allResults = [
    ...context.institutional.relevantCases,
    ...context.institutional.patterns,
    ...context.institutional.frameworks,
  ];

  if (allResults.length === 0) {
    return 'No JL institutional knowledge retrieved for this query.';
  }

  // Sort by relevance score (highest first)
  allResults.sort((a, b) => b.score - a.score);

  return formatResultsForPrompt(allResults, maxTokens);
}

/**
 * Format the cultural context (real-time trends and discussions)
 * 
 * Organizes cultural intelligence results by type — trends, discussions,
 * and news — so Claude can identify the "moving vehicle" in culture.
 */
function formatCulturalContext(context: MergedContext, maxTokens: number): string {
  const sections: string[] = [];
  const tokensPerSection = Math.floor(maxTokens / 3);

  if (context.cultural.trends.length > 0) {
    sections.push('### Current Trends\n' + formatResultsForPrompt(context.cultural.trends, tokensPerSection));
  }

  if (context.cultural.discussions.length > 0) {
    sections.push('### Active Discussions\n' + formatResultsForPrompt(context.cultural.discussions, tokensPerSection));
  }

  if (context.cultural.news.length > 0) {
    sections.push('### Recent News\n' + formatResultsForPrompt(context.cultural.news, tokensPerSection));
  }

  if (sections.length === 0) {
    return 'No real-time cultural intelligence available. Use general cultural knowledge.';
  }

  return sections.join('\n\n');
}

// ─────────────────────────────────────────────────
// Query Construction
// ─────────────────────────────────────────────────

/**
 * Build a rich search query from the project seed.
 * 
 * The quality of retrieval depends heavily on query quality.
 * This function combines brand, category, audience, and idea
 * into a query optimized for semantic search.
 */
function buildSearchQuery(seed: ProjectSeed): string {
  const parts = [
    `${seed.brand} ${seed.category} participation campaign`,
    seed.traditionalIdea.substring(0, 200),
    `target audience: ${seed.targetAudience}`,
  ];

  if (seed.sharedInterest) {
    parts.push(`shared interest: ${seed.sharedInterest}`);
  }

  return parts.join(' ');
}

/**
 * Build a cultural search query focused on trends and culture.
 * 
 * Different from the RAG query — this targets real-time cultural
 * context rather than historical JL work.
 */
function buildCulturalQuery(seed: ProjectSeed): string {
  return `${seed.category} ${seed.targetAudience} cultural trends participation engagement ${seed.brand}`;
}

// ─────────────────────────────────────────────────
// Token Estimation
// ─────────────────────────────────────────────────

/**
 * Rough token count estimation (~4 characters per token for English text).
 * Used to prevent prompt overflow and stay within model context limits.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ─────────────────────────────────────────────────
// Main Assembly Function
// ─────────────────────────────────────────────────

/**
 * Assemble a complete prompt for Tier A + B generation.
 * 
 * This is the main entry point. It:
 * 1. Builds a search query from the project seed
 * 2. Retrieves JL institutional knowledge (RAG) and cultural intelligence in parallel
 * 3. Optionally injects evolution context (learned patterns from feedback)
 * 4. Formats everything into prompt-ready text
 * 5. Combines with the framework system prompt
 * 6. Returns a ready-to-send prompt with assembly metadata
 * 
 * @param seed - The creative team's project input
 * @param options - Assembly configuration
 * @returns Assembled prompt ready for Claude
 */
export async function assembleWriteupPrompt(
  seed: ProjectSeed,
  options: AssemblyOptions = {}
): Promise<AssembledPrompt> {
  const startTime = Date.now();

  const {
    tier = 'both',
    includePack = false,
    ragTopK = 10,
    culturalTopK = 5,
    includeTavily = true,
    skipCultural = false,
    skipEvolution = false,
    maxRetrievedTokens = 3000,
    maxCulturalTokens = 2000,
  } = options;

  // ── Step 1: Build search queries ──
  const ragQuery = buildSearchQuery(seed);
  const culturalQuery = buildCulturalQuery(seed);

  console.log('📋 Assembling prompt...');
  console.log(`   RAG query: "${ragQuery.substring(0, 80)}..."`);
  console.log(`   Cultural query: "${culturalQuery.substring(0, 80)}..."`);

  // ── Step 2: Get vector store config from environment ──
  const vectorConfig: VectorStoreConfig = {
    projectId: process.env.GCP_PROJECT_ID || '',
    region: process.env.GCP_REGION || 'us-central1',
    dimensions: parseInt(process.env.VERTEX_AI_EMBEDDING_DIMENSIONS || '768', 10),
  };

  // ── Step 3: Gather all context in parallel ──
  //
  //   This is the key performance optimization. We fetch:
  //   - JL past work from the vector store (institutional knowledge)
  //   - Real-time cultural trends from web APIs (Exa, Tavily)
  //   - Learned patterns from feedback history (evolution context)
  //   All simultaneously, so the total wait time is max(RAG, cultural, evolution)
  //   rather than RAG + cultural + evolution.
  //
  const mergeOptions: MergeOptions = {
    ragTopK,
    culturalTopK,
    includeTavily,
    ragFilters: options.ragClientFilter
      ? { client: options.ragClientFilter }
      : undefined,
    brand: seed.brand,
    category: seed.category,
    targetAudience: seed.targetAudience,
  };

  let mergedContext: MergedContext | null = null;
  let evolutionText = '';
  const sourcesUsed: string[] = [];

  // Fetch context and evolution in parallel
  const contextPromise = skipCultural
    ? mergeContext(ragQuery, vectorConfig, { ...mergeOptions, culturalTopK: 0 })
    : mergeContext(ragQuery, vectorConfig, mergeOptions);

  let evolutionPromise: Promise<string> = Promise.resolve('');
  if (!skipEvolution) {
    evolutionPromise = getEvolutionContext(seed);
  }

  const [contextResult, evolutionResult] = await Promise.all([
    contextPromise,
    evolutionPromise,
  ]);

  mergedContext = contextResult;
  evolutionText = evolutionResult;

  // ── Step 4: Format context for prompt insertion ──
  const formattedInstitutional = formatInstitutionalContext(mergedContext, maxRetrievedTokens);
  const formattedCultural = formatCulturalContext(mergedContext, maxCulturalTokens);

  // Track sources
  if (mergedContext.summary.institutionalCount > 0) sourcesUsed.push('rag');
  for (const source of mergedContext.summary.sourcesUsed) {
    if (!sourcesUsed.includes(source)) sourcesUsed.push(source);
  }

  // ── Step 5: Build the system prompt ──
  //
  //   This includes:
  //   - JL strategist persona
  //   - Invisible framework instructions (output flows seamlessly)
  //   - All 9 section guides (for Claude's internal reasoning)
  //   - Tier A/B output format specs
  //   - Final instructions
  //
  const systemPrompt = buildSystemPrompt({ tier, includePack });

  // ── Step 6: Build the user prompt ──
  //
  //   This includes:
  //   - The project seed (brand, idea, audience, etc.)
  //   - Retrieved JL institutional knowledge
  //   - Real-time cultural intelligence
  //   - Evolution context (if available)
  //   - The task instructions
  //
  const userPrompt = buildWriteupPrompt(
    seed,
    formattedInstitutional,
    formattedCultural,
    evolutionText || undefined
  );

  // ── Step 7: Calculate assembly metadata ──
  const durationMs = Date.now() - startTime;
  const totalEstimatedTokens = estimateTokens(systemPrompt) + estimateTokens(userPrompt);

  console.log(`✅ Prompt assembled in ${durationMs}ms`);
  console.log(`   RAG results: ${mergedContext.summary.institutionalCount}`);
  console.log(`   Cultural results: ${mergedContext.summary.culturalCount}`);
  console.log(`   Evolution injected: ${evolutionText.length > 0 ? 'Yes' : 'No'}`);
  console.log(`   Estimated tokens: ~${totalEstimatedTokens.toLocaleString()}`);

  return {
    systemPrompt,
    userPrompt,
    assembly: {
      ragResultCount: mergedContext.summary.institutionalCount,
      culturalResultCount: mergedContext.summary.culturalCount,
      evolutionInjected: evolutionText.length > 0,
      estimatedTokens: totalEstimatedTokens,
      sourcesUsed,
      assemblyDurationMs: durationMs,
    },
  };
}

/**
 * Assemble a prompt for Participation Pack generation.
 * 
 * This is called AFTER the write-up has been generated, using
 * the write-up output as input for tactical component generation.
 * 
 * @param writeupText - The generated Tier A write-up narrative
 * @param seed - Original project seed (for cultural query)
 * @param options - Assembly configuration
 * @returns Assembled prompt for pack generation
 */
export async function assemblePackPrompt(
  writeupText: string,
  seed: ProjectSeed,
  options: AssemblyOptions = {}
): Promise<AssembledPrompt> {
  const startTime = Date.now();

  const {
    skipCultural = false,
    skipEvolution = false,
    maxCulturalTokens = 2000,
    culturalTopK = 5,
    includeTavily = true,
  } = options;

  // Get fresh cultural context for the pack (trends may have updated)
  let culturalText = '';
  let culturalCount = 0;
  const sourcesUsed: string[] = [];

  if (!skipCultural) {
    const vectorConfig: VectorStoreConfig = {
      projectId: process.env.GCP_PROJECT_ID || '',
      region: process.env.GCP_REGION || 'us-central1',
      dimensions: parseInt(process.env.VERTEX_AI_EMBEDDING_DIMENSIONS || '768', 10),
    };

    const culturalQuery = buildCulturalQuery(seed);
    const context = await mergeContext(culturalQuery, vectorConfig, {
      ragTopK: 0, // No RAG needed for pack — we already have the write-up
      culturalTopK,
      includeTavily,
      brand: seed.brand,
      category: seed.category,
      targetAudience: seed.targetAudience,
    });

    culturalText = formatCulturalContext(context, maxCulturalTokens);
    culturalCount = context.summary.culturalCount;
    sourcesUsed.push(...context.summary.sourcesUsed);
  }

  // Get evolution context
  let evolutionText = '';
  if (!skipEvolution) {
    evolutionText = await getEvolutionContext(seed);
  }

  // Build prompts
  const systemPrompt = buildSystemPrompt({ tier: 'A', includePack: true });
  const userPrompt = buildPackPrompt(writeupText, culturalText, evolutionText || undefined);

  const durationMs = Date.now() - startTime;
  const totalEstimatedTokens = estimateTokens(systemPrompt) + estimateTokens(userPrompt);

  return {
    systemPrompt,
    userPrompt,
    assembly: {
      ragResultCount: 0,
      culturalResultCount: culturalCount,
      evolutionInjected: evolutionText.length > 0,
      estimatedTokens: totalEstimatedTokens,
      sourcesUsed,
      assemblyDurationMs: durationMs,
    },
  };
}

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────

/**
 * Get evolution context from the learning system.
 * 
 * The evolution context is learned from past generation feedback —
 * patterns that worked, patterns to avoid, and user preferences.
 * This makes each generation smarter than the last.
 */
async function getEvolutionContext(seed: ProjectSeed): Promise<string> {
  try {
    const injector: ContextInjector = getContextInjector();

    if (!injector.shouldInjectContext()) {
      return '';
    }

    const evolutionCtx = await injector.getContext({
      client: seed.brand,
      category: seed.category,
    });

    return injector.formatForPrompt(evolutionCtx);
  } catch (error) {
    // Evolution context is non-critical — log and continue
    console.warn('⚠️  Evolution context unavailable:', error instanceof Error ? error.message : 'Unknown error');
    return '';
  }
}
