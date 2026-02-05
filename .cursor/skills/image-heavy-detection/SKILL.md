# Image-Heavy Presentation Detection Skill

**Version:** 1.0.0
**Created:** 2026-02-05
**Purpose:** Detect and handle presentations where key concepts are in images rather than extractable text

---

## When to Use This Skill

Use this skill when:
- Processing PPTX/PDF presentations for RAG ingestion
- Text extraction yields minimal content per slide
- Presentations appear to be visually-focused (creative concepts, mood boards, visual campaigns)
- The ingested content seems incomplete or lacks key ideas

---

## Problem Statement

Creative presentations often convey ideas through:
- Visual mood boards
- Image-based concept art
- Typography as imagery
- Screenshots and mockups
- Infographics with embedded text

Standard text extraction misses these concepts, leading to:
- Poor retrieval results
- Incomplete context for generation
- Missing key strategic insights

---

## Detection Algorithm

### Step 1: Calculate Text-to-Slide Ratio

```typescript
interface SlideAnalysis {
  slideNumber: number;
  textLength: number;
  hasImages: boolean;
  textDensity: 'low' | 'medium' | 'high';
}

function analyzePresentation(slides: Slide[]): PresentationAnalysis {
  const analyses = slides.map((slide, i) => ({
    slideNumber: i + 1,
    textLength: slide.text?.length || 0,
    hasImages: slide.images?.length > 0,
    textDensity: categorizeTextDensity(slide.text?.length || 0)
  }));
  
  const avgTextPerSlide = analyses.reduce((sum, a) => sum + a.textLength, 0) / analyses.length;
  const lowTextSlides = analyses.filter(a => a.textDensity === 'low').length;
  const lowTextRatio = lowTextSlides / analyses.length;
  
  return {
    totalSlides: slides.length,
    avgTextPerSlide,
    lowTextRatio,
    isImageHeavy: avgTextPerSlide < 100 || lowTextRatio > 0.5,
    slideAnalyses: analyses
  };
}

function categorizeTextDensity(textLength: number): 'low' | 'medium' | 'high' {
  if (textLength < 50) return 'low';
  if (textLength < 200) return 'medium';
  return 'high';
}
```

### Step 2: Thresholds

| Metric | Threshold | Classification |
|--------|-----------|----------------|
| Avg text per slide | < 100 chars | Image-heavy |
| Low-text slides ratio | > 50% | Image-heavy |
| Combined | Either condition | Needs enrichment |

### Step 3: Alert System

When a presentation is detected as image-heavy:

```typescript
interface ImageHeavyAlert {
  filename: string;
  avgTextPerSlide: number;
  lowTextRatio: number;
  recommendation: string;
  affectedSlides: number[];
}

function createAlert(analysis: PresentationAnalysis, filename: string): ImageHeavyAlert {
  return {
    filename,
    avgTextPerSlide: analysis.avgTextPerSlide,
    lowTextRatio: analysis.lowTextRatio,
    recommendation: getRecommendation(analysis),
    affectedSlides: analysis.slideAnalyses
      .filter(s => s.textDensity === 'low')
      .map(s => s.slideNumber)
  };
}

function getRecommendation(analysis: PresentationAnalysis): string {
  if (analysis.lowTextRatio > 0.7) {
    return 'CRITICAL: This presentation requires manual enrichment. Consider creating a companion summary document.';
  }
  if (analysis.lowTextRatio > 0.5) {
    return 'WARNING: Many slides lack text. Check speaker notes or add metadata.';
  }
  return 'NOTICE: Some slides may need text enrichment for optimal retrieval.';
}
```

---

## Remediation Options

### Option A: Speaker Notes Extraction

If the presentation has speaker notes, extract them as additional context:

```typescript
async function extractSpeakerNotes(pptxPath: string): Promise<string[]> {
  const zip = await JSZip.loadAsync(fs.readFileSync(pptxPath));
  const notes: string[] = [];
  
  for (const [filename, file] of Object.entries(zip.files)) {
    if (filename.includes('notesSlides')) {
      const content = await file.async('string');
      const text = extractTextFromXml(content);
      if (text) notes.push(text);
    }
  }
  
  return notes;
}
```

