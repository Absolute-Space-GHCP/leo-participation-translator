#!/usr/bin/env npx ts-node
/**
 * @file cultural.ts
 * @description CLI tool for testing cultural intelligence (Exa.ai + Tavily)
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-05
 */

import * as exa from '../lib/cultural/exa';
import * as tavily from '../lib/cultural/tavily';
import { quickContext, formatContextForPrompt, type MergedContext } from '../lib/cultural/merger';
import * as sentiment from '../lib/cultural/sentiment';

type Provider = 'exa' | 'tavily' | 'both';

async function main() {
  const args = process.argv.slice(2);
  
  // Parse provider flag
  let provider: Provider = 'exa'; // default
  const providerIndex = args.findIndex(a => a === '--provider' || a === '-p');
  if (providerIndex !== -1) {
    provider = args[providerIndex + 1] as Provider;
    args.splice(providerIndex, 2);
  }

  // Parse brand flag
  let brand: string | undefined;
  const brandIndex = args.findIndex(a => a === '--brand');
  if (brandIndex !== -1) {
    brand = args[brandIndex + 1];
    args.splice(brandIndex, 2);
  }

  // Parse category flag
  let category: string | undefined;
  const categoryIndex = args.findIndex(a => a === '--category');
  if (categoryIndex !== -1) {
    category = args[categoryIndex + 1];
    args.splice(categoryIndex, 2);
  }

  // Parse deep flag
  let deep = false;
  const deepIndex = args.findIndex(a => a === '--deep');
  if (deepIndex !== -1) {
    deep = true;
    args.splice(deepIndex, 1);
  }

  const command = args[0];
  const query = args.slice(1).join(' ');

  if (!command) {
    console.log(`
Cultural Intelligence CLI - Semantic Web Search

Usage:
  npm run cultural -- <command> <query> [--provider exa|tavily|both]

Commands:
  search <query>      General semantic search
  reddit <query>      Search Reddit content
  trends <category>   Search for trends in a category
  context <brand>     Get full cultural context for a brand
  answer <question>   Get AI-generated answer (Tavily only)
  merge <query>       Merge RAG + Cultural intel (full context)
  sentiment <query>   Analyze sentiment of search results (Claude)

Options:
  --provider, -p      Search provider: exa (default), tavily, or both
  --brand <name>      Brand name for context searches
  --category <name>   Category for context searches
  --deep              Deep sentiment analysis with topic breakdown

Examples:
  npm run cultural -- search "sneaker culture Gen Z"
  npm run cultural -- search "AI advertising" --provider tavily
  npm run cultural -- search "streetwear trends" --provider both
  npm run cultural -- reddit "Adidas opinions 2026"
  npm run cultural -- trends "streetwear fashion"
  npm run cultural -- context "Adidas" "footwear"
  npm run cultural -- answer "What are the top sneaker trends for 2026?"
  npm run cultural -- merge "participation campaign for sneakers" --brand Adidas
  npm run cultural -- sentiment "Adidas brand perception" --brand Adidas --deep
`);
    return;
  }

  const providerLabel = provider.toUpperCase();
  console.log(`\n🔍 Cultural Intelligence: ${command.toUpperCase()} [${providerLabel}]`);
  console.log('─'.repeat(50));

  try {
    switch (command) {
      case 'search': {
        if (!query) {
          console.error('❌ Error: Please provide a search query');
          return;
        }
        console.log(`Query: "${query}"\n`);
        
        if (provider === 'both') {
          await searchBoth(query);
        } else if (provider === 'tavily') {
          const results = await tavily.search(query, { maxResults: 5 });
          displayTavilyResults(results.results);
        } else {
          const results = await exa.search(query, { numResults: 5 });
          displayExaResults(results.results);
        }
        break;
      }

      case 'reddit': {
        if (!query) {
          console.error('❌ Error: Please provide a search query');
          return;
        }
        console.log(`Query: "${query}" (Reddit content)\n`);
        
        if (provider === 'both') {
          console.log('📌 EXA.AI:');
          const exaResults = await exa.searchReddit(query, { numResults: 5 });
          displayExaResults(exaResults.results);
          
          console.log('\n📌 TAVILY:');
          const tavilyResults = await tavily.searchReddit(query, { maxResults: 5 });
          displayTavilyResults(tavilyResults.results);
        } else if (provider === 'tavily') {
          const results = await tavily.searchReddit(query, { maxResults: 5 });
          displayTavilyResults(results.results);
        } else {
          const results = await exa.searchReddit(query, { numResults: 5 });
          displayExaResults(results.results);
        }
        break;
      }

      case 'trends': {
        if (!query) {
          console.error('❌ Error: Please provide a category');
          return;
        }
        console.log(`Category: "${query}"\n`);
        
        if (provider === 'both') {
          console.log('📌 EXA.AI:');
          const exaResults = await exa.searchTrends(query, { numResults: 5 });
          displayExaResults(exaResults.results);
          
          console.log('\n📌 TAVILY:');
          const tavilyResults = await tavily.searchTrends(query, { maxResults: 5 });
          displayTavilyResults(tavilyResults.results);
        } else if (provider === 'tavily') {
          const results = await tavily.searchTrends(query, { maxResults: 5 });
          displayTavilyResults(results.results);
        } else {
          const results = await exa.searchTrends(query, { numResults: 5 });
          displayExaResults(results.results);
        }
        break;
      }

      case 'context': {
        const [brand, category] = args.slice(1);
        if (!brand) {
          console.error('❌ Error: Please provide a brand name');
          return;
        }
        console.log(`Brand: "${brand}", Category: "${category || 'general'}"\n`);
        
        const getContext = provider === 'tavily' ? tavily.getCulturalContext : exa.getCulturalContext;
        const context = await getContext(brand, category || 'brand');
        
        console.log('\n📈 TRENDS:');
        console.log('─'.repeat(40));
        displayGenericResults(context.trends.results.slice(0, 3));
        
        console.log('\n💬 REDDIT DISCUSSIONS:');
        console.log('─'.repeat(40));
        displayGenericResults(context.reddit.results.slice(0, 3));
        
        console.log('\n🎯 SUBCULTURES:');
        console.log('─'.repeat(40));
        displayGenericResults(context.subcultures.results.slice(0, 3));
        break;
      }

      case 'answer': {
        if (!query) {
          console.error('❌ Error: Please provide a question');
          return;
        }
        console.log(`Question: "${query}"\n`);
        
        if (!(await tavily.isConfigured())) {
          console.error('❌ Error: Tavily API key not configured (required for answer)');
          return;
        }
        
        const answer = await tavily.getAnswer(query);
        if (answer) {
          console.log('💡 AI Answer:');
          console.log('─'.repeat(40));
          console.log(answer);
        } else {
          console.log('No answer generated.');
        }
        break;
      }

      case 'merge': {
        if (!query) {
          console.error('❌ Error: Please provide a query');
          return;
        }
        console.log(`Query: "${query}"`);
        if (brand) console.log(`Brand: ${brand}`);
        if (category) console.log(`Category: ${category}`);
        console.log('');
        
        const merged = await quickContext(query, brand, category);
        displayMergedContext(merged);
        break;
      }

      case 'sentiment': {
        if (!query) {
          console.error('❌ Error: Please provide a query to search and analyze');
          return;
        }
        console.log(`Query: "${query}"`);
        if (brand) console.log(`Brand: ${brand}`);
        console.log(`Mode: ${deep ? 'Deep analysis' : 'Quick analysis'}`);
        console.log('');
        
        // First, search for content to analyze
        console.log('🔍 Searching for content to analyze...');
        const searchResults = await exa.search(query, { numResults: 10 });
        const texts = searchResults.results
          .map(r => r.text || r.highlights?.[0] || '')
          .filter(t => t.length > 50);
        
        if (texts.length === 0) {
          console.error('❌ No content found to analyze');
          return;
        }
        
        console.log(`📝 Found ${texts.length} texts to analyze\n`);
        
        if (deep) {
          console.log('🧠 Running deep sentiment analysis with Claude...\n');
          const analysis = await sentiment.analyzeDeep(texts, brand);
          displayDeepSentiment(analysis);
        } else {
          console.log('🧠 Running batch sentiment analysis with Claude...\n');
          const batch = await sentiment.analyzeBatch(texts);
          displayBatchSentiment(batch);
        }
        break;
      }

      default:
        console.error(`❌ Unknown command: ${command}`);
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
}

async function searchBoth(query: string) {
  const [exaResults, tavilyResults] = await Promise.all([
    exa.search(query, { numResults: 5 }).catch(e => ({ results: [], error: e.message })),
    tavily.search(query, { maxResults: 5 }).catch(e => ({ results: [], error: e.message })),
  ]);

  console.log('📌 EXA.AI:');
  if ('error' in exaResults) {
    console.log(`   ⚠️ ${exaResults.error}`);
  } else {
    displayExaResults(exaResults.results);
  }
  
  console.log('\n📌 TAVILY:');
  if ('error' in tavilyResults) {
    console.log(`   ⚠️ ${tavilyResults.error}`);
  } else {
    displayTavilyResults(tavilyResults.results);
  }
}

function displayExaResults(results: Array<{ title: string; url: string; score?: number; text?: string; highlights?: string[] }>) {
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

function displayTavilyResults(results: Array<{ title: string; url: string; score?: number; content?: string }>) {
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
    if (result.content) {
      console.log(`   📝 ${result.content.substring(0, 150)}...`);
    }
  });
  
  console.log(`\n✅ Found ${results.length} results`);
}

function displayGenericResults(results: Array<{ title: string; url: string; score?: number; text?: string; content?: string; highlights?: string[] }>) {
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
    const text = result.highlights?.[0] || result.text || result.content;
    if (text) {
      console.log(`   📝 ${text.substring(0, 150)}...`);
    }
  });
  
  console.log(`\n✅ Found ${results.length} results`);
}

