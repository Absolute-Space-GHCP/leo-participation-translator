/**
 * @file file-parser.ts
 * @description In-memory file text extraction (PPTX, PDF, DOCX, TXT/MD)
 *              NO filesystem writes. Operates entirely on buffers.
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

// ── Supported file types ──

const SUPPORTED_EXTENSIONS = new Set([
  "pptx",
  "pdf",
  "docx",
  "txt",
  "md",
  "csv",
]);

const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150 MB — large PPTX files are mostly images; text extraction is lightweight

export interface ParseResult {
  text: string;
  filename: string;
  fileType: string;
  pageCount?: number;
  charCount: number;
}

/**
 * Validate a file before parsing.
 */
export function validateFile(
  filename: string,
  size: number
): { valid: boolean; error?: string } {
  const ext = filename.toLowerCase().split(".").pop() || "";

  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `Unsupported file type: .${ext}. Supported: ${[...SUPPORTED_EXTENSIONS].join(", ")}`,
    };
  }

  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(size / 1024 / 1024).toFixed(1)}MB. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * Extract text from a file buffer. Entirely in-memory.
 */
export async function parseFile(
  buffer: Buffer,
  filename: string
): Promise<ParseResult> {
  const ext = filename.toLowerCase().split(".").pop() || "";

  switch (ext) {
    case "pptx":
      return parsePPTX(buffer, filename);
    case "pdf":
      return parsePDF(buffer, filename);
    case "docx":
      return parseDOCX(buffer, filename);
    case "txt":
    case "md":
    case "csv":
      return parsePlainText(buffer, filename, ext);
    default:
      throw new Error(`Unsupported file type: .${ext}`);
  }
}

// ── PPTX Parser (using PizZip — same as root project) ──

async function parsePPTX(
  buffer: Buffer,
  filename: string
): Promise<ParseResult> {
  const PizZip = (await import("pizzip")).default;
  const zip = new PizZip(buffer);

  const slides: string[] = [];
  let slideNum = 1;

  while (true) {
    const slidePath = `ppt/slides/slide${slideNum}.xml`;
    const slideFile = zip.file(slidePath);
    if (!slideFile) break;

    const xml = slideFile.asText();
    const slideText = extractTextFromXml(xml);

    // Also get speaker notes
    const notesPath = `ppt/notesSlides/notesSlide${slideNum}.xml`;
    const notesFile = zip.file(notesPath);
    let notesText = "";
    if (notesFile) {
      const notesXml = notesFile.asText();
      notesText = extractTextFromXml(notesXml);
    }

    const combined = [
      slideText.trim(),
      notesText.trim() ? `[Speaker Notes]\n${notesText.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    if (combined) {
      slides.push(`--- Slide ${slideNum} ---\n${combined}`);
    }

    slideNum++;
  }

  const text = slides.join("\n\n");

  return {
    text,
    filename,
    fileType: "pptx",
    pageCount: slideNum - 1,
    charCount: text.length,
  };
}

/**
 * Extract text content from PPTX XML (strips all XML tags, preserves text).
 */
function extractTextFromXml(xml: string): string {
  // Extract text inside <a:t> tags (PowerPoint text elements)
  const textMatches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g);
  if (!textMatches) return "";

  const texts: string[] = [];
  let currentParagraph: string[] = [];

  // Also check for paragraph breaks to maintain structure
  const elements = xml.match(/<(?:a:t[^>]*>[^<]*<\/a:t>|a:br\s*\/>|\/a:p>)/g);
  if (!elements) {
    // Fallback: just extract all text
    return textMatches
      .map((m) => {
        const match = m.match(/<a:t[^>]*>([^<]*)<\/a:t>/);
        return match ? match[1] : "";
      })
      .join(" ");
  }

  for (const el of elements) {
    if (el.startsWith("<a:t")) {
      const match = el.match(/<a:t[^>]*>([^<]*)<\/a:t>/);
      if (match) currentParagraph.push(match[1]);
    } else if (el === "</a:p>" || el.includes("a:br")) {
      if (currentParagraph.length > 0) {
        texts.push(currentParagraph.join(""));
        currentParagraph = [];
      }
    }
  }

  if (currentParagraph.length > 0) {
    texts.push(currentParagraph.join(""));
  }

  return texts.filter(Boolean).join("\n");
}

// ── PDF Parser ──

async function parsePDF(
  buffer: Buffer,
  filename: string
): Promise<ParseResult> {
  // pdf-parse uses a default export — use type assertion for ESM compat
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfModule = await import("pdf-parse") as any;
  const pdfParse = pdfModule.default ?? pdfModule;
  const data = await pdfParse(buffer);

  return {
    text: data.text,
    filename,
    fileType: "pdf",
    pageCount: data.numpages,
    charCount: data.text.length,
  };
}

// ── DOCX Parser ──

async function parseDOCX(
  buffer: Buffer,
  filename: string
): Promise<ParseResult> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });

  return {
    text: result.value,
    filename,
    fileType: "docx",
    charCount: result.value.length,
  };
}

// ── Plain Text Parser ──

async function parsePlainText(
  buffer: Buffer,
  filename: string,
  ext: string
): Promise<ParseResult> {
  const text = buffer.toString("utf-8");

  return {
    text,
    filename,
    fileType: ext,
    charCount: text.length,
  };
}
