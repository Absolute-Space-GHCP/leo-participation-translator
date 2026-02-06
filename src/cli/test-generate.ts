/**
 * @file test-generate.ts
 * @description End-to-end test of the Phase 2 generation pipeline.
 *              Runs a full blueprint generation using the Philadelphia Cream Cheese brief.
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-06
 * @updated 2026-02-06
 */

import { config } from 'dotenv';
config();

import type { ProjectSeed } from '../lib/generation/index.js';
import { generateBlueprint } from '../lib/generation/index.js';
import { formatBlueprint } from '../lib/generation/formatters.js';

// ─────────────────────────────────────────────────
// Philadelphia Cream Cheese — Test Seed
// ─────────────────────────────────────────────────

const philadelphiaSeed: ProjectSeed = {
  brand: 'Philadelphia Cream Cheese',
  category: 'Dairy / Food & Beverage',
  targetAudience: 'Millennials (25-40) who view cream cheese as a commodity, not a premium ingredient',
  traditionalIdea: `Philadelphia is shedding its cold, corporate skin to reclaim its place as a cultural icon. For too long, we've been viewed as a factory-made commodity, lost in the "low-interest" white noise of the dairy aisle. We are moving beyond the bagel to prove that Philadelphia isn't just an ingredient—it's a transformative spark. We are the shorthand for quality, turning the mundane into the extraordinary and the "good" into something Really Philly Good.

To lead this charge, we introduce the Phillyboy: a modern, authentic cowboy who trades his horse for a cow. This isn't a joke; it's a visually arresting anchor to our real-dairy roots. He is the warm, clever face of our brand, countering "factory-made" perceptions with a silent, premium confidence. He doesn't need slapstick humor to break through the clutter—the sheer audacity of his presence does the work for him.

Our mission is simple: we look for every opportunity to dial life up. Whether it's a dollop in a weekday pasta or a smear on a midnight snack, the Phillyboy is there to show that our creamy touch of magic elevates every moment. We are reclaiming our name, our humanity, and our flavor. It's not just cream cheese; it's a bold POV that makes everything it touches Really Philly Good.`,
  sharedInterest: 'The Shared Interest is "Dialing Life Up" — both Philadelphia and its audience share a desire to turn the ordinary into the extraordinary, whether it\'s food, moments, or experiences.',
  brandConsiderations: 'The Phillyboy character is a key creative asset. Must reinforce real-dairy, premium positioning. Avoid slapstick humor — confidence and audacity are the tone.',
  additionalContext: 'Philadelphia Cream Cheese was invented in 1872 in Chester, New York. The brand has a rich heritage but has been perceived as a commodity. The "Really Philly Good" platform is designed to reclaim cultural relevance.',
};

