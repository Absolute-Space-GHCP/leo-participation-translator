/**
 * @file index.ts
 * @description Generation engine using Claude Opus 4.6 via Vertex AI
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-06
 */

import type { CulturalContext } from '../cultural/index.js';
import { assembleWriteupPrompt, assemblePackPrompt } from './prompt-assembly.js';
import { callClaudeForBlueprint, parseClaudeResponse } from './claude-client.js';

/**
 * Project seed - initial input from user
 */
export interface ProjectSeed {
  /** The traditional/passive idea */
  traditionalIdea: string;
  
  /** Brand name */
  brand: string;
  
  /** Brand category */
  category: string;
  
  /** Target audience description */
  targetAudience: string;
  
  /** Available budget (optional) */
  budget?: string;
  
  /** Campaign dates (optional) */
  dates?: {
    start?: string;
    end?: string;
  };
  
  /** Brand considerations/constraints */
  brandConsiderations?: string;
  
  /** Additional context */
  additionalContext?: string;
  
  /** The Shared Interest reframe from JL strategy team (if available) */
  sharedInterest?: string;
}

/**
 * One section of the Participation Write-up
 */
export interface FrameworkSection {
  /** Section number (1-9) */
  number: number;
  
  /** Section title */
  title: string;
  
  /** Section content */
  content: string;
}

/**
 * Tier A: High-level strategic output
 */
export interface TierAOutput {
  /** The seamless participation-worthy narrative */
  writeup: string;
  
  /** Overall creative direction */
  creativeApproach: string;
  
  /** Channel/platform strategy */
  mediaStrategy: string;
  
  /** Talent/influencer approach */
  creatorStrategy: string;
}

/**
 * Tier B: Specific executional recommendation
 */
export interface TierBRecommendation {
  /** Compelling title */
  title: string;
  
  /** Execution description */
  description: string;
  
  /** Includes creative element */
  hasCreative: boolean;
  
  /** Includes media element */
  hasMedia: boolean;
  
  /** Includes creator element */
  hasCreator: boolean;
  
  /** Why this works for participation */
  participationRationale: string;
  
  /** Estimated effort */
  effort: 'low' | 'medium' | 'high';
  
  /** Media details if applicable */
  mediaDetails: string | null;
  
  /** Creator details if applicable */
  creatorDetails: string | null;
}

/**
 * Tier B: Executional recommendations output
 */
export interface TierBOutput {
  /** List of specific recommendations */
  recommendations: TierBRecommendation[];
}

/**
 * The Participation Worthy Write-up (combines both tiers)
 */
export interface ParticipationWriteup {
  /** Tier A: Strategic narrative */
  tierA: TierAOutput;
  
  /** Tier B: Executional recommendations */
  tierB: TierBOutput;
  
  /** Legacy: framework sections (for internal tracking) */
  sections?: FrameworkSection[];
  
  /** Generated at timestamp */
  generatedAt: Date;
}

/**
 * Subculture-specific brief
 */
export interface SubcultureBrief {
  /** Subculture name */
  subculture: string;
  
  /** Tailored message */
  message: string;
  
  /** Recommended platforms */
  platforms: string[];
  
  /** Content format suggestions */
  contentFormats: string[];
}

/**
 * Participation mechanic
 */
export interface ParticipationMechanic {
  /** Mechanic name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Type of mechanic */
  type: 'digital' | 'physical' | 'social' | 'hybrid';
  
  /** Implementation details */
  implementation: string;
  
  /** Expected engagement */
  expectedEngagement: string;
}

/**
 * Creator/influencer suggestion
 */
export interface CreatorSuggestion {
  /** Archetype or specific name */
  archetype: string;
  
  /** Why they fit */
  rationale: string;
  
  /** Suggested role */
  role: string;
  
  /** Platform presence */
  platforms: string[];
}

/**
 * The Participation Pack
 */
export interface ParticipationPack {
  /** The Big Audacious Act */
  bigAudaciousAct: {
    title: string;
    description: string;
    riskLevel: 'high' | 'very-high';
    potentialImpact: string;
  };
  
  /** Subculture Mini-Briefs */
  subcultureBriefs: SubcultureBrief[];
  
  /** Mechanic Deep-Dives (3-5) */
  mechanics: ParticipationMechanic[];
  
  /** Casting & Creators */
  creators: CreatorSuggestion[];
  
