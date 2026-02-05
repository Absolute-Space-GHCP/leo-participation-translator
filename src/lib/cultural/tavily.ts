/**
 * @file tavily.ts
 * @description Tavily client for semantic web search (backup to Exa.ai)
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-05
 */

import { tavily } from '@tavily/core';
import { config } from 'dotenv';
config();

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// Initialize Tavily client (lazy)
let tavilyClient: ReturnType<typeof tavily> | null = null;

function getClient() {
  if (!TAVILY_API_KEY) {
    throw new Error('TAVILY_API_KEY not configured in environment');
  }
  if (!tavilyClient) {
    tavilyClient = tavily({ apiKey: TAVILY_API_KEY });
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
  const client = getClient();

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
  const trendQuery = `${category} trends 2026 viral popular`;
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
  const [trends, reddit, subcultures] = await Promise.all([
    searchTrends(`${category} ${brand}`),
    searchReddit(`${brand} ${category} opinions`),
    searchSubculture(targetAudience || category, brand),
  ]);

  return { trends, reddit, subcultures };
}

/**
 * Get an AI-generated answer for a question (uses Tavily's answer feature)
 */
export async function getAnswer(query: string): Promise<string | undefined> {
  const response = await search(query, {
    includeAnswer: true,
    searchDepth: 'advanced',
    maxResults: 5,
  });
  return response.answer;
}

/**
 * Check if Tavily is configured
 */
export function isConfigured(): boolean {
  return !!TAVILY_API_KEY;
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
