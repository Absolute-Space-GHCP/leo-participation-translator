#!/usr/bin/env tsx
/**
 * @file retrieve.ts
 * @description CLI tool for testing RAG retrieval
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 * 
 * Usage:
 *   npm run retrieve -- <query> [options]
 *   npx tsx src/cli/retrieve.ts "participation mechanics for automotive" --top-k 5
 * 
 * Options:
 *   --top-k <n>       Number of results (default: 10)
 *   --client <name>   Filter by client
 *   --type <type>     Filter by document type
 *   --stats           Show vector store stats
 */

import { config } from 'dotenv';
import { searchSimilar, getStats, type VectorStoreConfig } from '../lib/embeddings/index.js';

// Load environment variables
config();

interface CliOptions {
  query?: string;
  topK: number;
  client?: string;
  documentType?: string;
  showStats: boolean;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Participation Translator - Retrieval CLI

Usage:
  npm run retrieve -- <query> [options]

Options:
  --top-k <n>       Number of results (default: 10)
  --client <name>   Filter by client
  --type <type>     Filter by document type: presentation, case_study, framework, other
  --stats           Show vector store statistics

Examples:
  npm run retrieve -- "participation mechanics for automotive brands"
  npm run retrieve -- "cultural moments in sportswear" --client "Adidas" --top-k 5
  npm run retrieve -- --stats
`);
    process.exit(0);
  }
  
  const options: CliOptions = {
    topK: 10,
    showStats: false,
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--top-k') {
      options.topK = parseInt(args[++i], 10);
    } else if (arg === '--client') {
      options.client = args[++i];
    } else if (arg === '--type') {
      options.documentType = args[++i];
    } else if (arg === '--stats') {
      options.showStats = true;
    } else if (!arg.startsWith('--')) {
      options.query = arg;
    }
  }
  
  return options;
}

async function main() {
  const options = parseArgs();
  
  // Check environment
  if (!process.env.GCP_PROJECT_ID) {
    console.error('❌ GCP_PROJECT_ID environment variable not set');
    console.error('   Set it in .env or export GCP_PROJECT_ID=your-project-id');
    process.exit(1);
  }
  
  const storeConfig: VectorStoreConfig = {
    projectId: process.env.GCP_PROJECT_ID,
    region: process.env.GCP_REGION || 'us-central1',
    dimensions: parseInt(process.env.VERTEX_AI_EMBEDDING_DIMENSIONS || '768', 10),
  };
  
  console.log('\n🔍 Participation Translator - Retrieval\n');
  console.log('─'.repeat(50));
  
  // Show stats if requested
  if (options.showStats) {
    console.log('\n📊 Vector Store Statistics\n');
    
    const stats = await getStats(storeConfig);
    
    console.log(`   Documents: ${stats.documentCount}`);
    console.log(`   Chunks: ${stats.chunkCount}`);
    console.log(`   Clients: ${stats.clients.length > 0 ? stats.clients.join(', ') : 'None'}`);
    console.log('');
    return;
  }
  
  // Validate query
  if (!options.query) {
    console.error('❌ No query provided. Use --help for usage information.');
    process.exit(1);
  }
  
  console.log(`📝 Query: "${options.query}"`);
  console.log(`📊 Top K: ${options.topK}`);
  
  if (options.client) console.log(`🏢 Client filter: ${options.client}`);
  if (options.documentType) console.log(`📋 Type filter: ${options.documentType}`);
  
  console.log('─'.repeat(50));
  
  // Build filters
  const filters: Record<string, string> = {};
  if (options.client) filters.client = options.client;
  if (options.documentType) filters.documentType = options.documentType;
  
  // Search
  console.log('\n⏳ Searching...');
  
  const startTime = Date.now();
  const results = await searchSimilar(
    options.query,
    options.topK,
    storeConfig,
    Object.keys(filters).length > 0 ? filters : undefined
  );
  const searchTime = Date.now() - startTime;
  
  console.log(`✅ Found ${results.length} results in ${searchTime}ms\n`);
  
  if (results.length === 0) {
    console.log('   No matching documents found.');
    console.log('   Try ingesting some documents first with: npm run ingest');
    return;
  }
  
  // Display results
  console.log('─'.repeat(50));
  console.log('RESULTS');
  console.log('─'.repeat(50));
  
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const score = (result.score * 100).toFixed(1);
    
    console.log(`\n[${i + 1}] Score: ${score}%`);
    console.log(`    Source: ${result.metadata.filename}`);
    if (result.metadata.client) console.log(`    Client: ${result.metadata.client}`);
    if (result.chunk.page) console.log(`    Page/Slide: ${result.chunk.page}`);
    if (result.chunk.section) console.log(`    Section: ${result.chunk.section}`);
    console.log(`    ─────`);
    
    // Show content preview (first 300 chars)
    const preview = result.chunk.content
      .substring(0, 300)
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    console.log(`    ${preview}${result.chunk.content.length > 300 ? '...' : ''}`);
  }
  
  console.log('\n');
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});