  /** Trend Hijacks (72-hour opportunities) */
  trendHijacks: {
    trend: string;
    execution: string;
    timing: string;
    riskLevel: 'low' | 'medium' | 'high';
  }[];
}

/**
 * Complete Participation Blueprint output
 */
export interface ParticipationBlueprint {
  /** The seed that generated this */
  seed: ProjectSeed;
  
  /** The Participation Worthy Write-up */
  writeup: ParticipationWriteup;
  
  /** The Participation Pack */
  pack: ParticipationPack;
  
  /** Retrieved context used */
  retrievedContext: {
    documentCount: number;
    sources: string[];
  };
  
  /** Cultural context used */
  culturalContext: {
    trendsUsed: number;
    subculturesIdentified: number;
  };
  
  /** Generation metadata */
  metadata: {
    generatedAt: Date;
    durationMs: number;
    tokensUsed: number;
    modelVersion: string;
  };
}

/**
 * Generate a complete Participation Blueprint
 * 
 * This is the main entry point for the entire system. It:
 * 1. Assembles context (RAG + cultural + evolution) via the assembly service
 * 2. Calls Claude Opus 4.6 to generate the Tier A/B write-up
 * 3. Calls Claude again to generate the Participation Pack
 * 4. Parses and validates all outputs
 * 5. Returns a complete, typed ParticipationBlueprint
 * 
 * @param seed - Project seed from the creative team
 * @param options - Generation options (streaming, model override, etc.)
 * @returns Complete Participation Blueprint
 */
export async function generateBlueprint(
  seed: ProjectSeed,
  options?: {
    stream?: boolean;
    model?: string;
    onChunk?: (chunk: string) => void;
    onProgress?: (stage: string, progress: number) => void;
    skipCultural?: boolean;
    skipEvolution?: boolean;
  }
): Promise<ParticipationBlueprint> {
  const startTime = Date.now();

  console.log('\n🚀 Generating Participation Blueprint...');
  console.log(`   Brand: ${seed.brand}`);
  console.log(`   Category: ${seed.category}`);
  console.log(`   Target: ${seed.targetAudience}`);

  // Step 1: Assemble the write-up prompt (gathers all context)
  options?.onProgress?.('Gathering context...', 0.1);

  const writeupPrompt = await assembleWriteupPrompt(seed, {
    tier: 'both',
    includePack: false,
    skipCultural: options?.skipCultural,
    skipEvolution: options?.skipEvolution,
  });

  // Step 2: Generate the Tier A/B write-up
  options?.onProgress?.('Generating write-up...', 0.3);

  const writeupResponse = await callClaudeForBlueprint(
    writeupPrompt.systemPrompt,
    writeupPrompt.userPrompt,
    {
      stream: options?.stream,
      model: options?.model,
      onChunk: options?.onChunk,
    }
  );

  const writeupResult = parseClaudeResponse<{ tierA: TierAOutput; tierB: TierBOutput }>(writeupResponse);

  // Step 3: Generate the Participation Pack
  options?.onProgress?.('Generating pack...', 0.6);

  const writeupText = writeupResult.success
    ? writeupResult.data.tierA.writeup
    : writeupResponse.content;

  const packPrompt = await assemblePackPrompt(writeupText, seed, {
    skipCultural: options?.skipCultural,
    skipEvolution: options?.skipEvolution,
  });

  const packResponse = await callClaudeForBlueprint(
    packPrompt.systemPrompt,
    packPrompt.userPrompt,
    {
      stream: options?.stream,
      model: options?.model,
      maxTokens: 8192, // Vertex AI Sonnet 4.5 hangs above 8192; prompt instructs conciseness
      onChunk: options?.onChunk,
    }
  );

  const rawPackResult = parseClaudeResponse<ParticipationPack | { participationPack: ParticipationPack }>(packResponse);

  // Unwrap nested wrapper — Claude sometimes returns { participationPack: { ... } }
  const packResult = rawPackResult.success && 'participationPack' in rawPackResult.data
    ? { success: true as const, data: rawPackResult.data.participationPack }
    : rawPackResult as { success: true; data: ParticipationPack } | { success: false; rawText: string; error: string };

  // Step 4: Assemble the final blueprint
  options?.onProgress?.('Assembling blueprint...', 0.9);

  const durationMs = Date.now() - startTime;
  const totalTokens = writeupResponse.usage.totalTokens + packResponse.usage.totalTokens;

  const blueprint: ParticipationBlueprint = {
    seed,
    writeup: {
      tierA: writeupResult.success
        ? writeupResult.data.tierA
        : { writeup: writeupResponse.content, creativeApproach: '', mediaStrategy: '', creatorStrategy: '' },
      tierB: writeupResult.success
        ? writeupResult.data.tierB
        : { recommendations: [] },
      generatedAt: new Date(),
    },
    pack: packResult.success
      ? packResult.data
      : {
          bigAudaciousAct: { title: 'Parse Error', description: packResponse.content, riskLevel: 'high', potentialImpact: '' },
          subcultureBriefs: [],
          mechanics: [],
          creators: [],
          trendHijacks: [],
        },
    retrievedContext: {
      documentCount: writeupPrompt.assembly.ragResultCount,
      sources: writeupPrompt.assembly.sourcesUsed,
    },
    culturalContext: {
      trendsUsed: writeupPrompt.assembly.culturalResultCount,
      subculturesIdentified: 0, // Counted from pack output
    },
    metadata: {
      generatedAt: new Date(),
      durationMs,
      tokensUsed: totalTokens,
      modelVersion: writeupResponse.model,
    },
  };

  options?.onProgress?.('Complete!', 1.0);

  console.log(`\n✨ Blueprint generated in ${(durationMs / 1000).toFixed(1)}s`);
  console.log(`   Total tokens: ${totalTokens.toLocaleString()}`);
  console.log(`   Estimated cost: $${(writeupResponse.estimatedCost + packResponse.estimatedCost).toFixed(4)}`);

  return blueprint;
}

