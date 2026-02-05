#!/usr/bin/env tsx
/**
 * @file batch-ingest.ts
 * @description Batch ingest all presentations from manifest.csv
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-05
 */

import { config } from 'dotenv';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parseDocument } from '../lib/parsers/index.js';
import { indexChunks, type VectorStoreConfig } from '../lib/embeddings/index.js';

// Load environment variables
config();

interface ManifestEntry {
  filename: string;
  client: string;
  category: string;
  year: string;
  type: string;
  notes: string;
}

async function parseManifest(manifestPath: string): Promise<ManifestEntry[]> {
  const content = await readFile(manifestPath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  const entries: ManifestEntry[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    // Parse CSV line (handle quoted values)
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length >= 5) {
      entries.push({
        filename: values[0],
        client: values[1],
        category: values[2],
        year: values[3],
        type: values[4],
        notes: values[5] || '',
      });
    }
  }
  
  return entries;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const startFrom = process.argv.find(a => a.startsWith('--start='))?.split('=')[1];
  
  console.log('\n📚 Participation Translator - Batch Ingestion\n');
  console.log('═'.repeat(60));
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No indexing will be performed\n');
  }
  
  // Check environment
  if (!dryRun && !process.env.GCP_PROJECT_ID) {
    console.error('❌ GCP_PROJECT_ID environment variable not set');
    process.exit(1);
  }
  
  const config: VectorStoreConfig = {
    projectId: process.env.GCP_PROJECT_ID || '',
    region: process.env.GCP_REGION || 'us-central1',
    dimensions: parseInt(process.env.VERTEX_AI_EMBEDDING_DIMENSIONS || '768', 10),
  };
  
  // Parse manifest
  const manifestPath = join(process.cwd(), 'data/presentations/manifest.csv');
  const entries = await parseManifest(manifestPath);
  
  console.log(`📋 Found ${entries.length} presentations in manifest\n`);
  
  // Process each file
  let processed = 0;
  let totalChunks = 0;
  let errors: string[] = [];
  let skipping = !!startFrom;
  
  for (const entry of entries) {
    // Skip until we reach startFrom
    if (skipping) {
      if (entry.filename.includes(startFrom)) {
        skipping = false;
      } else {
        console.log(`⏭️  Skipping: ${entry.filename}`);
        continue;
      }
    }
    
    const filePath = join(process.cwd(), 'data/presentations', entry.filename);
    
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📁 [${processed + 1}/${entries.length}] ${entry.filename}`);
    console.log(`   Client: ${entry.client} | Type: ${entry.type} | Year: ${entry.year}`);
    
    try {
      // Parse document
      const startParse = Date.now();
      const result = await parseDocument(filePath, entry.filename, {
        client: entry.client,
        documentType: entry.type as 'presentation' | 'case_study' | 'framework' | 'other',
        chunkSize: 512,
        chunkOverlap: 64,
        preserveStructure: true,
        includeSpeakerNotes: true,
      });
      
      const { chunks, metadata } = result;
      const parseTime = Date.now() - startParse;
      
      console.log(`   ✅ Parsed: ${chunks.length} chunks, ${metadata.pageCount || '?'} slides (${parseTime}ms)`);
      
      if (dryRun) {
        totalChunks += chunks.length;
        processed++;
        continue;
      }
      
      // Index to vector store
      const startIndex = Date.now();
      const { indexed, documentId } = await indexChunks(chunks, metadata, config);
      const indexTime = Date.now() - startIndex;
      
      console.log(`   ✅ Indexed: ${indexed} chunks → ${documentId.substring(0, 40)}... (${(indexTime / 1000).toFixed(1)}s)`);
      
      totalChunks += indexed;
      processed++;
      
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.log(`   ❌ Error: ${errMsg}`);
      errors.push(`${entry.filename}: ${errMsg}`);
    }
  }
  
  // Summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log('\n📊 BATCH INGESTION SUMMARY\n');
  console.log(`   Processed: ${processed}/${entries.length} files`);
  console.log(`   Total chunks: ${totalChunks}`);
  console.log(`   Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    for (const err of errors) {
      console.log(`   - ${err}`);
    }
  }
  
  if (dryRun) {
    console.log('\n🔍 Dry run complete. Run without --dry-run to index.\n');
  } else {
    console.log('\n✨ Batch ingestion complete!\n');
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
