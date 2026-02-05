/**
 * @file convert.ts
 * @description Convert PPTX files to Markdown for version control
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-05
 */

import { parseArgs } from 'util';
import { readdir, writeFile, mkdir, stat } from 'fs/promises';
import { join, basename, dirname } from 'path';
import PizZip from 'pizzip';
import { readFile } from 'fs/promises';

interface ConvertOptions {
  input: string;
  output?: string;
  batch?: boolean;
  includeAnalysis?: boolean;
}

interface SlideData {
  slideNumber: number;
  text: string;
  speakerNotes?: string;
  textLength: number;
}

/**
 * Extract slides from a PPTX file
 */
async function extractSlidesFromPPTX(filePath: string): Promise<{
  slides: SlideData[];
  metadata: {
    filename: string;
    totalSlides: number;
    totalTextChars: number;
    avgTextPerSlide: number;
    slidesWithNotes: number;
  };
}> {
  const buffer = await readFile(filePath);
  const zip = new PizZip(buffer);
  
  const slides: SlideData[] = [];
  let slideNum = 1;
  
  while (true) {
    const slidePath = `ppt/slides/slide${slideNum}.xml`;
    const slideFile = zip.file(slidePath);
    
    if (!slideFile) break;
    
    const slideXml = slideFile.asText();
    const text = extractTextFromXml(slideXml);
    
    // Extract speaker notes
    let speakerNotes: string | undefined;
    const notesPath = `ppt/notesSlides/notesSlide${slideNum}.xml`;
    const notesFile = zip.file(notesPath);
    if (notesFile) {
      const notesXml = notesFile.asText();
      speakerNotes = extractTextFromXml(notesXml);
      // Clean up default placeholder text
      if (speakerNotes) {
        speakerNotes = speakerNotes
          .replace(/Click to edit Master text styles?/gi, '')
          .replace(/Second level/gi, '')
          .replace(/Third level/gi, '')
          .replace(/Fourth level/gi, '')
          .replace(/Fifth level/gi, '')
          .trim();
      }
    }
    
    slides.push({
      slideNumber: slideNum,
      text: text.trim(),
      speakerNotes: speakerNotes || undefined,
      textLength: text.length,
    });
    
    slideNum++;
  }
  
  const totalTextChars = slides.reduce((sum, s) => sum + s.textLength, 0);
  const slidesWithNotes = slides.filter(s => s.speakerNotes && s.speakerNotes.length > 10).length;
  
  return {
    slides,
    metadata: {
      filename: basename(filePath),
      totalSlides: slides.length,
      totalTextChars,
      avgTextPerSlide: slides.length > 0 ? Math.round(totalTextChars / slides.length) : 0,
      slidesWithNotes,
    },
  };
}

/**
 * Extract text from PPTX XML
 */
function extractTextFromXml(xml: string): string {
  const textMatches = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
  
  const texts = textMatches.map(match => {
    return match.replace(/<a:t>/, '').replace(/<\/a:t>/, '');
  });
  
  return texts.join(' ').trim();
}

/**
 * Convert slides to Markdown format
 */
