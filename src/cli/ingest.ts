#!/usr/bin/env tsx
/**
 * @file ingest.ts
 * @description CLI tool for ingesting documents into the RAG pipeline
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 * 
 * Usage:
 *   npm run ingest -- <file> [options]
 *   npx tsx src/cli/ingest.ts <file> --client "Volkswagen" --type presentation
 * 
 * Options:
 *   --client <name>     Client name (e.g., "Volkswagen", "Adidas")
 *   --campaign <name>   Campaign name
 *   --type <type>       Document type: presentation, case_study, framework, other
 *   --chunk-size <n>    Chunk size in tokens (default: 512)
 *   --dry-run           Parse only, don't index
 */

import { config } from 'dotenv';
import { parseDocument, type ParseOptions } from '../lib/parsers/index.js';
import { indexChunks, type VectorStoreConfig } from '../lib/embeddings/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';

// Load environment variables
config();

interface CliOptions {
  file: string;
  client?: string;
  campaign?: string;
  documentType?: 'presentation' | 'case_study' | 'framework' | 'other';
  chunkSize?: number;
  dryRun?: boolean;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Participation Translator - Document Ingestion CLI

Usage:
  npm run ingest -- <file> [options]

Options:
  --client <name>     Client name (e.g., "Volkswagen", "Adidas")
  --campaign <name>   Campaign name
  --type <type>       Document type: presentation, case_study, framework, other
  --chunk-size <n>    Chunk size in tokens (default: 512)
  --dry-run           Parse only, don't index to vector store

Examples:
  npm run ingest -- ./docs/vw-presentation.pptx --client "Volkswagen" --type presentation
  npm run ingest -- ./docs/adidas-case-study.pdf --client "Adidas" --type case_study --dry-run
`);
    process.exit(0);
  }
  
  const options: CliOptions = {
    file: args[0],
  };
  
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--client':
        options.client = args[++i];
        break;
      case '--campaign':
        options.campaign = args[++i];
        break;
      case '--type':
        options.documentType = args[++i] as CliOptions['documentType'];
        break;
      case '--chunk-size':
        options.chunkSize = parseInt(args[++i], 10);
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
    }
  }
  
  return options;
}

async function main() {
  const options = parseArgs();
  
  console.log('\n📄 Participation Translator - Document Ingestion\n');
  console.log('─'.repeat(50));
  
  // Validate file exists
  const filePath = path.resolve(options.file);
  try {
    await fs.access(filePath);
  } catch {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  
  const filename = path.basename(filePath);
  console.log(`📁 File: ${filename}`);
  console.log(`📍 Path: ${filePath}`);
  
  if (options.client) console.log(`🏢 Client: ${options.client}`);
  if (options.campaign) console.log(`📣 Campaign: ${options.campaign}`);
  if (options.documentType) console.log(`📋 Type: ${options.documentType}`);
  if (options.dryRun) console.log(`🔍 Mode: DRY RUN (no indexing)`);
  
  console.log('─'.repeat(50));
  
  // Parse document
  console.log('\n⏳ Parsing document...');
  
  const parseOptions: ParseOptions = {
    client: options.client,
    campaign: options.campaign,
    documentType: options.documentType,
    chunkSize: options.chunkSize || 512,
    chunkOverlap: 64,
    preserveStructure: true,
  };
  
  const startParse = Date.now();
  const { chunks, metadata } = await parseDocument(filePath, filename, parseOptions);
  const parseTime = Date.now() - startParse;
  
  console.log(`✅ Parsed in ${parseTime}ms`);
  console.log(`   - Chunks: ${chunks.length}`);
  console.log(`   - Pages/Slides: ${metadata.pageCount || 'N/A'}`);
  console.log(`   - File size: ${(metadata.fileSize / 1024).toFixed(1)} KB`);
  
  // Show sample chunks
  console.log('\n📝 Sample chunks:');
  for (const chunk of chunks.slice(0, 3)) {
    const preview = chunk.content.substring(0, 100).replace(/\n/g, ' ');
    console.log(`   [${chunk.chunkIndex}] ${preview}...`);
  }
  
  if (options.dryRun) {
    console.log('\n🔍 Dry run complete. No indexing performed.\n');
    return;
  }
  
  // Check environment
  if (!process.env.GCP_PROJECT_ID) {
    console.error('\n❌ GCP_PROJECT_ID environment variable not set');
    console.error('   Set it in .env or export GCP_PROJECT_ID=your-project-id');
    process.exit(1);
  }
  
  // Index to vector store
  console.log('\n⏳ Indexing to vector store...');
  
  const config: VectorStoreConfig = {
    projectId: process.env.GCP_PROJECT_ID,
    region: process.env.GCP_REGION || 'us-central1',
    dimensions: parseInt(process.env.VERTEX_AI_EMBEDDING_DIMENSIONS || '768', 10),
  };
  
  const startIndex = Date.now();
  const { indexed, documentId } = await indexChunks(chunks, metadata, config);
  const indexTime = Date.now() - startIndex;
  
  console.log(`✅ Indexed in ${(indexTime / 1000).toFixed(1)}s`);
  console.log(`   - Document ID: ${documentId}`);
  console.log(`   - Chunks indexed: ${indexed}`);
  
  console.log('\n✨ Ingestion complete!\n');
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});
