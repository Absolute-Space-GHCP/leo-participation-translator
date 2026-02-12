/**
 * @file parse-output.ts
 * @description Parses Claude's structured output into typed sections for tabbed display and PDF export.
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 * @updated 2026-02-11
 */

export type SectionTier = "narrative" | "executional" | "pack";

export interface OutputSection {
  key: string;
  title: string;
  tier: SectionTier;
  content: string;
}

// ── Known section headers mapped to tier ──

const SECTION_MAP: Record<string, { key: string; title: string; tier: SectionTier }> = {
  "PARTICIPATION WORTHY IDEA WRITE-UP": {
    key: "write-up",
    title: "Participation Worthy Idea Write-Up",
    tier: "narrative",
  },
  "OVERALL CREATIVE APPROACH": {
    key: "creative-approach",
    title: "Overall Creative Approach",
    tier: "narrative",
  },
  "MEDIA STRATEGY OVERVIEW": {
    key: "media-strategy",
    title: "Media Strategy Overview",
    tier: "narrative",
  },
  "CREATOR/INFLUENCER STRATEGY": {
    key: "creator-strategy",
    title: "Creator / Influencer Strategy",
    tier: "narrative",
  },
  "EXECUTIONAL RECOMMENDATIONS": {
    key: "executional",
    title: "Executional Recommendations",
    tier: "executional",
  },
  "THE BIG AUDACIOUS ACT": {
    key: "big-act",
    title: "The Big Audacious Act",
    tier: "pack",
  },
  "SUBCULTURE MINI-BRIEFS": {
    key: "subcultures",
    title: "Subculture Mini-Briefs",
    tier: "pack",
  },
  "MECHANIC DEEP-DIVES": {
    key: "mechanics",
    title: "Mechanic Deep-Dives",
    tier: "pack",
  },
  "CASTING AND CREATORS": {
    key: "casting",
    title: "Casting & Creators",
    tier: "pack",
  },
  "72-HOUR TREND HIJACKS": {
    key: "trend-hijacks",
    title: "72-Hour Trend Hijacks",
    tier: "pack",
  },
};

/**
 * Parse Claude's raw output into structured sections.
 * Splits on ## headers and maps to known section types.
 * Falls back to a single "raw" section if no headers found.
 */
export function parseOutput(raw: string): OutputSection[] {
  if (!raw || raw.trim().length === 0) return [];

  // Split on ## headers (keeping the header text)
  const parts = raw.split(/^## /m);
  const sections: OutputSection[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Extract header (first line) and content (rest)
    const newlineIdx = trimmed.indexOf("\n");
    if (newlineIdx === -1) continue;

    const headerRaw = trimmed.substring(0, newlineIdx).trim();
    const content = trimmed.substring(newlineIdx + 1).trim();

    // Match against known sections (case-insensitive, flexible)
    const headerUpper = headerRaw.toUpperCase().replace(/[^\w\s/-]/g, "").trim();
    const match = Object.entries(SECTION_MAP).find(([key]) =>
      headerUpper.includes(key) || key.includes(headerUpper)
    );

    if (match) {
      const [, meta] = match;
      sections.push({ ...meta, content });
    } else if (content.length > 50) {
      // Unknown header but has content -- include as narrative fallback
      sections.push({
        key: headerRaw.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
        title: headerRaw,
        tier: "narrative",
        content,
      });
    }
  }

  // Fallback: if no sections parsed, return raw content as single section
  if (sections.length === 0 && raw.trim().length > 0) {
    sections.push({
      key: "raw",
      title: "Blueprint Output",
      tier: "narrative",
      content: raw.trim(),
    });
  }

  return sections;
}

/**
 * Get sections filtered by tier.
 */
export function getSectionsByTier(sections: OutputSection[], tier: SectionTier): OutputSection[] {
  return sections.filter((s) => s.tier === tier);
}

/**
 * Get all tier labels and their section counts for tab display.
 */
export function getTierCounts(sections: OutputSection[]): { tier: SectionTier; label: string; count: number }[] {
  return [
    { tier: "narrative", label: "STRATEGIC NARRATIVE", count: sections.filter((s) => s.tier === "narrative").length },
    { tier: "executional", label: "EXECUTIONAL", count: sections.filter((s) => s.tier === "executional").length },
    { tier: "pack", label: "PARTICIPATION PACK", count: sections.filter((s) => s.tier === "pack").length },
  ];
}
