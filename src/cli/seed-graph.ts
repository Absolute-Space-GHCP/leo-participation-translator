#!/usr/bin/env tsx
/**
 * @file seed-graph.ts
 * @description Seed the knowledge graph with 8-Part Participation Framework
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 * 
 * Usage:
 *   npx tsx src/cli/seed-graph.ts
 */

import { config } from 'dotenv';
import { 
  createKnowledgeGraph, 
  seedFrameworkSections,
  type KnowledgeNode,
} from '../lib/memory/knowledge-graph.js';

// Load environment variables
config();

async function main() {
  console.log('\n🧠 Participation Translator - Knowledge Graph Seeding\n');
  console.log('─'.repeat(50));
  
  // Create graph
  const graph = createKnowledgeGraph();
  
  // Seed framework sections
  console.log('⏳ Seeding 8-Part Participation Framework...\n');
  seedFrameworkSections(graph);
  
  // Add some initial strategic patterns
  const strategicPatterns: Omit<KnowledgeNode, 'createdAt'>[] = [
    {
      id: 'pattern_think_small',
      type: 'pattern',
      label: 'Think Small / Counter-Intuitive Positioning',
      data: {
        client: 'Volkswagen',
        description: 'Embrace perceived weaknesses as strengths. Turn industry norms on their head with honest, self-aware messaging.',
        effectiveness: 0.95,
        sourceDocuments: [],
      },
    },
    {
      id: 'pattern_cultural_hijack',
      type: 'pattern',
      label: 'Cultural Moment Hijacking',
      data: {
        description: 'Identify trending cultural moments with 72-hour opportunity windows and insert brand relevantly.',
        effectiveness: 0.85,
        sourceDocuments: [],
      },
    },
    {
      id: 'pattern_unfinished_platform',
      type: 'pattern',
      label: 'Unfinished Platform',
      data: {
        description: 'Create a platform that invites completion by the audience. The brand provides the stage, the audience writes the story.',
        effectiveness: 0.9,
        sourceDocuments: [],
      },
    },
    {
      id: 'pattern_first_responders',
      type: 'pattern',
      label: 'First Responder Strategy',
      data: {
        description: 'Identify and activate niche subcultures to ignite participation before mainstream adoption.',
        effectiveness: 0.88,
        sourceDocuments: [],
      },
    },
    {
      id: 'pattern_credibility_bridge',
      type: 'pattern',
      label: 'Credibility Bridge',
      data: {
        description: 'Connect brand heritage/truth to cultural relevance through authentic shared interests.',
        effectiveness: 0.87,
        sourceDocuments: [],
      },
    },
  ];
  
  for (const pattern of strategicPatterns) {
    graph.addNode({
      ...pattern,
      createdAt: new Date(),
    });
  }
  
  // Add some initial tactics
  const tactics: Omit<KnowledgeNode, 'createdAt'>[] = [
    {
      id: 'tactic_user_generated',
      type: 'tactic',
      label: 'User-Generated Content Campaign',
      data: {
        description: 'Invite audience to create and share content around a brand-provided prompt or platform.',
        sourceDocuments: [],
      },
    },
    {
      id: 'tactic_creator_collab',
      type: 'tactic',
      label: 'Creator Collaboration',
      data: {
        description: 'Partner with niche creators who have authentic audience relationships in target subcultures.',
        sourceDocuments: [],
      },
    },
    {
      id: 'tactic_realtime_response',
      type: 'tactic',
      label: 'Real-Time Response',
      data: {
        description: 'Brand responds to cultural moments in real-time, demonstrating cultural fluency.',
        sourceDocuments: [],
      },
    },
    {
      id: 'tactic_experiential_activation',
      type: 'tactic',
      label: 'Experiential Activation',
      data: {
        description: 'Create physical or digital experiences that audiences can participate in and share.',
        sourceDocuments: [],
      },
    },
  ];
  
  for (const tactic of tactics) {
    graph.addNode({
      ...tactic,
      createdAt: new Date(),
    });
  }
  
  // Create relationships
  console.log('⏳ Creating relationships...\n');
  
  // Pattern → Framework mappings
  graph.addEdge({
    from: 'pattern_unfinished_platform',
    to: 'framework_5',
    type: 'maps_to',
    weight: 1.0,
    metadata: { note: 'Core concept of The Participation Worthy Idea' },
  });
  
  graph.addEdge({
    from: 'pattern_first_responders',
    to: 'framework_8',
    type: 'maps_to',
    weight: 1.0,
    metadata: { note: 'Directly implements First Responders section' },
  });
  
  graph.addEdge({
    from: 'pattern_cultural_hijack',
    to: 'framework_1',
    type: 'maps_to',
    weight: 0.9,
    metadata: { note: 'Leverages Current Cultural Context' },
  });
  
  graph.addEdge({
    from: 'pattern_credibility_bridge',
    to: 'framework_2',
    type: 'maps_to',
    weight: 0.95,
    metadata: { note: 'Establishes Brand Credibility' },
  });
  
  graph.addEdge({
    from: 'pattern_credibility_bridge',
    to: 'framework_3',
    type: 'maps_to',
    weight: 0.9,
    metadata: { note: 'Identifies The Shared Interest' },
  });
  
  // Tactic → Pattern relationships
  graph.addEdge({
    from: 'tactic_user_generated',
    to: 'pattern_unfinished_platform',
    type: 'similar_to',
    weight: 0.85,
  });
  
  graph.addEdge({
    from: 'tactic_creator_collab',
    to: 'pattern_first_responders',
    type: 'similar_to',
    weight: 0.8,
  });
  
  graph.addEdge({
    from: 'tactic_realtime_response',
    to: 'pattern_cultural_hijack',
    type: 'similar_to',
    weight: 0.9,
  });
  
  // Get stats
  const stats = graph.getStats();
  
  console.log('─'.repeat(50));
  console.log('KNOWLEDGE GRAPH SEEDED');
  console.log('─'.repeat(50));
  console.log(`\n   Nodes: ${stats.nodes}`);
  console.log(`   Edges: ${stats.edges}`);
  console.log(`   Patterns: ${stats.patterns}`);
  console.log(`   Campaigns: ${stats.campaigns}`);
  console.log(`   Framework Sections: ${graph.getNodesByType('framework_section').length}`);
  console.log(`   Tactics: ${graph.getNodesByType('tactic').length}`);
  console.log(`   Density: ${(stats.density * 100).toFixed(2)}%`);
  
  // Export graph
  const exported = graph.export();
  
  // Save to file
  const fs = await import('fs/promises');
  const outputPath = './data/knowledge-graph.json';
  
  await fs.mkdir('./data', { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(exported, null, 2));
  
  console.log(`\n📁 Exported to: ${outputPath}`);
  
  // Show framework sections
  console.log('\n─'.repeat(50));
  console.log('FRAMEWORK SECTIONS');
  console.log('─'.repeat(50));
  
  const sections = graph.getNodesByType('framework_section');
  for (const section of sections.sort((a, b) => 
    (a.data.frameworkSection || 0) - (b.data.frameworkSection || 0)
  )) {
    console.log(`\n   ${section.data.frameworkSection}. ${section.label}`);
  }
  
  // Show patterns
  console.log('\n─'.repeat(50));
  console.log('STRATEGIC PATTERNS');
  console.log('─'.repeat(50));
  
  const patterns = graph.getPatterns();
  for (const pattern of patterns) {
    console.log(`\n   📌 ${pattern.label}`);
    if (pattern.data.description) {
      console.log(`      ${pattern.data.description.substring(0, 80)}...`);
    }
  }
  
  console.log('\n\n✨ Knowledge graph seeding complete!\n');
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});