function slidesToMarkdown(
  slides: SlideData[],
  metadata: {
    filename: string;
    totalSlides: number;
    totalTextChars: number;
    avgTextPerSlide: number;
    slidesWithNotes: number;
  },
  options: { includeAnalysis?: boolean } = {}
): string {
  const lines: string[] = [];
  
  // YAML frontmatter
  lines.push('---');
  lines.push(`source: "${metadata.filename}"`);
  lines.push(`total_slides: ${metadata.totalSlides}`);
  lines.push(`total_chars: ${metadata.totalTextChars}`);
  lines.push(`avg_chars_per_slide: ${metadata.avgTextPerSlide}`);
  lines.push(`slides_with_notes: ${metadata.slidesWithNotes}`);
  lines.push(`converted_at: "${new Date().toISOString()}"`);
  lines.push('---');
  lines.push('');
  
  // Title from filename
  const title = metadata.filename
    .replace(/\.pptx$/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ');
  lines.push(`# ${title}`);
  lines.push('');
  
  // Analysis section (optional)
  if (options.includeAnalysis) {
    lines.push('## Analysis');
    lines.push('');
    lines.push(`- **Total Slides:** ${metadata.totalSlides}`);
    lines.push(`- **Total Text:** ${metadata.totalTextChars.toLocaleString()} characters`);
    lines.push(`- **Avg Text/Slide:** ${metadata.avgTextPerSlide} characters`);
    lines.push(`- **Slides with Notes:** ${metadata.slidesWithNotes}`);
    
    // Text density assessment
    if (metadata.avgTextPerSlide < 50) {
      lines.push(`- **Assessment:** ⚠️ Image-heavy (low text density)`);
    } else if (metadata.avgTextPerSlide < 150) {
      lines.push(`- **Assessment:** 📊 Mixed content`);
    } else {
      lines.push(`- **Assessment:** ✅ Text-rich`);
    }
    lines.push('');
  }
  
  // Slides content
  lines.push('## Content');
  lines.push('');
  
  for (const slide of slides) {
    lines.push(`### Slide ${slide.slideNumber}`);
    lines.push('');
    
    if (slide.text) {
      lines.push(slide.text);
      lines.push('');
    } else {
      lines.push('*[No text content - image/visual slide]*');
      lines.push('');
    }
    
    if (slide.speakerNotes && slide.speakerNotes.length > 10) {
      lines.push('> **Speaker Notes:**');
      // Format notes as blockquote
      const noteLines = slide.speakerNotes.split('\n').filter(l => l.trim());
      for (const noteLine of noteLines) {
        lines.push(`> ${noteLine}`);
      }
      lines.push('');
    }
    
    lines.push('---');
    lines.push('');
  }
  
  // Footer
  lines.push('');
  lines.push(`*Converted from \`${metadata.filename}\` on ${new Date().toLocaleDateString()}*`);
  
  return lines.join('\n');
}

/**
 * Convert a single PPTX file to Markdown
 */
async function convertFile(
  inputPath: string,
  outputPath: string,
  options: { includeAnalysis?: boolean } = {}
): Promise<{ inputPath: string; outputPath: string; slides: number; chars: number }> {
  const { slides, metadata } = await extractSlidesFromPPTX(inputPath);
  const markdown = slidesToMarkdown(slides, metadata, options);
  
  // Ensure output directory exists
  await mkdir(dirname(outputPath), { recursive: true });
  
  // Write markdown file
  await writeFile(outputPath, markdown, 'utf-8');
  
  return {
    inputPath,
    outputPath,
    slides: metadata.totalSlides,
    chars: metadata.totalTextChars,
  };
}

/**
 * Batch convert all PPTX files in a directory
 */
async function batchConvert(
  inputDir: string,
  outputDir: string,
  options: { includeAnalysis?: boolean } = {}
): Promise<{ converted: number; totalSlides: number; totalChars: number; files: string[] }> {
  const files = await readdir(inputDir);
  const pptxFiles = files.filter(f => f.toLowerCase().endsWith('.pptx'));
  
  let converted = 0;
  let totalSlides = 0;
  let totalChars = 0;
  const outputFiles: string[] = [];
  
  for (const file of pptxFiles) {
    const inputPath = join(inputDir, file);
    const outputFile = file.replace(/\.pptx$/i, '.md');
    const outputPath = join(outputDir, outputFile);
    
    try {
      console.log(`  Converting: ${file}`);
      const result = await convertFile(inputPath, outputPath, options);
      converted++;
      totalSlides += result.slides;
      totalChars += result.chars;
      outputFiles.push(outputFile);
      console.log(`    ✅ ${result.slides} slides, ${result.chars.toLocaleString()} chars`);
    } catch (error) {
      console.error(`    ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return { converted, totalSlides, totalChars, files: outputFiles };
}

/**
 * Print usage information
 */
function printUsage(): void {
  console.log(`
PPTX to Markdown Converter

Converts PowerPoint files to version-controllable Markdown format.

Usage:
  npm run convert -- --input <file.pptx> [--output <file.md>]
  npm run convert -- --batch --input <dir> [--output <dir>]

Options:
  -i, --input      Input PPTX file or directory (required)
  -o, --output     Output MD file or directory (default: same location)
  -b, --batch      Convert all PPTX files in directory
  -a, --analysis   Include analysis section in output
  -h, --help       Show this help message

Examples:
  # Convert single file
  npm run convert -- -i "./data/presentations/Google_DEMOSLAM.pptx"

  # Convert all presentations to markdown/
  npm run convert -- --batch -i "./data/presentations" -o "./data/markdown"

  # Include analysis
  npm run convert -- --batch -i "./data/presentations" -o "./data/markdown" --analysis
`);
}

// Main execution
async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      input: { type: 'string', short: 'i' },
      output: { type: 'string', short: 'o' },
      batch: { type: 'boolean', short: 'b', default: false },
      analysis: { type: 'boolean', short: 'a', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  
  if (values.help) {
    printUsage();
    process.exit(0);
  }
  
  if (!values.input) {
    console.error('Error: --input is required');
    printUsage();
    process.exit(1);
  }
  
  const inputPath = values.input;
  
  try {
    const inputStat = await stat(inputPath);
    
    if (values.batch || inputStat.isDirectory()) {
      // Batch conversion
      const outputDir = values.output || join(inputPath, '../markdown');
      
      console.log(`\n🔄 Batch converting PPTX files...`);
      console.log(`   Input:  ${inputPath}`);
      console.log(`   Output: ${outputDir}\n`);
      
      const result = await batchConvert(inputPath, outputDir, { includeAnalysis: values.analysis });
      
      console.log(`\n✅ Conversion complete!`);
      console.log(`   Files converted: ${result.converted}`);
      console.log(`   Total slides:    ${result.totalSlides}`);
      console.log(`   Total chars:     ${result.totalChars.toLocaleString()}`);
      console.log(`   Output files:    ${result.files.length}`);
      
      // Estimate size savings
      const estimatedMdSize = result.totalChars; // ~1 byte per char
      console.log(`\n   📦 Estimated output size: ~${Math.round(estimatedMdSize / 1024)} KB`);
      console.log(`   💡 Ready for git: Add data/markdown/ to version control`);
      
    } else {
      // Single file conversion
      const outputPath = values.output || inputPath.replace(/\.pptx$/i, '.md');
      
      console.log(`\n🔄 Converting: ${inputPath}`);
      
      const result = await convertFile(inputPath, outputPath, { includeAnalysis: values.analysis });
      
      console.log(`✅ Done!`);
      console.log(`   Output: ${result.outputPath}`);
      console.log(`   Slides: ${result.slides}`);
      console.log(`   Chars:  ${result.chars.toLocaleString()}`);
    }
    
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

main();
