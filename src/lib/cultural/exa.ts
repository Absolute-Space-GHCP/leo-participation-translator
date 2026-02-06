/**
 * @file exa.ts
 * @description Exa.ai client for semantic web search and Reddit content.
 *              API key is retrieved from Google Cloud Secret Manager (encrypted)
 *              with env-var fallback for local development.
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-06
 */

import { requireSecret } from '../secrets/index.js';

const EXA_BASE_URL = 'https://api.exa.ai';

/** Lazily resolved API key — fetched once from Secret Manager then cached. */
let _exaApiKey: string | null = null;

async function getExaApiKey(): Promise<string> {
  if (!_exaApiKey) {
    _exaApiKey = await requireSecret('EXA_API_KEY');
  }
  return _exaApiKey;
}

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
  const apiKey = await getExaApiKey();

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
      'x-api-key': apiKey,
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
  const trendQuery = `${category} trends ${new Date().getFullYear()} viral popular`;
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
  const emptyResponse: ExaSearchResponse = { results: [] };

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

// Export default client
export default {
  search,
  searchReddit,
  searchTrends,
  searchSubculture,
  getCulturalContext,
};
