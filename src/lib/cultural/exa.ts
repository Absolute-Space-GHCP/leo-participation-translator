/**
 * @file exa.ts
 * @description Exa.ai client for semantic web search and Reddit content
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-05
 */

import { config } from 'dotenv';
config();

const EXA_API_KEY = process.env.EXA_API_KEY;
const EXA_BASE_URL = 'https://api.exa.ai';

export interface ExaSearchResult {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  score: number;
  text?: string;
  highlights?: string[];
}

export interface ExaSearchResponse {
  results: ExaSearchResult[];
  autopromptString?: string;
}

export interface ExaSearchOptions {
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  useAutoprompt?: boolean;
  type?: 'keyword' | 'neural' | 'auto';
  contents?: {
    text?: boolean | { maxCharacters?: number };
    highlights?: boolean | { numSentences?: number };
  };
}

/**
 * Search the web using Exa.ai semantic search
 */
export async function search(
  query: string,
  options: ExaSearchOptions = {}
): Promise<ExaSearchResponse> {
  if (!EXA_API_KEY) {
    throw new Error('EXA_API_KEY not configured in environment');
  }

  const {
    numResults = 10,
    includeDomains,
    excludeDomains,
    startPublishedDate,
    endPublishedDate,
    useAutoprompt = true,
    type = 'auto',
    contents = { text: { maxCharacters: 1000 }, highlights: { numSentences: 3 } }
  } = options;

  const response = await fetch(`${EXA_BASE_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': EXA_API_KEY,
    },
    body: JSON.stringify({
      query,
      numResults,
      includeDomains,
      excludeDomains,
      startPublishedDate,
      endPublishedDate,
      useAutoprompt,
      type,
      contents,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Exa API error: ${response.status} - ${error}`);
  }

  return response.json() as Promise<ExaSearchResponse>;
}

/**
 * Search Reddit content via Exa
 * Note: Direct reddit.com domain filtering may have limited results due to 
 * Reddit's robots.txt. Using semantic search for Reddit-related content
 * provides better coverage.
 */
export async function searchReddit(
  query: string,
  options: Omit<ExaSearchOptions, 'includeDomains'> = {}
): Promise<ExaSearchResponse> {
  // Search for Reddit discussions semantically (better coverage than domain filter)
  const redditQuery = `reddit ${query} discussion community`;
  return search(redditQuery, {
    ...options,
    // Don't filter by domain - let semantic search find Reddit discussions
  });
}

/**
 * Search for trending topics in a category
 */
export async function searchTrends(
  category: string,
  options: ExaSearchOptions = {}
): Promise<ExaSearchResponse> {
  const trendQuery = `${category} trends 2026 viral popular`;
  return search(trendQuery, {
    ...options,
    numResults: options.numResults || 15,
    // Last 7 days
    startPublishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
}

/**
 * Search for subculture discussions
 */
export async function searchSubculture(
  subculture: string,
  brand?: string,
  options: ExaSearchOptions = {}
): Promise<ExaSearchResponse> {
  const query = brand 
    ? `${subculture} community ${brand} discussion opinions`
    : `${subculture} community culture discussion`;
  
  return search(query, {
    ...options,
    includeDomains: ['reddit.com', 'twitter.com', 'tiktok.com'],
  });
}

/**
 * Get cultural context for a brand/category
 */
export async function getCulturalContext(
  brand: string,
  category: string,
  targetAudience?: string
): Promise<{
  trends: ExaSearchResponse;
  reddit: ExaSearchResponse;
  subcultures: ExaSearchResponse;
}> {
  const [trends, reddit, subcultures] = await Promise.all([
    searchTrends(`${category} ${brand}`),
    searchReddit(`${brand} ${category} opinions`),
    searchSubculture(targetAudience || category, brand),
  ]);

  return { trends, reddit, subcultures };
}

// Export default client
export default {
  search,
  searchReddit,
  searchTrends,
  searchSubculture,
  getCulturalContext,
};
