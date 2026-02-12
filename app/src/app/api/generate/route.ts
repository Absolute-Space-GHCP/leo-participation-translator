/**
 * @file route.ts
 * @description Streaming generation API route — RAG retrieval + cultural intel + Claude
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

import { NextRequest } from "next/server";
import { searchSimilar } from "@/lib/embeddings";
import { streamGeneration } from "@/lib/claude";
import { getCulturalContext, formatCulturalContext } from "@/lib/cultural";
import {
  buildSystemPrompt,
  buildUserPrompt,
  formatRetrievedContext,
} from "@/lib/prompts";
import type { ProjectSeed } from "@/lib/types";

export const maxDuration = 300; // 5 min timeout for streaming

/**
 * POST /api/generate
 *
 * Accepts a ProjectSeed, runs the full RAG pipeline, and streams
 * the Claude response back as Server-Sent Events (SSE).
 *
 * SSE events:
 *   status  — progress updates (retrieving, cultural, generating, complete)
 *   context — retrieved chunks and cultural results (for Option C visibility)
 *   chunk   — text delta from Claude
 *   done    — final metadata (model, tokens, duration)
 *   error   — error message
 */
export async function POST(request: NextRequest): Promise<Response> {
  const startTime = Date.now();

  // Parse and validate request body
  let seed: ProjectSeed;
  try {
    seed = await request.json();
    if (!seed.brand || !seed.passiveIdea || !seed.audience || !seed.category) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: brand, category, passiveIdea, audience",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Create SSE stream
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(event: string, data: unknown): void {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      }

      try {
        // ── Step 1: RAG Retrieval ──
        sendEvent("status", {
          step: "retrieving",
          message: "Searching JL institutional knowledge...",
        });

        const query = `${seed.brand} ${seed.category} ${seed.passiveIdea} participation`;
        const chunks = await searchSimilar(query, 10);

        // ── Step 2: Cultural Intelligence ──
        sendEvent("status", {
          step: "cultural",
          message: "Gathering real-time cultural intelligence...",
        });

        const culturalResults = await getCulturalContext(
          seed.brand,
          seed.category,
          seed.audience
        );

        // Send context event (for Option C to display)
        sendEvent("context", {
          chunks: chunks.map((c) => ({
            id: c.id,
            content: c.content.substring(0, 200),
            score: c.score,
            metadata: c.metadata,
          })),
          culturalResults: culturalResults.slice(0, 10).map((r) => ({
            title: r.title,
            content: r.content.substring(0, 200),
            source: r.source,
            sourceType: r.sourceType,
            score: r.score,
          })),
          summary: {
            institutionalCount: chunks.length,
            culturalCount: culturalResults.length,
            themes: [],
          },
        });

        // ── Step 3: Assemble Prompt ──
        sendEvent("status", {
          step: "assembling",
          message: "Assembling strategic prompt...",
        });

        const systemPrompt = buildSystemPrompt();
        const retrievedContext = formatRetrievedContext(chunks);
        const culturalContext = formatCulturalContext(culturalResults);

        // Include uploaded documents as additional context
        let uploadedContext = "";
        if (seed.uploadedDocuments && seed.uploadedDocuments.length > 0) {
          uploadedContext = "\n---\n\n## UPLOADED REFERENCE DOCUMENTS\nThe user provided these additional reference documents. Use them as supplementary context:\n\n";
          for (const doc of seed.uploadedDocuments) {
            uploadedContext += `### ${doc.filename} (${doc.fileType}${doc.pageCount ? `, ${doc.pageCount} pages` : ""})\n${doc.text.substring(0, 10000)}\n\n`;
          }
        }

        const userPrompt = buildUserPrompt(seed, retrievedContext, culturalContext + uploadedContext);

        // ── Step 4: Stream Claude Response ──
        sendEvent("status", {
          step: "generating",
          message: "Generating participation blueprint...",
        });

        const generator = streamGeneration(systemPrompt, userPrompt);

        for await (const event of generator) {
          if (event.type === "text") {
            sendEvent("chunk", { text: event.text });
          } else if (event.type === "done") {
            sendEvent("status", {
              step: "complete",
              message: "Blueprint generation complete",
            });
            sendEvent("done", {
              model: event.model,
              usage: {
                inputTokens: event.inputTokens,
                outputTokens: event.outputTokens,
              },
              durationMs: Date.now() - startTime,
            });
          }
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        console.error("[generate] Error:", message);
        sendEvent("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
