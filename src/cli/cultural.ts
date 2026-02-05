#!/usr/bin/env npx ts-node
/**
 * @file cultural.ts
 * @description CLI tool for testing cultural intelligence (Exa.ai)
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-05
 */

import { search, searchReddit, searchTrends, getCulturalContext } from '../lib/cultural/exa';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const query = args.slice(1).join(' ');

  if (!command) {
    console.log(`
Cultural Intelligence CLI - Exa.ai Search

Usage:
  npx ts-node src/cli/cultural.ts <command> <query>

Commands:
  search <query>      General semantic search
  reddit <query>      Search Reddit content
  trends <category>   Search for trends in a category
  context <brand>     Get full cultural context for a brand

Examples:
  npx ts-node src/cli/cultural.ts search "sneaker culture Gen Z"
  npx ts-node src/cli/cultural.ts reddit "Adidas opinions 2026"
  npx ts-node src/cli/cultural.ts trends "streetwear fashion"
  npx ts-node src/cli/cultural.ts context "Adidas" "footwear"
`);
    return;
  }

  console.log(`\n🔍 Cultural Intelligence: ${command.toUpperCase()}`);
  console.log('─'.repeat(50));

  try {
    switch (command) {
      case 'search': {
        if (!query) {
          console.error('❌ Error: Please provide a search query');
          return;
        }
        console.log(`Query: "${query}"\n`);
        const results = await search(query, { numResults: 5 });
        displayResults(results.results);
        break;
      }

      case 'reddit': {
        if (!query) {
          console.error('❌ Error: Please provide a search query');
          return;
        }
        console.log(`Query: "${query}" (Reddit only)\n`);
        const results = await searchReddit(query, { numResults: 5 });
        displayResults(results.results);
        break;
      }

      case 'trends': {
        if (!query) {
          console.error('❌ Error: Please provide a category');
          return;
        }
        console.log(`Category: "${query}"\n`);
        const results = await searchTrends(query, { numResults: 5 });
        displayResults(results.results);
        break;
      }

      case 'context': {
        const [brand, category] = args.slice(1);
        if (!brand) {
          console.error('❌ Error: Please provide a brand name');
          return;
        }
        console.log(`Brand: "${brand}", Category: "${category || 'general'}"\n`);
        const context = await getCulturalContext(brand, category || 'brand');
        
        console.log('\n📈 TRENDS:');
        console.log('─'.repeat(40));
        displayResults(context.trends.results.slice(0, 3));
        
        console.log('\n💬 REDDIT DISCUSSIONS:');
        console.log('─'.repeat(40));
        displayResults(context.reddit.results.slice(0, 3));
        
        console.log('\n🎯 SUBCULTURES:');
        console.log('─'.repeat(40));
        displayResults(context.subcultures.results.slice(0, 3));
        break;
      }

      default:
        console.error(`❌ Unknown command: ${command}`);
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
}

function displayResults(results: Array<{ title: string; url: string; score?: number; text?: string; highlights?: string[] }>) {
  if (results.length === 0) {
    console.log('No results found.');
    return;
  }

  results.forEach((result, i) => {
    console.log(`\n${i + 1}. ${result.title}`);
    console.log(`   🔗 ${result.url}`);
    if (result.score !== undefined) {
      console.log(`   📊 Score: ${result.score.toFixed(3)}`);
    }
    if (result.highlights?.length) {
      console.log(`   💡 ${result.highlights[0]?.substring(0, 150)}...`);
    } else if (result.text) {
      console.log(`   📝 ${result.text.substring(0, 150)}...`);
    }
  });
  
  console.log(`\n✅ Found ${results.length} results`);
}

main();
