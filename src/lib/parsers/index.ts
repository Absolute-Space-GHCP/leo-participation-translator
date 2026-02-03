/**
 * @file index.ts
 * @description Document parsing module for PDF, PPTX, and DOCX files
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

import { v4 as uuidv4 } from 'uuid';
import type { DocumentChunk, DocumentMetadata, ParseOptions } from './types.js';

// Re-export types
export * from './types.js';

/**
 * Parse a document and extract text chunks with metadata
 * 
 * Supported formats:
 * - PDF (.pdf) - via pdf-parse
 * - PowerPoint (.pptx) - via custom extraction
 * - Word (.docx) - via mammoth
 * 
 * @param file - File buffer or path
 * @param filename - Original filename (for type detection and metadata)
 * @param options - Parsing configuration
 * @returns Structured chunks with metadata
 */
export async function parseDocument(
  file: Buffer | string,
  filename: string,
  options: ParseOptions = {}
): Promise<{ chunks: DocumentChunk[]; metadata: DocumentMetadata }> {
  const fileType = detectFileType(filename);
  
  if (fileType === 'unknown') {
    throw new Error(`Unsupported file type: ${filename}`);
  }
  
  // Get file buffer
  let buffer: Buffer;
  if (typeof file === 'string') {
    const fs = await import('fs/promises');
    buffer = await fs.readFile(file);
  } else {
    buffer = file;
  }
  
  // Parse based on file type
  let result: { chunks: DocumentChunk[]; metadata: DocumentMetadata };
  
  switch (fileType) {
    case 'pdf':
      result = await parsePDF(buffer, filename, options);
      break;
    case 'pptx':
      result = await parsePPTX(buffer, filename, options);
      break;
    case 'docx':
      result = await parseDOCX(buffer, filename, options);
      break;
    case 'txt':
      result = await parseTXT(buffer, filename, options);
      break;
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
  
  return result;
}

/**
 * Parse a PDF document
 */
export async function parsePDF(
  file: Buffer | string,
  filename: string,
  options: ParseOptions = {}
): Promise<{ chunks: DocumentChunk[]; metadata: DocumentMetadata }> {
  // Dynamic import for pdf-parse
  const pdfParse = (await import('pdf-parse')).default;
  
  // Get buffer
  let buffer: Buffer;
  if (typeof file === 'string') {
    const fs = await import('fs/promises');
    buffer = await fs.readFile(file);
  } else {
    buffer = file;
  }
  
  // Parse PDF
  const data = await pdfParse(buffer);
  
  // Extract text and chunk it
  const chunks = chunkText(data.text, options);
  
  const metadata: DocumentMetadata = {
    filename,
    fileType: 'pdf',
    client: options.client,
    campaign: options.campaign,
    documentType: options.documentType || 'other',
    pageCount: data.numpages,
    chunkCount: chunks.length,
    fileSize: buffer.length,
    ingestedAt: new Date(),
  };
  
  return { chunks, metadata };
}

/**
 * Parse a PowerPoint document
 */
export async function parsePPTX(
  file: Buffer | string,
  filename: string,
  options: ParseOptions = {}
): Promise<{ chunks: DocumentChunk[]; metadata: DocumentMetadata }> {
  const PizZip = (await import('pizzip')).default;
  
  // Get buffer
  let buffer: Buffer;
  if (typeof file === 'string') {
    const fs = await import('fs/promises');
    buffer = await fs.readFile(file);
  } else {
    buffer = file;
  }
  
  // Unzip PPTX (it's a zip file)
  const zip = new PizZip(buffer);
  
  // Extract text from slides
  const slides: { slideNumber: number; text: string }[] = [];
  
  // PPTX stores slides in ppt/slides/slide{n}.xml
  let slideNum = 1;
  while (true) {
    const slidePath = `ppt/slides/slide${slideNum}.xml`;
    const slideFile = zip.file(slidePath);
    
    if (!slideFile) break;
    
    const slideXml = slideFile.asText();
    const text = extractTextFromPPTXSlide(slideXml);
    
    if (text.trim()) {
      slides.push({ slideNumber: slideNum, text: text.trim() });
    }
    
    slideNum++;
  }
  
  // Create chunks (one per slide if preserveStructure, otherwise chunk all text)
  let chunks: DocumentChunk[];
  
  if (options.preserveStructure !== false) {
    // One chunk per slide (or split large slides)
    chunks = [];
    for (const slide of slides) {
      const slideChunks = chunkText(slide.text, {
        ...options,
        // Keep slide context together if possible
        chunkSize: options.chunkSize || 1024,
      });
      
      for (const chunk of slideChunks) {
        chunks.push({
          ...chunk,
          page: slide.slideNumber,
          section: `Slide ${slide.slideNumber}`,
        });
      }
    }
  } else {
    // Combine all text and chunk
    const allText = slides.map(s => s.text).join('\n\n');
    chunks = chunkText(allText, options);
  }
  
  // Re-index chunks
  chunks = chunks.map((chunk, index) => ({
    ...chunk,
    chunkIndex: index,
  }));
  
  const metadata: DocumentMetadata = {
    filename,
    fileType: 'pptx',
    client: options.client,
    campaign: options.campaign,
    documentType: options.documentType || 'presentation',
    pageCount: slideNum - 1,
    chunkCount: chunks.length,
    fileSize: buffer.length,
    ingestedAt: new Date(),
  };
  
  return { chunks, metadata };
}

/**
 * Extract text from a PPTX slide XML
 */
function extractTextFromPPTXSlide(xml: string): string {
  // Simple regex-based text extraction from PPTX XML
  // Looks for <a:t> tags which contain text content
  const textMatches = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
  
  const texts = textMatches.map(match => {
    const content = match.replace(/<a:t>/, '').replace(/<\/a:t>/, '');
    return content;
  });
  
  // Join with spaces, but add newlines for paragraph breaks
  // Look for </a:p> which indicates paragraph end
  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];
  
  for (const text of texts) {
    currentParagraph.push(text);
    // Simple heuristic: if text ends with punctuation, might be end of paragraph
  }
  
  paragraphs.push(currentParagraph.join(' '));
  
  return paragraphs.join('\n').trim();
}