/**
 * Generate just the Participation Write-up (Tier A + B, no pack)
 */
export async function generateWriteup(
  seed: ProjectSeed,
  options?: {
    stream?: boolean;
    onChunk?: (chunk: string) => void;
    skipCultural?: boolean;
    skipEvolution?: boolean;
  }
): Promise<ParticipationWriteup> {
  const prompt = await assembleWriteupPrompt(seed, {
    tier: 'both',
    skipCultural: options?.skipCultural,
    skipEvolution: options?.skipEvolution,
  });

  const response = await callClaudeForBlueprint(
    prompt.systemPrompt,
    prompt.userPrompt,
    { stream: options?.stream, onChunk: options?.onChunk }
  );

  const result = parseClaudeResponse<{ tierA: TierAOutput; tierB: TierBOutput }>(response);

  return {
    tierA: result.success
      ? result.data.tierA
      : { writeup: response.content, creativeApproach: '', mediaStrategy: '', creatorStrategy: '' },
    tierB: result.success
      ? result.data.tierB
      : { recommendations: [] },
    generatedAt: new Date(),
  };
}

/**
 * Generate just the Participation Pack (requires existing write-up)
 */
export async function generatePack(
  seed: ProjectSeed,
  writeupText: string,
  options?: {
    stream?: boolean;
    onChunk?: (chunk: string) => void;
    skipCultural?: boolean;
    skipEvolution?: boolean;
  }
): Promise<ParticipationPack> {
  const prompt = await assemblePackPrompt(writeupText, seed, {
    skipCultural: options?.skipCultural,
    skipEvolution: options?.skipEvolution,
  });

  const response = await callClaudeForBlueprint(
    prompt.systemPrompt,
    prompt.userPrompt,
    { stream: options?.stream, onChunk: options?.onChunk }
  );

  const result = parseClaudeResponse<ParticipationPack>(response);

  if (result.success) {
    return result.data;
  }

  // Return a shell with raw text so the output isn't lost
  return {
    bigAudaciousAct: { title: 'Parse Error', description: response.content, riskLevel: 'high', potentialImpact: '' },
    subcultureBriefs: [],
    mechanics: [],
    creators: [],
    trendHijacks: [],
  };
}

// Re-export prompt assembly service
export {
  assembleWriteupPrompt,
  assemblePackPrompt,
} from './prompt-assembly.js';
export type { AssembledPrompt, AssemblyOptions } from './prompt-assembly.js';

// Re-export Claude client
export {
  callClaude,
  callClaudeForBlueprint,
  callClaudeForTask,
  parseClaudeResponse,
} from './claude-client.js';
export type { ClaudeCallOptions, ClaudeResponse } from './claude-client.js';

// Re-export output formatters
export {
  formatBlueprint,
  formatAsMarkdown,
  formatAsHtml,
  formatAsPlainText,
  formatAsSlides,
  type FormattedBlueprint,
  type SlideData,
} from './formatters.js';
