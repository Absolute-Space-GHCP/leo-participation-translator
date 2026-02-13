/**
 * @file parse-output.ts
 * @description Parses Claude's structured output into typed sections for tabbed display and PDF export.
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 * @updated 2026-02-11
 */

export type SectionTier = "writeup" | "tactics";

export interface OutputSection {
  key: string;
  title: string;
  tier: SectionTier;
  content: string;
}

// ── Known section headers mapped to tier ──

const SECTION_MAP: Record<string, { key: string; title: string; tier: SectionTier }> = {
  // ── Tab 1: The Transformed Idea (one seamless narrative) ──
  "PARTICIPATION WORTHY IDEA WRITE-UP": {
    key: "write-up",
    title: "Participation Worthy Idea Write-Up",
    tier: "writeup",
  },
  // ── Tab 2: Creative Tactics & Ideas (5 tactical sections) ──
  "THE BIG AUDACIOUS ACT": {
    key: "big-act",
    title: "The Big Audacious Act",
    tier: "tactics",
  },
  "SUBCULTURE MINI-BRIEFS": {
    key: "subcultures",
    title: "Subculture Mini-Briefs",
    tier: "tactics",
  },
  "MECHANIC DEEP-DIVES": {
    key: "mechanics",
    title: "Mechanic Deep-Dives",
    tier: "tactics",
  },
  "CASTING AND CREATORS": {
    key: "casting",
    title: "Casting & Creators",
    tier: "tactics",
  },
  "72-HOUR TREND HIJACKS": {
    key: "trend-hijacks",
    title: "72-Hour Trend Hijacks",
    tier: "tactics",
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
      // Unknown header but has content -- include as writeup fallback
      sections.push({
        key: headerRaw.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
        title: headerRaw,
        tier: "writeup",
        content,
      });
    }
  }

  // Fallback: if no sections parsed, return raw content as single section
  if (sections.length === 0 && raw.trim().length > 0) {
    sections.push({
      key: "raw",
      title: "Blueprint Output",
      tier: "writeup",
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
    { tier: "writeup" as SectionTier, label: "THE TRANSFORMED IDEA", count: sections.filter((s) => s.tier === "writeup").length },
    { tier: "tactics" as SectionTier, label: "CREATIVE TACTICS & IDEAS", count: sections.filter((s) => s.tier === "tactics").length },
  ];
}
