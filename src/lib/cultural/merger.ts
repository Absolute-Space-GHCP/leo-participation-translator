/**
 * @file merger.ts
 * @description Context merger combining RAG retrieval with cultural intelligence
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-05
 */

import { searchSimilar, type SearchResult, type VectorStoreConfig } from '../embeddings/index.js';
import * as exa from './exa.js';
import * as tavily from './tavily.js';

/**
 * Unified search result from any source
 */
export interface UnifiedResult {
  title: string;
  content: string;
  url?: string;
  source: 'rag' | 'exa' | 'tavily';
  sourceType: 'institutional' | 'web' | 'reddit' | 'news';
  score: number;
  metadata: Record<string, unknown>;
}

/**
 * Cultural context from web searches
 */
export interface CulturalContext {
  trends: UnifiedResult[];
  discussions: UnifiedResult[];
  news: UnifiedResult[];
}

/**
 * Institutional context from RAG
 */
export interface InstitutionalContext {
  relevantCases: UnifiedResult[];
  patterns: UnifiedResult[];
  frameworks: UnifiedResult[];
}

/**
 * Merged context ready for Claude
 */
export interface MergedContext {
  query: string;
  institutional: InstitutionalContext;
  cultural: CulturalContext;
  summary: ContextSummary;
  timestamp: string;
}

/**
 * Summary of available context
 */
export interface ContextSummary {
  totalResults: number;
  institutionalCount: number;
  culturalCount: number;
  sourcesUsed: string[];
  primaryThemes: string[];
}

/**
 * Options for context merging
 */
export interface MergeOptions {
  /** Number of RAG results to fetch */
  ragTopK?: number;
  /** Number of cultural results per source */
  culturalTopK?: number;
  /** Include Tavily as backup */
  includeTavily?: boolean;
  /** RAG filters */
  ragFilters?: {
    client?: string;
    documentType?: string;
  };
  /** Target audience for cultural search */
  targetAudience?: string;
  /** Brand for cultural search */
  brand?: string;
  /** Category for cultural search */
  category?: string;
}

/**
 * Convert RAG SearchResult to UnifiedResult
 */
function ragToUnified(result: SearchResult): UnifiedResult {
  return {
    title: result.metadata.filename as string || 'Unknown',
    content: result.chunk.content,
    source: 'rag',
    sourceType: 'institutional',
    score: result.score,
    metadata: {
      ...result.metadata,
      page: result.chunk.page,
      section: result.chunk.section,
      chunkIndex: result.chunk.chunkIndex,
    },
  };
}

/**
 * Convert Exa result to UnifiedResult
 */
function exaToUnified(
  result: { title: string; url: string; score?: number; text?: string; highlights?: string[] },
  sourceType: 'web' | 'reddit' | 'news'
): UnifiedResult {
  return {
    title: result.title,
    content: result.highlights?.[0] || result.text || '',
    url: result.url,
    source: 'exa',
    sourceType,
    score: result.score || 0.5,
    metadata: { url: result.url },
  };
}

/**
 * Convert Tavily result to UnifiedResult
 */
function tavilyToUnified(
  result: { title: string; url: string; score?: number; content?: string },
  sourceType: 'web' | 'reddit' | 'news'
): UnifiedResult {
  return {
    title: result.title,
    content: result.content || '',
    url: result.url,
    source: 'tavily',
    sourceType,
    score: result.score || 0.5,
    metadata: { url: result.url },
  };
}

/**
 * Extract primary themes from results
 */
function extractThemes(results: UnifiedResult[]): string[] {
  // Simple keyword extraction - could be enhanced with NLP
  const allText = results.map(r => r.title + ' ' + r.content).join(' ').toLowerCase();
  
  const commonThemes = [
    'participation', 'engagement', 'culture', 'community', 'trend',
    'social', 'viral', 'authentic', 'creator', 'influencer',
    'gen z', 'millennial', 'brand', 'campaign', 'strategy',
  ];
  
  return commonThemes.filter(theme => allText.includes(theme)).slice(0, 5);
}

/**
 * Merge and deduplicate results
 */
