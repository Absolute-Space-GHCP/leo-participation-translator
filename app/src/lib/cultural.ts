/**
 * @file cultural.ts
 * @description Cultural intelligence layer: Exa.ai + Tavily search integration
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

import { tavily } from "@tavily/core";
import type { CulturalResult } from "./types";

// ── Exa.ai (Primary - fetch-based) ──

const EXA_BASE_URL = "https://api.exa.ai";

interface ExaResult {
  title: string;
  url: string;
  score: number;
  text?: string;
  highlights?: string[];
  publishedDate?: string;
}

async function exaSearch(
  query: string,
  options: {
    numResults?: number;
    startPublishedDate?: string;
    type?: "keyword" | "neural" | "auto";
  } = {}
): Promise<ExaResult[]> {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    console.warn("[cultural] EXA_API_KEY not set, skipping Exa search");
    return [];
  }

  try {
    const response = await fetch(`${EXA_BASE_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        query,
        numResults: options.numResults || 5,
        startPublishedDate: options.startPublishedDate,
        type: options.type || "auto",
        useAutoprompt: true,
        contents: {
          text: { maxCharacters: 800 },
          highlights: { numSentences: 2 },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.warn(`[cultural] Exa search failed: ${response.status} - ${error}`);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.warn("[cultural] Exa search error:", error);
    return [];
  }
}

// ── Tavily (Backup/Supplement) ──

let tavilyClient: ReturnType<typeof tavily> | null = null;

function getTavilyClient(): ReturnType<typeof tavily> | null {
  if (!tavilyClient) {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      console.warn("[cultural] TAVILY_API_KEY not set, skipping Tavily search");
      return null;
    }
    tavilyClient = tavily({ apiKey });
  }
  return tavilyClient;
}

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

async function tavilySearch(
  query: string,
  options: {
    maxResults?: number;
    topic?: "general" | "news";
    days?: number;
  } = {}
): Promise<TavilyResult[]> {
  const client = getTavilyClient();
  if (!client) return [];

  try {
    const response = await client.search(query, {
      searchDepth: "basic",
      maxResults: options.maxResults || 5,
      topic: options.topic || "general",
      days: options.days,
    });

    return response.results.map(
      (r: { title: string; url: string; content: string; score: number }) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })
    );
  } catch (error) {
    console.warn("[cultural] Tavily search error:", error);
    return [];
  }
}

// ── Public API ──

/**
 * Fetch cultural intelligence for a brand/category.
 * Runs Exa + Tavily in parallel, merges and deduplicates results.
 */
export async function getCulturalContext(
  brand: string,
  category: string,
  audience?: string
): Promise<CulturalResult[]> {
  const year = new Date().getFullYear();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Build queries
  const trendQuery = `${brand} ${category} trends ${year} viral popular`;
  const discussionQuery = `${brand} ${category} discussion opinions community`;

  // Parallel searches
  const [exaTrends, exaDiscussions, tavilyTrends, tavilyDiscussions] =
    await Promise.all([
      exaSearch(trendQuery, {
        numResults: 5,
        startPublishedDate: sevenDaysAgo,
      }),
      exaSearch(`reddit ${discussionQuery}`, { numResults: 5 }),
      tavilySearch(trendQuery, { maxResults: 5, topic: "news", days: 7 }),
      tavilySearch(discussionQuery, { maxResults: 5 }),
    ]);

  // Convert to unified format
  const results: CulturalResult[] = [];
  const seen = new Set<string>();

  function addIfNew(result: CulturalResult): void {
    const key = result.url || result.title.toLowerCase().slice(0, 50);
    if (!seen.has(key)) {
      seen.add(key);
      results.push(result);
    }
  }

  for (const r of exaTrends) {
    addIfNew({
      title: r.title,
      content: r.highlights?.[0] || r.text || "",
      url: r.url,
      source: "exa",
      sourceType: "trend",
      score: r.score || 0.5,
    });
  }

  for (const r of exaDiscussions) {
    addIfNew({
      title: r.title,
      content: r.highlights?.[0] || r.text || "",
      url: r.url,
      source: "exa",
      sourceType: "discussion",
      score: r.score || 0.5,
    });
  }

  for (const r of tavilyTrends) {
    addIfNew({
      title: r.title,
      content: r.content,
      url: r.url,
      source: "tavily",
      sourceType: "news",
      score: r.score || 0.5,
    });
  }

  for (const r of tavilyDiscussions) {
    addIfNew({
      title: r.title,
      content: r.content,
      url: r.url,
      source: "tavily",
      sourceType: "discussion",
      score: r.score || 0.5,
    });
  }

  return results;
}

/**
 * Format cultural results as context for Claude's prompt.
 */
export function formatCulturalContext(results: CulturalResult[]): string {
  if (results.length === 0) {
    return "No real-time cultural intelligence available for this query.";
  }

  const sections: string[] = [];

  const trends = results.filter((r) => r.sourceType === "trend" || r.sourceType === "news");
  const discussions = results.filter((r) => r.sourceType === "discussion");

  if (trends.length > 0) {
    sections.push("### Current Trends & News\n");
    for (const r of trends.slice(0, 5)) {
      sections.push(`**${r.title}** [${r.source}]`);
      if (r.url) sections.push(`Source: ${r.url}`);
      sections.push(`${r.content.substring(0, 300)}\n`);
    }
  }

  if (discussions.length > 0) {
    sections.push("### Community Discussions\n");
    for (const r of discussions.slice(0, 5)) {
      sections.push(`**${r.title}** [${r.source}]`);
      if (r.url) sections.push(`Source: ${r.url}`);
      sections.push(`${r.content.substring(0, 300)}\n`);
    }
  }

  return sections.join("\n");
}
