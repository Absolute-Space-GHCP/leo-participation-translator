/**
 * @file types.ts
 * @description Type definitions for document parsing
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

/**
 * A chunk of text extracted from a document
 */
export interface DocumentChunk {
  /** Unique identifier for this chunk */
  id: string;
  
  /** The text content of the chunk */
  content: string;
  
  /** Token count (approximate) */
  tokenCount: number;
  
  /** Position in the original document */
  chunkIndex: number;
  
  /** Page or slide number (if applicable) */
  page?: number;
  
  /** Section or heading this chunk belongs to */
  section?: string;
}

/**
 * Metadata about the source document
 */
export interface DocumentMetadata {
  /** Original filename */
  filename: string;
  
  /** File type */
  fileType: 'pdf' | 'pptx' | 'docx';
  
  /** Client name (e.g., "Volkswagen", "Adidas") */
  client?: string;
  
  /** Campaign name */
  campaign?: string;
  
  /** Document type */
  documentType: 'presentation' | 'case_study' | 'framework' | 'other';
  
  /** Total pages/slides */
  pageCount?: number;
  
  /** Total chunks created */
  chunkCount: number;
  
  /** File size in bytes */
  fileSize: number;
  
  /** When the document was created */
  createdAt?: Date;
  
  /** When the document was ingested */
  ingestedAt: Date;
}

/**
 * Options for document parsing
 */
export interface ParseOptions {
  /** Target chunk size in tokens (default: 512) */
  chunkSize?: number;
  
  /** Overlap between chunks in tokens (default: 64) */
  chunkOverlap?: number;
  
  /** Preserve document structure (slides, sections) (default: true) */
  preserveStructure?: boolean;
  
  /** Client name to associate with chunks */
  client?: string;
  
  /** Campaign name to associate with chunks */
  campaign?: string;
  
  /** Document type */
  documentType?: 'presentation' | 'case_study' | 'framework' | 'other';
}