### Option B: Companion Summary File

Create a TXT file with manual concept descriptions:

**File format:** `{presentation_name}_summary.txt`

```
# Presentation Summary: Campaign X

## Slide 1-3: Brand Context
Key concept: Establishing brand heritage through archival imagery
Strategic insight: Leveraging nostalgia to create emotional connection

## Slide 4-7: Creative Concept
Key concept: "Participation through creation" - users become co-creators
Visual elements: User-generated content examples, participation mechanics

## Slide 8-10: Execution Examples
Key concept: Multi-platform activation
Channels: TikTok challenge, Instagram filter, OOH installations
```

### Option C: Metadata Tagging

Add structured metadata in manifest.csv:

```csv
filename,client,category,year,type,notes,concepts,visual_heavy
"Campaign_Deck.pptx","Client","Category","2024","creative","","brand heritage;participation mechanics;UGC","true"
```

---

## Implementation in Parser

Add to `src/lib/parsers/pptx.ts`:

```typescript
import type { ParseResult, ImageHeavyAlert } from '../types';

export async function parsePptx(filePath: string): Promise<ParseResult> {
  const slides = await extractSlides(filePath);
  const text = slides.map(s => s.text).join('\n\n');
  
  // Image-heavy detection
  const analysis = analyzePresentation(slides);
  
  let alert: ImageHeavyAlert | undefined;
  if (analysis.isImageHeavy) {
    alert = createAlert(analysis, path.basename(filePath));
    
    // Try to get speaker notes as fallback
    const speakerNotes = await extractSpeakerNotes(filePath);
    if (speakerNotes.length > 0) {
      text += '\n\n--- Speaker Notes ---\n' + speakerNotes.join('\n\n');
      alert.recommendation += ' Speaker notes were found and included.';
    }
  }
  
  return {
    text,
    metadata: {
      slideCount: slides.length,
      avgTextPerSlide: analysis.avgTextPerSlide,
      isImageHeavy: analysis.isImageHeavy
    },
    alert
  };
}
```

---

## CLI Integration

Add a `--check-images` flag to the ingest command:

```bash
# Check for image-heavy presentations before ingesting
npm run ingest -- ./data/presentations/*.pptx --check-images

# Output:
# ⚠️ Image-Heavy Presentations Detected:
# 
# 1. Campaign_Deck.pptx
#    - Avg text per slide: 45 chars
#    - Low-text slides: 8/10 (80%)
#    - Recommendation: CRITICAL - requires manual enrichment
#    - Affected slides: 1, 2, 4, 5, 6, 7, 9, 10
#
# 2. Mood_Board.pptx
#    - Avg text per slide: 78 chars
#    - Low-text slides: 6/12 (50%)
#    - Recommendation: WARNING - check speaker notes
#    - Affected slides: 3, 4, 5, 8, 9, 10
#
# Run with --enrich to attempt automatic enrichment
# Run with --skip-image-heavy to exclude these files
```

---

## Workflow Summary

```
┌─────────────────┐
│ Parse PPTX      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Analyze Slides  │
│ (text density)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Image-Heavy?    │────▶│ Normal Ingest   │
│   (No)          │     └─────────────────┘
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│ Generate Alert  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Speaker   │
│ Notes           │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼ Found   ▼ Not Found
┌────────┐ ┌─────────────────┐
│Include │ │Flag for Manual  │
│ Notes  │ │Enrichment       │
└────────┘ └─────────────────┘
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/lib/parsers/pptx.ts` | Add image-heavy detection |
| `src/lib/parsers/types.ts` | Add alert types |
| `src/cli/ingest.ts` | Add --check-images flag |
| `data/presentations/*_summary.txt` | Manual summaries for flagged files |

---

## Success Criteria

- [ ] Presentations are automatically classified as image-heavy or not
- [ ] Alerts are generated for image-heavy presentations
- [ ] Speaker notes are extracted when available
- [ ] Clear remediation path for users
- [ ] No silent failures - all issues surfaced

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Created: 2026-02-05
