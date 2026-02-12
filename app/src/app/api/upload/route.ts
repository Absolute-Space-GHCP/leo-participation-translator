/**
 * @file route.ts
 * @description File upload API route — in-memory text extraction, no disk writes
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 *
 * DESIGN DECISIONS (avoiding yesterday's failures):
 *   1. No child processes — parsing happens directly in this route
 *   2. No filesystem writes — buffer stays in memory
 *   3. Validation before processing — size/type checks first
 *   4. Returns extracted text — client stores in state for generation
 */

import { NextRequest, NextResponse } from "next/server";
import { validateFile, parseFile } from "@/lib/file-parser";

export const maxDuration = 120; // 2 min timeout for large file parsing (up to 150MB)

/**
 * POST /api/upload
 *
 * Accepts a single file via FormData, extracts text content in-memory,
 * and returns the extracted text. Nothing is written to disk.
 *
 * FormData fields:
 *   file — the uploaded file (required)
 *
 * Returns:
 *   { text, filename, fileType, pageCount?, charCount }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse FormData
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided. Send a file via FormData with key 'file'." },
        { status: 400 }
      );
    }

    // Validate file before processing
    const validation = validateFile(file.name, file.size);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Read file into buffer (in-memory, no disk)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text
    const result = await parseFile(buffer, file.name);

    // Truncate very large text to prevent prompt overflow
    const MAX_TEXT_LENGTH = 100_000; // ~25K tokens
    const truncated = result.text.length > MAX_TEXT_LENGTH;
    const text = truncated
      ? result.text.substring(0, MAX_TEXT_LENGTH) +
        "\n\n[... truncated — original was " +
        result.charCount.toLocaleString() +
        " characters]"
      : result.text;

    return NextResponse.json({
      text,
      filename: result.filename,
      fileType: result.fileType,
      pageCount: result.pageCount,
      charCount: result.charCount,
      truncated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[upload] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