// ─────────────────────────────────────────────────
// Main Test
// ─────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('═══════════════════════════════════════════════════');
  console.log(' PARTICIPATION TRANSLATOR — END-TO-END TEST');
  console.log('═══════════════════════════════════════════════════');
  console.log(`\nBrand: ${philadelphiaSeed.brand}`);
  console.log(`Category: ${philadelphiaSeed.category}`);
  console.log(`Target: ${philadelphiaSeed.targetAudience}`);
  console.log(`Shared Interest: ${philadelphiaSeed.sharedInterest}`);
  console.log('');

  const startTime = Date.now();

  try {
    // ── Step 1: Generate the full blueprint ──
    console.log('\n📋 Step 1: Generating Participation Blueprint...');
    console.log('   (RAG retrieval → Cultural intel → Prompt assembly → Claude → Parse → Format)');
    console.log('');

    // Use env model or default to sonnet for testing
    // Once Opus 4.6 is enabled in Model Garden, remove this override
    const modelOverride = process.env.VERTEX_AI_CLAUDE_MODEL || 'claude-sonnet-4-5';
    console.log(`   Model override: ${modelOverride}`);
    console.log('');

    const blueprint = await generateBlueprint(philadelphiaSeed, {
      stream: false,
      model: modelOverride,
      skipCultural: false,
      skipEvolution: true, // No prior generations to learn from yet
      onProgress: (stage, progress) => {
        console.log(`   [${(progress * 100).toFixed(0)}%] ${stage}`);
      },
    });

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

    // ── Step 2: Display results summary ──
    console.log('\n═══════════════════════════════════════════════════');
    console.log(' RESULTS');
    console.log('═══════════════════════════════════════════════════');

    console.log('\n📊 Generation Metadata:');
    console.log(`   Duration: ${durationSec}s`);
    console.log(`   Tokens used: ${blueprint.metadata.tokensUsed.toLocaleString()}`);
    console.log(`   Model: ${blueprint.metadata.modelVersion}`);
    console.log(`   RAG sources: ${blueprint.retrievedContext.documentCount} documents`);
    console.log(`   Cultural trends: ${blueprint.culturalContext.trendsUsed}`);

    // ── Step 3: Show Tier A output ──
    console.log('\n📝 TIER A — Write-up (first 500 chars):');
    console.log('─'.repeat(50));
    const writeupPreview = blueprint.writeup.tierA.writeup.slice(0, 500);
    console.log(writeupPreview + (blueprint.writeup.tierA.writeup.length > 500 ? '...' : ''));

    console.log('\n🎨 Creative Approach:');
    console.log(blueprint.writeup.tierA.creativeApproach.slice(0, 300));

    console.log('\n📺 Media Strategy:');
    console.log(blueprint.writeup.tierA.mediaStrategy.slice(0, 300));

    console.log('\n🎤 Creator Strategy:');
    console.log(blueprint.writeup.tierA.creatorStrategy.slice(0, 300));

    // ── Step 4: Show Tier B recommendations ──
    console.log('\n📋 TIER B — Recommendations:');
    console.log('─'.repeat(50));
    for (const rec of blueprint.writeup.tierB.recommendations) {
      console.log(`\n  → ${rec.title}`);
      console.log(`    ${rec.description.slice(0, 150)}...`);
      console.log(`    Effort: ${rec.effort} | Creative: ${rec.hasCreative} | Media: ${rec.hasMedia} | Creator: ${rec.hasCreator}`);
    }

    // ── Step 5: Show Pack highlights ──
    console.log('\n🎯 PARTICIPATION PACK:');
    console.log('─'.repeat(50));

    const pack = blueprint.pack;
    
    if (pack.bigAudaciousAct) {
      console.log(`\n  Big Audacious Act: ${pack.bigAudaciousAct.title}`);
      console.log(`  ${pack.bigAudaciousAct.description.slice(0, 200)}...`);
    }

    const briefs = pack.subcultureBriefs || [];
    console.log(`\n  Subculture Briefs: ${briefs.length}`);
    for (const brief of briefs) {
      const name = brief.subculture || brief.name || 'Unnamed';
      const msg = brief.message || brief.description || JSON.stringify(brief).slice(0, 80);
      console.log(`    • ${name}: ${msg.slice(0, 80)}...`);
    }

    const mechs = pack.mechanics || [];
    console.log(`\n  Mechanics: ${mechs.length}`);
    for (const mech of mechs) {
      const name = mech.name || mech.title || 'Unnamed';
      const type = mech.type || 'N/A';
      const desc = mech.description || JSON.stringify(mech).slice(0, 80);
      console.log(`    • ${name} (${type}): ${desc.slice(0, 80)}...`);
    }

    const creators = pack.creators || [];
    console.log(`\n  Creators: ${creators.length}`);
    for (const creator of creators) {
      const arch = creator.archetype || creator.name || 'Unnamed';
      const rat = creator.rationale || creator.description || JSON.stringify(creator).slice(0, 80);
      console.log(`    • ${arch}: ${rat.slice(0, 80)}...`);
    }

    const hijacks = pack.trendHijacks || [];
    console.log(`\n  Trend Hijacks: ${hijacks.length}`);
    for (const hijack of hijacks) {
      const trend = hijack.trend || hijack.name || 'Unnamed';
      const exec = hijack.execution || hijack.description || JSON.stringify(hijack).slice(0, 80);
      console.log(`    • ${trend}: ${exec.slice(0, 80)}...`);
    }

    // ── Step 6: Format output ──
    console.log('\n\n📄 Generating formatted outputs...');
    const formatted = formatBlueprint(blueprint);
    
    console.log(`   Markdown: ${formatted.markdown.length.toLocaleString()} chars`);
    console.log(`   HTML: ${formatted.html.length.toLocaleString()} chars`);
    console.log(`   Plain text: ${formatted.plainText.length.toLocaleString()} chars`);
    console.log(`   Slides: ${formatted.slides.length} slides`);

    // ── Step 7: Write markdown output to file ──
    const outputPath = `data/test-outputs/philadelphia-blueprint-${new Date().toISOString().split('T')[0]}.md`;
    const { writeFile, mkdir } = await import('fs/promises');
    await mkdir('data/test-outputs', { recursive: true });
    await writeFile(outputPath, formatted.markdown);
    console.log(`\n   ✅ Full markdown output written to: ${outputPath}`);

    // ── Final ──
    console.log('\n═══════════════════════════════════════════════════');
    console.log(` ✅ END-TO-END TEST PASSED (${durationSec}s)`);
    console.log('═══════════════════════════════════════════════════\n');

  } catch (error: unknown) {
    const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error('\n═══════════════════════════════════════════════════');
    console.error(` ❌ END-TO-END TEST FAILED (${durationSec}s)`);
    console.error('═══════════════════════════════════════════════════');
    
    if (error instanceof Error) {
      console.error(`\nError: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    } else {
      console.error(`\nError: ${String(error)}`);
    }
    
    process.exit(1);
  }
}

main();