function displayBatchSentiment(batch: sentiment.BatchSentimentResult) {
  console.log('═'.repeat(50));
  console.log('📊 SENTIMENT ANALYSIS RESULTS');
  console.log('═'.repeat(50));
  
  // Aggregate
  const emoji = getSentimentEmoji(batch.aggregate.label);
  console.log(`\n${emoji} OVERALL: ${batch.aggregate.label.toUpperCase()}`);
  console.log(`   Score: ${batch.aggregate.score.toFixed(2)} (-1 to 1)`);
  console.log(`   Confidence: ${(batch.aggregate.confidence * 100).toFixed(0)}%`);
  
  // Individual items
  if (batch.items.length > 0 && batch.items[0].sentiment.confidence > 0) {
    console.log('\n📝 Individual Results:');
    console.log('─'.repeat(40));
    batch.items.slice(0, 5).forEach((item, i) => {
      const itemEmoji = getSentimentEmoji(item.sentiment.label);
      console.log(`\n${i + 1}. ${itemEmoji} ${item.sentiment.label}`);
      console.log(`   "${item.text.substring(0, 100)}..."`);
    });
  }
  
  console.log('\n' + '═'.repeat(50) + '\n');
}

function displayDeepSentiment(analysis: sentiment.SentimentAnalysis) {
  console.log('═'.repeat(60));
  console.log('🧠 DEEP SENTIMENT ANALYSIS');
  console.log('═'.repeat(60));
  
  // Overall
  const emoji = getSentimentEmoji(analysis.overall.label);
  console.log(`\n${emoji} OVERALL SENTIMENT: ${analysis.overall.label.toUpperCase()}`);
  console.log(`   Score: ${analysis.overall.score.toFixed(2)} (-1 to 1)`);
  console.log(`   Confidence: ${(analysis.overall.confidence * 100).toFixed(0)}%`);
  console.log(`   Emotional Tone: ${analysis.emotionalTone}`);
  
  // Brand Perception
  if (analysis.brandPerception) {
    console.log(`\n🏷️  BRAND PERCEPTION:`);
    console.log(`   ${analysis.brandPerception}`);
  }
  
  // Summary
  console.log(`\n📋 SUMMARY:`);
  console.log(`   ${analysis.summary}`);
  
  // Topics
  if (analysis.topics.length > 0) {
    console.log('\n🎯 TOPIC BREAKDOWN:');
    console.log('─'.repeat(40));
    analysis.topics.forEach((topic) => {
      const topicEmoji = getSentimentEmoji(topic.sentiment.label);
      console.log(`\n   ${topicEmoji} ${topic.topic}`);
      console.log(`      Sentiment: ${topic.sentiment.label} (${topic.sentiment.score.toFixed(2)})`);
      console.log(`      Mentions: ${topic.mentions}`);
      if (topic.keyPhrases.length > 0) {
        console.log(`      Key phrases: ${topic.keyPhrases.join(', ')}`);
      }
    });
  }
  
  // Insights
  if (analysis.insights.length > 0) {
    console.log('\n💡 KEY INSIGHTS:');
    console.log('─'.repeat(40));
    analysis.insights.forEach((insight, i) => {
      console.log(`   ${i + 1}. ${insight}`);
    });
  }
  
  console.log('\n' + '═'.repeat(60) + '\n');
}