/**
 * Parse a Word document
 */
export async function parseDOCX(
  file: Buffer | string,
  filename: string,
  options: ParseOptions = {}
): Promise<{ chunks: DocumentChunk[]; metadata: DocumentMetadata }> {
  const mammoth = await import('mammoth');
  
  // Get buffer
  let buffer: Buffer;
  if (typeof file === 'string') {
    const fs = await import('fs/promises');
    buffer = await fs.readFile(file);
  } else {
    buffer = file;
  }
  
  // Extract text using mammoth
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value;
  
  // Chunk the text
  const chunks = chunkText(text, options);
  
  const metadata: DocumentMetadata = {
    filename,
    fileType: 'docx',
    client: options.client,
    campaign: options.campaign,
    documentType: options.documentType || 'other',
    chunkCount: chunks.length,
    fileSize: buffer.length,
    ingestedAt: new Date(),
  };
  
  return { chunks, metadata };
}

/**
 * Chunk text into smaller pieces with overlap
 */
export function chunkText(
  text: string,
  options: ParseOptions = {}
): DocumentChunk[] {
  const {
    chunkSize = 512,
    chunkOverlap = 64,
  } = options;
  
  // Clean the text
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  if (!cleanedText) {
    return [];
  }
  
  // Approximate token count (rough estimate: 1 token ≈ 4 chars)
  const charSize = chunkSize * 4;
  const charOverlap = chunkOverlap * 4;
  
  const chunks: DocumentChunk[] = [];
  let start = 0;
  let chunkIndex = 0;
  let prevStart = -1; // Track previous start to detect infinite loop
  
  while (start < cleanedText.length) {
    // Detect infinite loop
    if (start === prevStart) {
      console.warn('Chunking infinite loop detected, breaking');
      break;
    }
    prevStart = start;
    
    // Find end of chunk
    let end = start + charSize;
    
    // Try to break at sentence or paragraph boundary
    if (end < cleanedText.length) {
      // Look for paragraph break
      const paragraphBreak = cleanedText.lastIndexOf('\n\n', end);
      if (paragraphBreak > start + charSize * 0.5) {
        end = paragraphBreak;
      } else {
        // Look for sentence break
        const sentenceBreak = cleanedText.lastIndexOf('. ', end);
        if (sentenceBreak > start + charSize * 0.5) {
          end = sentenceBreak + 1;
        }
      }
    } else {
      end = cleanedText.length;
    }
    
    const content = cleanedText.slice(start, end).trim();
    
    if (content) {
      chunks.push({
        id: uuidv4(),
        content,
        tokenCount: Math.ceil(content.length / 4), // Approximate
        chunkIndex,
      });
      chunkIndex++;
    }
    
    // Move start forward
    // For small texts (< charSize), just finish
    if (end >= cleanedText.length) {
      break;
    }
    
    // Calculate next start with overlap
    const nextStart = end - charOverlap;
    
    // Ensure we always move forward by at least 1 character
    start = Math.max(nextStart, start + 1);
  }
  
  return chunks;
}

/**
 * Detect file type from buffer or extension
 */
export function detectFileType(filename: string): 'pdf' | 'pptx' | 'docx' | 'txt' | 'unknown' {
  const ext = filename.toLowerCase().split('.').pop();
  
  switch (ext) {
    case 'pdf':
      return 'pdf';
    case 'pptx':
      return 'pptx';
    case 'docx':
      return 'docx';
    case 'txt':
      return 'txt';
    default:
      return 'unknown';
  }
}

/**
 * Parse a plain text file (for testing)
 */
export async function parseTXT(
  file: Buffer | string,
  filename: string,
  options: ParseOptions = {}
): Promise<{ chunks: DocumentChunk[]; metadata: DocumentMetadata }> {
  // Get buffer or read file
  let text: string;
  if (typeof file === 'string') {
    const fs = await import('fs/promises');
    text = await fs.readFile(file, 'utf-8');
  } else {
    text = file.toString('utf-8');
  }
  
  // Chunk the text
  const chunks = chunkText(text, options);
  
  const metadata: DocumentMetadata = {
    filename,
    fileType: 'docx', // Use docx as fallback type for metadata
    client: options.client,
    campaign: options.campaign,
    documentType: options.documentType || 'other',
    chunkCount: chunks.length,
    fileSize: Buffer.byteLength(text, 'utf-8'),
    ingestedAt: new Date(),
  };
  
  return { chunks, metadata };
}
