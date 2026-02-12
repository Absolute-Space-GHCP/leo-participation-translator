/**
 * @file route.ts
 * @description Retrieval API route — direct vector search for Option C visibility
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

import { NextRequest, NextResponse } from "next/server";
import { searchSimilar } from "@/lib/embeddings";

/**
 * POST /api/retrieve
 *
 * Searches the Firestore vector store for chunks similar to the query.
 * Returns ranked results with similarity scores.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { query, topK = 10 } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Missing required field: query (string)" },
        { status: 400 }
      );
    }

    const results = await searchSimilar(query, topK);

    return NextResponse.json({
      query,
      results,
      count: results.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[retrieve] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