function getSentimentEmoji(label: sentiment.SentimentLabel): string {
  switch (label) {
    case 'positive': return '😊';
    case 'negative': return '😞';
    case 'mixed': return '🤔';
    case 'neutral': return '😐';
    default: return '❓';
  }
}

function displayMergedContext(context: MergedContext) {
  console.log('\n' + '═'.repeat(60));
  console.log('📚 MERGED CONTEXT');
  console.log('═'.repeat(60));

  // Summary
  console.log('\n📊 SUMMARY');
  console.log('─'.repeat(40));
  console.log(`   Total results: ${context.summary.totalResults}`);
  console.log(`   Institutional (RAG): ${context.summary.institutionalCount}`);
  console.log(`   Cultural (Web): ${context.summary.culturalCount}`);
  console.log(`   Sources: ${context.summary.sourcesUsed.join(', ')}`);
  console.log(`   Themes: ${context.summary.primaryThemes.join(', ') || 'N/A'}`);

  // Institutional
  if (context.summary.institutionalCount > 0) {
    console.log('\n🏢 INSTITUTIONAL KNOWLEDGE (JL)');
    console.log('─'.repeat(40));
    
    if (context.institutional.relevantCases.length > 0) {
      console.log('\n  📁 Relevant Cases:');
      context.institutional.relevantCases.slice(0, 3).forEach((r, i) => {
        console.log(`\n  ${i + 1}. ${r.title}`);
        console.log(`     Score: ${(r.score * 100).toFixed(0)}%`);
        console.log(`     ${r.content.substring(0, 150).replace(/\n/g, ' ')}...`);
      });
    }

    if (context.institutional.patterns.length > 0) {
      console.log('\n  🎯 Patterns:');
      context.institutional.patterns.slice(0, 2).forEach((r, i) => {
        console.log(`\n  ${i + 1}. ${r.content.substring(0, 200).replace(/\n/g, ' ')}...`);
      });
    }
  }

  // Cultural
  if (context.summary.culturalCount > 0) {
    console.log('\n🌍 CULTURAL INTELLIGENCE');
    console.log('─'.repeat(40));
    
    if (context.cultural.trends.length > 0) {
      console.log('\n  📈 Trends:');
      context.cultural.trends.slice(0, 3).forEach((r, i) => {
        console.log(`\n  ${i + 1}. ${r.title} [${r.source}]`);
        if (r.url) console.log(`     🔗 ${r.url}`);
        console.log(`     ${r.content.substring(0, 150).replace(/\n/g, ' ')}...`);
      });
    }

    if (context.cultural.discussions.length > 0) {
      console.log('\n  💬 Discussions:');
      context.cultural.discussions.slice(0, 3).forEach((r, i) => {
        console.log(`\n  ${i + 1}. ${r.title} [${r.source}]`);
        if (r.url) console.log(`     🔗 ${r.url}`);
        console.log(`     ${r.content.substring(0, 150).replace(/\n/g, ' ')}...`);
      });
    }

    if (context.cultural.news.length > 0) {
      console.log('\n  📰 News:');
      context.cultural.news.slice(0, 2).forEach((r, i) => {
        console.log(`\n  ${i + 1}. ${r.title} [${r.source}]`);
        if (r.url) console.log(`     🔗 ${r.url}`);
      });
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`⏱️  Generated: ${context.timestamp}`);
  console.log('═'.repeat(60) + '\n');
}

main();
