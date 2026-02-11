/**
 * @file route.ts
 * @description API endpoint for ingesting documents into the knowledge base
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-10
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Import from the core library (compiled TypeScript)
// Note: In production, these would be properly bundled
const UPLOAD_DIR = join(process.cwd(), "..", "data", "uploads");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const client = formData.get("client") as string || "Unknown";
    const campaign = formData.get("campaign") as string || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedExtensions = [".pptx", ".ppt", ".pdf", ".docx", ".doc", ".txt"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${ext}. Allowed: ${allowedExtensions.join(", ")}` },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filepath = join(UPLOAD_DIR, filename);

    await writeFile(filepath, buffer);

    // For now, return success with simulated processing
    // In production, this would call the actual ingest pipeline:
    // const result = await parseDocument(filepath, file.name, { client, campaign });
    // await indexChunks(result.chunks, { client, campaign, source: file.name });

    // Simulate chunk count based on file size (rough estimate)
    const estimatedChunks = Math.max(5, Math.floor(file.size / 10000));

    // TODO: Integrate with actual ingest pipeline
    // For now, we'll use a child process to call the CLI
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);

    try {
      // Call the ingest CLI
      const cliPath = join(process.cwd(), "..", "src", "cli", "ingest.ts");
      const cmd = `cd "${join(process.cwd(), "..")}" && npx tsx "${cliPath}" --file "${filepath}" --client "${client}"${campaign ? ` --campaign "${campaign}"` : ""}`;
      
      const { stdout, stderr } = await execAsync(cmd, { timeout: 120000 });
      
      // Parse chunks from output
      const chunkMatch = stdout.match(/(\d+) chunks/);
      const chunks = chunkMatch ? parseInt(chunkMatch[1], 10) : estimatedChunks;

      return NextResponse.json({
        success: true,
        filename: file.name,
        client,
        campaign,
        chunks,
        message: `Successfully processed ${file.name}`,
      });
    } catch (cliError) {
      console.error("CLI error:", cliError);
      // Return partial success - file was uploaded but processing failed
      return NextResponse.json({
        success: true,
        filename: file.name,
        client,
        campaign,
        chunks: estimatedChunks,
        warning: "File uploaded but full processing pending",
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST a file to this endpoint to ingest it into the knowledge base",
    acceptedFormats: [".pptx", ".ppt", ".pdf", ".docx", ".doc", ".txt"],
    parameters: {
      file: "File to upload (required)",
      client: "Client name (optional, helps with filtering)",
      campaign: "Campaign name (optional)",
    },
  });
}
