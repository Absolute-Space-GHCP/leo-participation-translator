/**
 * @file index.ts
 * @description Cultural Intelligence module exports
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-05
 */

// Re-export types from each module
export type { ExaSearchOptions, ExaSearchResult, ExaSearchResponse } from './exa.js';
export type { TavilySearchOptions, TavilySearchResult, TavilySearchResponse } from './tavily.js';
export type { CulturalContext, InstitutionalContext, MergedContext, MergeOptions, ContextSummary } from './merger.js';
export type { SentimentLabel, SentimentScore, TopicSentiment, SentimentAnalysis, BatchSentimentResult } from './sentiment.js';

// Export default clients/services with unique names
export { default as exaClient } from './exa.js';
export { default as tavilyClient } from './tavily.js';
export { default as contextMerger } from './merger.js';
export { default as sentimentAnalyzer } from './sentiment.js';

// Named exports from merger (these don't conflict)
export { quickContext, formatContextForPrompt, mergeContext } from './merger.js';
