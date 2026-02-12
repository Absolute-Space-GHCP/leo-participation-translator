/**
 * @file types.ts
 * @description Shared types for the Participation Translator demo
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

/** Project seed data submitted by the user */
export interface ProjectSeed {
  brand: string;
  category: string;
  passiveIdea: string;
  audience: string;
  budget?: string;
  timeline?: string;
  context?: string;
  /** Extracted text from uploaded reference files */
  uploadedDocuments?: UploadedDocument[];
  /** Optional refinement notes for iterating on a previous generation */
  refinementNotes?: string;
}

/** An uploaded reference document with extracted text */
export interface UploadedDocument {
  filename: string;
  fileType: string;
  text: string;
  charCount: number;
  pageCount?: number;
}

/** A single chunk from the vector store */
export interface RetrievedChunk {
  id: string;
  content: string;
  score: number;
  metadata: {
    client?: string;
    filename?: string;
    documentType?: string;
    campaign?: string;
    page?: number;
    section?: string;
  };
}

/** Cultural intelligence result from Exa or Tavily */
export interface CulturalResult {
  title: string;
  content: string;
  url?: string;
  source: "exa" | "tavily";
  sourceType: "trend" | "discussion" | "news";
  score: number;
}

/** Knowledge base statistics */
export interface KnowledgeBaseStats {
  documentCount: number;
  chunkCount: number;
  clients: string[];
}

/** SSE event types for streaming generation */
export type SSEEventType =
  | "status"
  | "context"
  | "chunk"
  | "done"
  | "error";

/** SSE status event */
export interface SSEStatusEvent {
  step: "retrieving" | "cultural" | "assembling" | "generating" | "complete";
  message: string;
}

/** SSE context event (sent after retrieval) */
export interface SSEContextEvent {
  chunks: RetrievedChunk[];
  culturalResults: CulturalResult[];
  summary: {
    institutionalCount: number;
    culturalCount: number;
    themes: string[];
  };
}

/** SSE done event */
export interface SSEDoneEvent {
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  durationMs: number;
}