function deduplicateResults(results: UnifiedResult[]): UnifiedResult[] {
  const seen = new Set<string>();
  return results.filter(result => {
    const key = result.url || result.title.toLowerCase().slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Get cultural context using configured providers
 */
async function getCulturalContext(
  query: string,
  options: MergeOptions
): Promise<CulturalContext> {
  const { culturalTopK = 5, includeTavily = true, brand, category, targetAudience } = options;

  const trends: UnifiedResult[] = [];
  const discussions: UnifiedResult[] = [];
  const news: UnifiedResult[] = [];

  // Build search queries
  const trendQuery = brand 
    ? `${brand} ${category || ''} trends ${new Date().getFullYear()}`
    : `${query} trends ${new Date().getFullYear()}`;
  
  const discussionQuery = brand
    ? `${brand} ${category || ''} discussion opinions`
    : `${query} discussion opinions community`;

  try {
    // Exa searches (primary)
    const [exaTrends, exaDiscussions] = await Promise.all([
      exa.searchTrends(category || query, { numResults: culturalTopK }),
      exa.searchReddit(discussionQuery, { numResults: culturalTopK }),
    ]);

    trends.push(...exaTrends.results.map(r => exaToUnified(r, 'news')));
    discussions.push(...exaDiscussions.results.map(r => exaToUnified(r, 'reddit')));

    // Tavily searches (backup/supplement)
    if (includeTavily && (await tavily.isConfigured())) {
      const [tavilyTrends, tavilyDiscussions] = await Promise.all([
        tavily.searchTrends(category || query, { maxResults: culturalTopK }),
        tavily.searchReddit(discussionQuery, { maxResults: culturalTopK }),
      ]);

      // Add Tavily results (will be deduplicated later)
      news.push(...tavilyTrends.results.map(r => tavilyToUnified(r, 'news')));
      discussions.push(...tavilyDiscussions.results.map(r => tavilyToUnified(r, 'reddit')));
    }
  } catch (error) {
    console.warn('Cultural intelligence fetch warning:', error);
  }

  return {
    trends: deduplicateResults(trends),
    discussions: deduplicateResults(discussions),
    news: deduplicateResults(news),
  };
}

/**
 * Get institutional context from RAG
 */
async function getInstitutionalContext(
  query: string,
  options: MergeOptions,
  config: VectorStoreConfig
): Promise<InstitutionalContext> {
  const { ragTopK = 10, ragFilters } = options;

  try {
    const results = await searchSimilar(
      query,
      ragTopK,
      config,
      ragFilters
    );

    // Categorize results by type
    const relevantCases: UnifiedResult[] = [];
    const patterns: UnifiedResult[] = [];
    const frameworks: UnifiedResult[] = [];

    for (const result of results) {
      const unified = ragToUnified(result);
      const docType = (result.metadata.documentType as string) || 'other';
      
      if (docType === 'framework') {
        frameworks.push(unified);
      } else if (unified.content.toLowerCase().includes('pattern') || 
                 unified.content.toLowerCase().includes('approach')) {
        patterns.push(unified);
      } else {
        relevantCases.push(unified);
      }
    }

    return { relevantCases, patterns, frameworks };
  } catch (error) {
    console.warn('RAG retrieval warning:', error);
    return { relevantCases: [], patterns: [], frameworks: [] };
  }
}

/**
 * Merge RAG retrieval with cultural intelligence
 * 
 * This is the main function that combines:
 * 1. JL institutional knowledge (past presentations, patterns, frameworks)
 * 2. Real-time cultural intelligence (trends, discussions, news)
 * 
 * The merged context is structured for optimal Claude prompting.
 */
export async function mergeContext(
  query: string,
  config: VectorStoreConfig,
  options: MergeOptions = {}
): Promise<MergedContext> {
  console.log('🔄 Merging context...');
  console.log(`   Query: "${query}"`);

  // Fetch both contexts in parallel
  const [institutional, cultural] = await Promise.all([
    getInstitutionalContext(query, options, config),
    getCulturalContext(query, options),
  ]);

  // Calculate summary
  const institutionalCount = 
    institutional.relevantCases.length + 
    institutional.patterns.length + 
    institutional.frameworks.length;
  
  const culturalCount = 
    cultural.trends.length + 
    cultural.discussions.length + 
    cultural.news.length;

  const allResults = [
    ...institutional.relevantCases,
    ...institutional.patterns,
    ...institutional.frameworks,
    ...cultural.trends,
    ...cultural.discussions,
    ...cultural.news,
  ];

  const sourcesUsed = [...new Set(allResults.map(r => r.source))];
  const primaryThemes = extractThemes(allResults);

  const summary: ContextSummary = {
    totalResults: institutionalCount + culturalCount,
    institutionalCount,
    culturalCount,
    sourcesUsed,
    primaryThemes,
  };

  console.log(`✅ Context merged: ${institutionalCount} institutional, ${culturalCount} cultural`);

  return {
    query,
    institutional,
    cultural,
    summary,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format merged context for Claude prompt
 */
export function formatContextForPrompt(context: MergedContext): string {
  const sections: string[] = [];

  // Header
  sections.push(`# Context for: "${context.query}"\n`);

  // Institutional Knowledge
  if (context.summary.institutionalCount > 0) {
    sections.push('## JL Institutional Knowledge\n');
    
    if (context.institutional.relevantCases.length > 0) {
      sections.push('### Relevant Past Work\n');
      for (const result of context.institutional.relevantCases.slice(0, 5)) {
        sections.push(`**${result.title}** (Score: ${(result.score * 100).toFixed(0)}%)`);
        sections.push(`${result.content.substring(0, 500)}...\n`);
      }
    }

    if (context.institutional.patterns.length > 0) {
      sections.push('### Patterns & Approaches\n');
      for (const result of context.institutional.patterns.slice(0, 3)) {
        sections.push(`- ${result.content.substring(0, 300)}...\n`);
      }
    }

    if (context.institutional.frameworks.length > 0) {
      sections.push('### Framework References\n');
      for (const result of context.institutional.frameworks.slice(0, 2)) {
        sections.push(`- ${result.content.substring(0, 300)}...\n`);
      }
    }
  }

  // Cultural Intelligence
  if (context.summary.culturalCount > 0) {
    sections.push('\n## Real-Time Cultural Intelligence\n');
    
    if (context.cultural.trends.length > 0) {
      sections.push('### Current Trends\n');
      for (const result of context.cultural.trends.slice(0, 5)) {
        sections.push(`**${result.title}** [${result.source}]`);
        if (result.url) sections.push(`Source: ${result.url}`);
        sections.push(`${result.content.substring(0, 300)}...\n`);
      }
    }

    if (context.cultural.discussions.length > 0) {
      sections.push('### Community Discussions\n');
      for (const result of context.cultural.discussions.slice(0, 5)) {
        sections.push(`**${result.title}** [${result.source}]`);
        if (result.url) sections.push(`Source: ${result.url}`);
        sections.push(`${result.content.substring(0, 300)}...\n`);
      }
    }

    if (context.cultural.news.length > 0) {
      sections.push('### Recent News\n');
      for (const result of context.cultural.news.slice(0, 3)) {
        sections.push(`**${result.title}** [${result.source}]`);
        if (result.url) sections.push(`Source: ${result.url}`);
        sections.push(`${result.content.substring(0, 300)}...\n`);
      }
    }
  }

  // Summary
  sections.push('\n## Context Summary\n');
  sections.push(`- Total sources: ${context.summary.totalResults}`);
  sections.push(`- JL institutional: ${context.summary.institutionalCount}`);
  sections.push(`- Cultural intelligence: ${context.summary.culturalCount}`);
  sections.push(`- Key themes: ${context.summary.primaryThemes.join(', ')}`);
  sections.push(`- Sources: ${context.summary.sourcesUsed.join(', ')}`);

  return sections.join('\n');
}

/**
 * Quick context fetch (simplified for common use cases)
 */
export async function quickContext(
  query: string,
  brand?: string,
  category?: string
): Promise<MergedContext> {
  const config: VectorStoreConfig = {
    projectId: process.env.GCP_PROJECT_ID || '',
    region: process.env.GCP_REGION || 'us-central1',
    dimensions: 768,
  };

  return mergeContext(query, config, {
    brand,
    category,
    ragTopK: 5,
    culturalTopK: 5,
    includeTavily: true,
  });
}

// Export default
export default {
  mergeContext,
  formatContextForPrompt,
  quickContext,
};
