/**
 * @file route.ts
 * @description Knowledge base stats API route
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

import { NextResponse } from "next/server";
import { getStats } from "@/lib/embeddings";

/**
 * GET /api/stats
 *
 * Returns knowledge base statistics: document count, chunk count, and client list.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[stats] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
