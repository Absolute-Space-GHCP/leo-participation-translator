/**
 * @file tavily.ts
 * @description Tavily client for semantic web search (backup to Exa.ai).
 *              API key is retrieved from Google Cloud Secret Manager (encrypted)
 *              with env-var fallback for local development.
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-06
 */

import { tavily } from '@tavily/core';
import { requireSecret } from '../secrets/index.js';

// Initialize Tavily client (lazy, async — key from Secret Manager)
let tavilyClient: ReturnType<typeof tavily> | null = null;

async function getClient(): Promise<ReturnType<typeof tavily>> {
  if (!tavilyClient) {
    const apiKey = await requireSecret('TAVILY_API_KEY');
    tavilyClient = tavily({ apiKey });
  }
  return tavilyClient;
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  publishedDate?: string;
}

export interface TavilySearchResponse {
  results: TavilySearchResult[];
  query: string;
  responseTime: number;
  images?: Array<{ url: string }>;
  answer?: string;
}

export interface TavilySearchOptions {
  searchDepth?: 'basic' | 'advanced';
  maxResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  includeAnswer?: boolean;
  includeImages?: boolean;
  includeRawContent?: false | 'text' | 'markdown';
  topic?: 'general' | 'news';
  days?: number; // For news topic - how far back to search
}

/**
 * Search the web using Tavily semantic search
 */
export async function search(
  query: string,
  options: TavilySearchOptions = {}
): Promise<TavilySearchResponse> {
  const client = await getClient();

  const {
    searchDepth = 'basic',
    maxResults = 10,
    includeDomains,
    excludeDomains,
    includeAnswer = false,
    includeImages = false,
    includeRawContent,
    topic = 'general',
    days,
  } = options;

  const searchParams: Parameters<typeof client.search>[1] = {
    searchDepth,
    maxResults,
    includeDomains,
    excludeDomains,
    includeAnswer,
    includeImages,
    topic,
    days,
  };

  // Only include rawContent if explicitly set
  if (includeRawContent) {
    searchParams.includeRawContent = includeRawContent;
  }

  const response = await client.search(query, searchParams);

  return {
    results: response.results.map((r: { title: string; url: string; content: string; score: number; publishedDate?: string }) => ({
      title: r.title,
      url: r.url,
      content: r.content,
      score: r.score,
      publishedDate: r.publishedDate,
    })),
    query: response.query,
    responseTime: response.responseTime,
    images: response.images as Array<{ url: string }> | undefined,
    answer: response.answer,
  };
}

/**
 * Search Reddit content via Tavily
 */
export async function searchReddit(
  query: string,
  options: Omit<TavilySearchOptions, 'includeDomains'> = {}
): Promise<TavilySearchResponse> {
  // Search for Reddit discussions semantically
  const redditQuery = `reddit ${query} discussion community`;
  return search(redditQuery, {
    ...options,
    // Don't filter by domain - let semantic search find Reddit discussions
  });
}

/**
 * Search for trending news in a category
 */
export async function searchTrends(
  category: string,
  options: TavilySearchOptions = {}
): Promise<TavilySearchResponse> {
  const trendQuery = `${category} trends ${new Date().getFullYear()} viral popular`;
  return search(trendQuery, {
    ...options,
    topic: 'news',
    days: 7, // Last 7 days
    maxResults: options.maxResults || 15,
  });
}

/**
 * Search for subculture discussions
 */
export async function searchSubculture(
  subculture: string,
  brand?: string,
  options: TavilySearchOptions = {}
): Promise<TavilySearchResponse> {
  const query = brand 
    ? `${subculture} community ${brand} discussion opinions`
    : `${subculture} community culture discussion`;
  
  return search(query, options);
}

/**
 * Get cultural context for a brand/category
 */
export async function getCulturalContext(
  brand: string,
  category: string,
  targetAudience?: string
): Promise<{
  trends: TavilySearchResponse;
  reddit: TavilySearchResponse;
  subcultures: TavilySearchResponse;
}> {
  const emptyResponse: TavilySearchResponse = { results: [], query: '', responseTime: 0 };

  const [trendsResult, redditResult, subculturesResult] = await Promise.allSettled([
    searchTrends(`${category} ${brand}`),
    searchReddit(`${brand} ${category} opinions`),
    searchSubculture(targetAudience || category, brand),
  ]);

  return {
    trends: trendsResult.status === 'fulfilled' ? trendsResult.value : emptyResponse,
    reddit: redditResult.status === 'fulfilled' ? redditResult.value : emptyResponse,
    subcultures: subculturesResult.status === 'fulfilled' ? subculturesResult.value : emptyResponse,
  };
}

/**
 * Get an AI-generated answer for a question (uses Tavily's answer feature)
 */
export async function getAnswer(query: string): Promise<string | undefined> {
  try {
    const response = await search(query, {
      includeAnswer: true,
      searchDepth: 'advanced',
      maxResults: 5,
    });
    return response.answer;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[tavily] getAnswer failed: ${message}`);
    return undefined;
  }
}

/**
 * Check if Tavily is configured (Secret Manager or env var)
 */
export async function isConfigured(): Promise<boolean> {
  try {
    await getClient();
    return true;
  } catch {
    return false;
  }
}

// Export default client
export default {
  search,
  searchReddit,
  searchTrends,
  searchSubculture,
  getCulturalContext,
  getAnswer,
  isConfigured,
};
