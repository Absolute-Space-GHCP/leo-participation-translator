/**
 * @file formatters.ts
 * @description Output formatters for Participation Blueprint data
 * 
 *   Transforms the structured JSON output from Claude into the formats
 *   the creative team needs:
 *   - HTML for dashboard display (rich, interactive)
 *   - Markdown for archive and version control
 *   - Plain text for email delivery
 *   - Structured slide data for PPTX/Google Slides export
 * 
 *   The key principle: Claude's JSON is the single source of truth.
 *   Every output format is derived from it, ensuring consistency
 *   across all views of the same blueprint.
 * 
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-06
 * @updated 2026-02-06
 */

import type {
  ParticipationBlueprint,
  ParticipationWriteup,
  ParticipationPack,
  TierAOutput,
  TierBOutput,
  TierBRecommendation,
  SubcultureBrief,
  ParticipationMechanic,
  CreatorSuggestion,
} from './index.js';

// ─────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────

/**
 * A structured slide for PPTX/Google Slides export.
 * 
 * This is the bridge between our JSON data and the presentation
 * engine (Phase 4). Each slide has a type that determines its
 * visual template, plus content fields the template fills in.
 */
export interface SlideData {
  /** Slide type determines which visual template to use */
  type: 'title' | 'narrative' | 'recommendation' | 'mechanic' | 'subculture' | 'creator' | 'trend' | 'audacious-act' | 'closing';

  /** Slide title */
  title: string;

  /** Main body content */
  body: string;

  /** Optional subtitle or section label */
  subtitle?: string;

  /** Optional bullet points */
  bullets?: string[];

  /** Optional metadata tags */
  tags?: string[];

  /** Optional callout/highlight text */
  callout?: string;

  /** Slide number in the deck */
  slideNumber: number;
}

/**
 * Complete formatted output in all formats
 */
export interface FormattedBlueprint {
  /** Rich HTML for dashboard display */
  html: string;

  /** Clean markdown for archive/version control */
  markdown: string;

  /** Plain text for email delivery */
  plainText: string;

  /** Structured slide data for PPTX export */
  slides: SlideData[];

  /** Metadata about the formatting */
  meta: {
    brand: string;
    generatedAt: string;
    totalSlides: number;
    wordCount: number;
  };
}

// ─────────────────────────────────────────────────
// Markdown Formatter
// ─────────────────────────────────────────────────

/**
 * Format a Participation Blueprint as Markdown.
 * 
 * Markdown is our archival format — it's version-controllable,
 * human-readable, and converts easily to other formats.
 * The structure mirrors the Tier A/B output specification.
 */
