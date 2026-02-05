/**
 * @file index.ts
 * @description Cultural Intelligence module exports
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-05
 */

// Re-export types from each module
export type { ExaSearchOptions, ExaSearchResult, ExaSearchResponse } from './exa';
export type { TavilySearchOptions, TavilySearchResult, TavilySearchResponse } from './tavily';
export type { CulturalContext, InstitutionalContext, MergedContext, MergeOptions, ContextSummary } from './merger';
export type { SentimentLabel, SentimentScore, TopicSentiment, SentimentAnalysis, BatchSentimentResult } from './sentiment';

// Export default clients/services with unique names
export { default as exaClient } from './exa';
export { default as tavilyClient } from './tavily';
export { default as contextMerger } from './merger';
export { default as sentimentAnalyzer } from './sentiment';

// Named exports from merger (these don't conflict)
export { quickContext, formatContextForPrompt, mergeContext } from './merger';