export function formatAsMarkdown(blueprint: ParticipationBlueprint): string {
  const { seed, writeup, pack, metadata } = blueprint;
  const lines: string[] = [];

  // Header
  lines.push(`# Participation Blueprint: ${seed.brand}`);
  lines.push('');
  lines.push(`**Category:** ${seed.category}`);
  lines.push(`**Target Audience:** ${seed.targetAudience}`);
  lines.push(`**Generated:** ${metadata.generatedAt.toISOString().split('T')[0]}`);
  lines.push(`**Model:** ${metadata.modelVersion}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Tier A: Strategic Narrative
  lines.push('## The Participation Platform');
  lines.push('');
  lines.push(writeup.tierA.writeup);
  lines.push('');

  if (writeup.tierA.creativeApproach) {
    lines.push('### Creative Approach');
    lines.push('');
    lines.push(writeup.tierA.creativeApproach);
    lines.push('');
  }

  if (writeup.tierA.mediaStrategy) {
    lines.push('### Media Strategy');
    lines.push('');
    lines.push(writeup.tierA.mediaStrategy);
    lines.push('');
  }

  if (writeup.tierA.creatorStrategy) {
    lines.push('### Creator & Influencer Strategy');
    lines.push('');
    lines.push(writeup.tierA.creatorStrategy);
    lines.push('');
  }

  // Tier B: Executional Recommendations
  if (writeup.tierB.recommendations.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('## Recommended Executions');
    lines.push('');

    for (const rec of writeup.tierB.recommendations) {
      lines.push(formatRecommendationMarkdown(rec));
    }
  }

  // Participation Pack
  lines.push('---');
  lines.push('');
  lines.push('## Participation Pack');
  lines.push('');

  // Big Audacious Act
  lines.push('### The Big Audacious Act');
  lines.push('');
  lines.push(`**${pack.bigAudaciousAct.title}**`);
  lines.push('');
  lines.push(pack.bigAudaciousAct.description);
  lines.push('');
  lines.push(`*Risk Level: ${pack.bigAudaciousAct.riskLevel} | Impact: ${pack.bigAudaciousAct.potentialImpact}*`);
  lines.push('');

  // Subculture Briefs
  if (pack.subcultureBriefs?.length > 0) {
    lines.push('### Subculture Briefs');
    lines.push('');
    for (const brief of pack.subcultureBriefs) {
      lines.push(formatSubcultureMarkdown(brief));
    }
  }

  // Mechanics
  if (pack.mechanics?.length > 0) {
    lines.push('### Participation Mechanics');
    lines.push('');
    for (const mech of pack.mechanics) {
      lines.push(formatMechanicMarkdown(mech));
    }
  }

  // Creators
  if (pack.creators?.length > 0) {
    lines.push('### Casting & Creators');
    lines.push('');
    for (const creator of pack.creators) {
      lines.push(formatCreatorMarkdown(creator));
    }
  }

  // Trend Hijacks
  if (pack.trendHijacks?.length > 0) {
    lines.push('### 72-Hour Trend Hijacks');
    lines.push('');
    for (const hijack of pack.trendHijacks) {
      lines.push(`**${hijack.trend || 'Unnamed Trend'}**`);
      lines.push(`${hijack.execution || hijack.description || ''}`);
      lines.push(`*Timing: ${hijack.timing || 'TBD'} | Risk: ${hijack.riskLevel || 'medium'}*`);
      lines.push('');
    }
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push(`*Generated by The Participation Translator | ${metadata.durationMs / 1000}s | ${metadata.tokensUsed.toLocaleString()} tokens*`);

  return lines.join('\n');
}

// ─────────────────────────────────────────────────
// HTML Formatter
// ─────────────────────────────────────────────────

/**
 * Format a Participation Blueprint as HTML.
 * 
 * This is what the dashboard displays. Uses JL branding (from the
 * jl-branding-toolkit skill) — JL Black, JL White, Helvetica Neue,
 * Inter for numerals, with accent colors for status indicators.
 */
export function formatAsHtml(blueprint: ParticipationBlueprint): string {
  const { seed, writeup, pack, metadata } = blueprint;

  return `
<article class="blueprint" data-brand="${escapeHtml(seed.brand)}" data-generated="${metadata.generatedAt.toISOString()}">
  <header class="blueprint-header">
    <h1 class="blueprint-title">${escapeHtml(seed.brand)}</h1>
    <p class="blueprint-meta">
      <span class="meta-category">${escapeHtml(seed.category)}</span>
      <span class="meta-audience">${escapeHtml(seed.targetAudience)}</span>
      <span class="meta-date">${metadata.generatedAt.toISOString().split('T')[0]}</span>
    </p>
  </header>

  <section class="tier-a">
    <h2>The Participation Platform</h2>
    <div class="writeup-narrative">${markdownToHtml(writeup.tierA.writeup)}</div>

    ${writeup.tierA.creativeApproach ? `
    <div class="strategy-block">
      <h3>Creative Approach</h3>
      <div>${markdownToHtml(writeup.tierA.creativeApproach)}</div>
    </div>` : ''}

    ${writeup.tierA.mediaStrategy ? `
    <div class="strategy-block">
      <h3>Media Strategy</h3>
      <div>${markdownToHtml(writeup.tierA.mediaStrategy)}</div>
    </div>` : ''}

    ${writeup.tierA.creatorStrategy ? `
    <div class="strategy-block">
      <h3>Creator & Influencer Strategy</h3>
      <div>${markdownToHtml(writeup.tierA.creatorStrategy)}</div>
    </div>` : ''}
  </section>

  ${writeup.tierB.recommendations.length > 0 ? `
  <section class="tier-b">
    <h2>Recommended Executions</h2>
    <div class="recommendations-grid">
      ${writeup.tierB.recommendations.map((rec, i) => formatRecommendationHtml(rec, i + 1)).join('\n')}
    </div>
  </section>` : ''}

  <section class="pack">
    <h2>Participation Pack</h2>

    <div class="audacious-act">
      <h3>The Big Audacious Act</h3>
      <h4>${escapeHtml(pack.bigAudaciousAct.title)}</h4>
      <p>${escapeHtml(pack.bigAudaciousAct.description)}</p>
      <div class="act-meta">
        <span class="risk-badge risk-${pack.bigAudaciousAct.riskLevel}">${pack.bigAudaciousAct.riskLevel}</span>
        <span class="impact">${escapeHtml(pack.bigAudaciousAct.potentialImpact)}</span>
      </div>
    </div>

    ${pack.subcultureBriefs?.length > 0 ? `
    <div class="subcultures">
      <h3>Subculture Briefs</h3>
      ${pack.subcultureBriefs.map(b => formatSubcultureHtml(b)).join('\n')}
    </div>` : ''}

    ${pack.mechanics?.length > 0 ? `
    <div class="mechanics">
      <h3>Participation Mechanics</h3>
      ${pack.mechanics.map(m => formatMechanicHtml(m)).join('\n')}
    </div>` : ''}

    ${pack.creators?.length > 0 ? `
    <div class="creators">
      <h3>Casting & Creators</h3>
      ${pack.creators.map(c => formatCreatorHtml(c)).join('\n')}
    </div>` : ''}

    ${pack.trendHijacks?.length > 0 ? `
    <div class="trend-hijacks">
      <h3>72-Hour Trend Hijacks</h3>
      ${pack.trendHijacks.map(t => `
      <div class="hijack-card">
        <h4>${escapeHtml(t.trend || '')}</h4>
        <p>${escapeHtml(t.execution || t.description || '')}</p>
        <div class="hijack-meta">
          <span class="timing">${escapeHtml(t.timing || 'TBD')}</span>
          <span class="risk-badge risk-${t.riskLevel}">${t.riskLevel}</span>
        </div>
      </div>`).join('\n')}
    </div>` : ''}
  </section>

  <footer class="blueprint-footer">
    <p>Generated by The Participation Translator</p>
    <p class="generation-stats">
      <span>${(metadata.durationMs / 1000).toFixed(1)}s</span>
      <span>${metadata.tokensUsed.toLocaleString()} tokens</span>
      <span>${metadata.modelVersion}</span>
    </p>
  </footer>
</article>`;
}

// ─────────────────────────────────────────────────
// Plain Text Formatter
// ─────────────────────────────────────────────────

/**
 * Format a Participation Blueprint as plain text.
 * 
 * For email delivery — clean, no formatting, readable in any
 * email client including plain-text views. Leo can forward this
 * directly to his team.
 */
export function formatAsPlainText(blueprint: ParticipationBlueprint): string {
  const { seed, writeup, pack, metadata } = blueprint;
  const lines: string[] = [];
  const divider = '═'.repeat(60);
  const subDivider = '─'.repeat(40);

  lines.push(divider);
  lines.push(`PARTICIPATION BLUEPRINT: ${seed.brand.toUpperCase()}`);
  lines.push(divider);
  lines.push('');
  lines.push(`Category: ${seed.category}`);
  lines.push(`Target Audience: ${seed.targetAudience}`);
  lines.push(`Generated: ${metadata.generatedAt.toISOString().split('T')[0]}`);
  lines.push('');

  // Tier A
  lines.push(divider);
  lines.push('THE PARTICIPATION PLATFORM');
  lines.push(divider);
  lines.push('');
  lines.push(writeup.tierA.writeup);
  lines.push('');

  if (writeup.tierA.creativeApproach) {
    lines.push(subDivider);
    lines.push('CREATIVE APPROACH');
    lines.push(subDivider);
    lines.push(writeup.tierA.creativeApproach);
    lines.push('');
  }

  if (writeup.tierA.mediaStrategy) {
    lines.push(subDivider);
    lines.push('MEDIA STRATEGY');
    lines.push(subDivider);
    lines.push(writeup.tierA.mediaStrategy);
    lines.push('');
  }

  if (writeup.tierA.creatorStrategy) {
    lines.push(subDivider);
    lines.push('CREATOR & INFLUENCER STRATEGY');
    lines.push(subDivider);
    lines.push(writeup.tierA.creatorStrategy);
    lines.push('');
  }

  // Tier B
  if (writeup.tierB.recommendations.length > 0) {
    lines.push(divider);
    lines.push('RECOMMENDED EXECUTIONS');
    lines.push(divider);
    lines.push('');

    for (let i = 0; i < writeup.tierB.recommendations.length; i++) {
      const rec = writeup.tierB.recommendations[i];
      lines.push(`${i + 1}. ${rec.title}`);
      lines.push(`   ${rec.description}`);
      const elements = [
        rec.hasCreative ? 'Creative' : null,
        rec.hasMedia ? 'Media' : null,
        rec.hasCreator ? 'Creator' : null,
      ].filter(Boolean).join(' + ');
      lines.push(`   [${elements}] | Effort: ${rec.effort}`);
      lines.push(`   Why: ${rec.participationRationale}`);
      lines.push('');
    }
  }

  // Pack
  lines.push(divider);
  lines.push('PARTICIPATION PACK');
  lines.push(divider);
  lines.push('');

  lines.push('THE BIG AUDACIOUS ACT');
  lines.push(subDivider);
  lines.push(`${pack.bigAudaciousAct.title}`);
  lines.push(`${pack.bigAudaciousAct.description}`);
  lines.push(`Risk: ${pack.bigAudaciousAct.riskLevel} | Impact: ${pack.bigAudaciousAct.potentialImpact}`);
  lines.push('');

  if (pack.subcultureBriefs?.length > 0) {
    lines.push('SUBCULTURE BRIEFS');
    lines.push(subDivider);
    for (const brief of pack.subcultureBriefs) {
      lines.push(`> ${brief.subculture || brief.name || 'Unnamed'}`);
      lines.push(`  ${brief.message || brief.description || ''}`);
      lines.push(`  Platforms: ${Array.isArray(brief.platforms) ? brief.platforms.join(', ') : 'TBD'}`);
      lines.push(`  Formats: ${Array.isArray(brief.contentFormats) ? brief.contentFormats.join(', ') : 'TBD'}`);
      lines.push('');
    }
  }

  if (pack.mechanics?.length > 0) {
    lines.push('PARTICIPATION MECHANICS');
    lines.push(subDivider);
    for (const mech of pack.mechanics) {
      lines.push(`> ${mech.name || mech.title || 'Unnamed'} (${mech.type || 'N/A'})`);
      lines.push(`  ${mech.description || ''}`);
      lines.push(`  Implementation: ${mech.implementation || 'TBD'}`);
      lines.push(`  Expected Engagement: ${mech.expectedEngagement || 'TBD'}`);
      lines.push('');
    }
  }

  // Footer
  lines.push(divider);
  lines.push(`Generated by The Participation Translator | ${(metadata.durationMs / 1000).toFixed(1)}s | ${metadata.tokensUsed.toLocaleString()} tokens`);

  return lines.join('\n');
}

// ─────────────────────────────────────────────────
// Slide Data Formatter
// ─────────────────────────────────────────────────

/**
 * Format a Participation Blueprint as structured slide data.
 * 
 * This is the bridge to Phase 4 (PPTX export). Each slide has a
 * type that maps to a visual template in the presentation engine.
 * The slide order follows PLAN.md spec: Title → Write-up → 
 * Recommendations → Big Act → Subcultures → Mechanics → 
 * Creators → Trends → Closing.
 */
export function formatAsSlides(blueprint: ParticipationBlueprint): SlideData[] {
  const { seed, writeup, pack } = blueprint;
  const slides: SlideData[] = [];
  let slideNum = 1;

  // Slide 1: Title
  slides.push({
    type: 'title',
    title: seed.brand,
    body: `Participation Blueprint`,
    subtitle: `${seed.category} | ${seed.targetAudience}`,
    slideNumber: slideNum++,
  });

  // Slide 2: The Participation Platform (narrative)
  slides.push({
    type: 'narrative',
    title: 'The Participation Platform',
    body: writeup.tierA.writeup,
    slideNumber: slideNum++,
  });

  // Slide 3: Creative Approach
  if (writeup.tierA.creativeApproach) {
    slides.push({
      type: 'narrative',
      title: 'Creative Approach',
      body: writeup.tierA.creativeApproach,
      slideNumber: slideNum++,
    });
  }

  // Slide 4: Media Strategy
  if (writeup.tierA.mediaStrategy) {
    slides.push({
      type: 'narrative',
      title: 'Media Strategy',
      body: writeup.tierA.mediaStrategy,
      slideNumber: slideNum++,
    });
  }

  // Slide 5: Creator Strategy
  if (writeup.tierA.creatorStrategy) {
    slides.push({
      type: 'narrative',
      title: 'Creator & Influencer Strategy',
      body: writeup.tierA.creatorStrategy,
      slideNumber: slideNum++,
    });
  }

  // Slides 6-N: Recommendations (one per slide)
  for (const rec of writeup.tierB.recommendations) {
    const elements = [
      rec.hasCreative ? 'Creative' : null,
      rec.hasMedia ? 'Media' : null,
      rec.hasCreator ? 'Creator' : null,
    ].filter(Boolean);

    slides.push({
      type: 'recommendation',
      title: rec.title,
      body: rec.description,
      subtitle: rec.participationRationale,
      tags: elements as string[],
      callout: `Effort: ${rec.effort}`,
      bullets: [
        rec.mediaDetails || '',
        rec.creatorDetails || '',
      ].filter(Boolean),
      slideNumber: slideNum++,
    });
  }

  // Big Audacious Act slide
  slides.push({
    type: 'audacious-act',
    title: 'The Big Audacious Act',
    body: pack.bigAudaciousAct?.description || '',
    subtitle: pack.bigAudaciousAct?.title || '',
    callout: `Risk: ${pack.bigAudaciousAct?.riskLevel || 'high'}`,
    slideNumber: slideNum++,
  });

  // Subculture slides
  for (const brief of (pack.subcultureBriefs || [])) {
    slides.push({
      type: 'subculture',
      title: brief.subculture || brief.name || 'Subculture',
      body: brief.message || brief.description || '',
      bullets: Array.isArray(brief.contentFormats) ? brief.contentFormats : [],
      tags: Array.isArray(brief.platforms) ? brief.platforms : [],
      slideNumber: slideNum++,
    });
  }

  // Mechanic slides
  for (const mech of (pack.mechanics || [])) {
    slides.push({
      type: 'mechanic',
      title: mech.name || mech.title || 'Mechanic',
      body: mech.description || '',
      subtitle: mech.type || '',
      bullets: [
        `Implementation: ${mech.implementation || 'TBD'}`,
        `Expected Engagement: ${mech.expectedEngagement || 'TBD'}`,
      ],
      slideNumber: slideNum++,
    });
  }

  // Creator slides
  for (const creator of (pack.creators || [])) {
    slides.push({
      type: 'creator',
      title: creator.archetype || creator.name || 'Creator',
      body: creator.rationale || creator.description || '',
      subtitle: creator.role || '',
      tags: Array.isArray(creator.platforms) ? creator.platforms : [],
      slideNumber: slideNum++,
    });
  }

  // Trend hijack slides
  for (const hijack of (pack.trendHijacks || [])) {
    slides.push({
      type: 'trend',
      title: hijack.trend || hijack.name || 'Trend',
      body: hijack.execution || hijack.description || '',
      subtitle: hijack.timing || '',
      callout: `Risk: ${hijack.riskLevel || 'medium'}`,
      slideNumber: slideNum++,
    });
  }

  // Closing slide
  slides.push({
    type: 'closing',
    title: 'Next Steps',
    body: `Participation Blueprint for ${seed.brand}`,
    subtitle: 'Johannes Leonardo',
    slideNumber: slideNum++,
  });

  return slides;
}

// ─────────────────────────────────────────────────
// Full Format (all formats at once)
// ─────────────────────────────────────────────────

/**
 * Format a blueprint into all output formats simultaneously.
 * 
 * This is the convenience function — call it once, get everything.
 * Used when exporting or saving a blueprint for the first time.
 */
export function formatBlueprint(blueprint: ParticipationBlueprint): FormattedBlueprint {
  const markdown = formatAsMarkdown(blueprint);
  const html = formatAsHtml(blueprint);
  const plainText = formatAsPlainText(blueprint);
  const slides = formatAsSlides(blueprint);

  // Word count from the narrative (rough measure of output quality)
  const wordCount = markdown.split(/\s+/).length;

  return {
    html,
    markdown,
    plainText,
    slides,
    meta: {
      brand: blueprint.seed.brand,
      generatedAt: blueprint.metadata.generatedAt.toISOString(),
      totalSlides: slides.length,
      wordCount,
    },
  };
}

// ─────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────

/** Escape HTML special characters */
function escapeHtml(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Basic markdown to HTML conversion (paragraphs and bold) */
function markdownToHtml(text: string): string {
  return text
    .split('\n\n')
    .map(para => `<p>${para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`)
    .join('\n');
}

/** Format a recommendation as markdown */
function formatRecommendationMarkdown(rec: TierBRecommendation): string {
  const elements = [
    rec.hasCreative ? 'Creative' : null,
    rec.hasMedia ? 'Media' : null,
    rec.hasCreator ? 'Creator' : null,
  ].filter(Boolean).join(' + ');

  let md = `#### ${rec.title}\n\n`;
  md += `${rec.description}\n\n`;
  md += `*${elements} | Effort: ${rec.effort}*\n\n`;
  md += `> ${rec.participationRationale}\n\n`;
  if (rec.mediaDetails) md += `**Media:** ${rec.mediaDetails}\n`;
  if (rec.creatorDetails) md += `**Creator:** ${rec.creatorDetails}\n`;
  md += '\n';
  return md;
}

/** Format a recommendation as HTML */
function formatRecommendationHtml(rec: TierBRecommendation, num: number): string {
  const elements = [
    rec.hasCreative ? '<span class="tag tag-creative">Creative</span>' : '',
    rec.hasMedia ? '<span class="tag tag-media">Media</span>' : '',
    rec.hasCreator ? '<span class="tag tag-creator">Creator</span>' : '',
  ].filter(Boolean).join(' ');

  return `
    <div class="recommendation-card" data-effort="${rec.effort}">
      <div class="rec-number">${String(num).padStart(2, '0')}</div>
      <h4>${escapeHtml(rec.title)}</h4>
      <p>${escapeHtml(rec.description)}</p>
      <div class="rec-tags">${elements}</div>
      <p class="rec-rationale">${escapeHtml(rec.participationRationale)}</p>
      <span class="effort-badge effort-${rec.effort}">${rec.effort}</span>
    </div>`;
}

/** Format a subculture brief as markdown */
function formatSubcultureMarkdown(brief: SubcultureBrief): string {
  let md = `#### ${brief.subculture || brief.name || 'Unnamed Subculture'}\n\n`;
  md += `${brief.message || brief.description || ''}\n\n`;
  if (Array.isArray(brief.platforms) && brief.platforms.length) {
    md += `- **Platforms:** ${brief.platforms.join(', ')}\n`;
  }
  if (Array.isArray(brief.contentFormats) && brief.contentFormats.length) {
    md += `- **Content Formats:** ${brief.contentFormats.join(', ')}\n`;
  }
  md += '\n';
  return md;
}

/** Format a subculture brief as HTML */
function formatSubcultureHtml(brief: SubcultureBrief): string {
  return `
    <div class="subculture-card">
      <h4>${escapeHtml(brief.subculture || brief.name || 'Unnamed')}</h4>
      <p>${escapeHtml(brief.message || brief.description || '')}</p>
      ${Array.isArray(brief.platforms) && brief.platforms.length ? `<div class="platforms">${brief.platforms.map(p => `<span class="platform-tag">${escapeHtml(p)}</span>`).join(' ')}</div>` : ''}
      ${Array.isArray(brief.contentFormats) && brief.contentFormats.length ? `<div class="formats">${brief.contentFormats.map(f => `<span class="format-tag">${escapeHtml(f)}</span>`).join(' ')}</div>` : ''}
    </div>`;
}

/** Format a mechanic as markdown */
function formatMechanicMarkdown(mech: ParticipationMechanic): string {
  let md = `#### ${mech.name || mech.title || 'Unnamed'} *(${mech.type || 'N/A'})*\n\n`;
  md += `${mech.description || ''}\n\n`;
  if (mech.implementation) md += `- **Implementation:** ${mech.implementation}\n`;
  if (mech.expectedEngagement) md += `- **Expected Engagement:** ${mech.expectedEngagement}\n`;
  md += '\n';
  return md;
}

/** Format a mechanic as HTML */
function formatMechanicHtml(mech: ParticipationMechanic): string {
  return `
    <div class="mechanic-card" data-type="${mech.type || 'general'}">
      <h4>${escapeHtml(mech.name || mech.title || 'Unnamed')}</h4>
      <span class="type-badge type-${mech.type || 'general'}">${mech.type || 'general'}</span>
      <p>${escapeHtml(mech.description || '')}</p>
      <dl>
        <dt>Implementation</dt><dd>${escapeHtml(mech.implementation || 'TBD')}</dd>
        <dt>Expected Engagement</dt><dd>${escapeHtml(mech.expectedEngagement || 'TBD')}</dd>
      </dl>
    </div>`;
}

/** Format a creator as markdown */
function formatCreatorMarkdown(creator: CreatorSuggestion): string {
  let md = `#### ${creator.archetype || creator.name || 'Unnamed'}\n\n`;
  if (creator.role) md += `**Role:** ${creator.role}\n\n`;
  md += `${creator.rationale || creator.description || ''}\n\n`;
  if (Array.isArray(creator.platforms) && creator.platforms.length) {
    md += `- **Platforms:** ${creator.platforms.join(', ')}\n`;
  }
  md += '\n';
  return md;
}

/** Format a creator as HTML */
function formatCreatorHtml(creator: CreatorSuggestion): string {
  return `
    <div class="creator-card">
      <h4>${escapeHtml(creator.archetype || creator.name || 'Unnamed')}</h4>
      <span class="role">${escapeHtml(creator.role || '')}</span>
      <p>${escapeHtml(creator.rationale || creator.description || '')}</p>
      ${Array.isArray(creator.platforms) && creator.platforms.length ? `<div class="platforms">${creator.platforms.map(p => `<span class="platform-tag">${escapeHtml(p)}</span>`).join(' ')}</div>` : ''}
    </div>`;
}
