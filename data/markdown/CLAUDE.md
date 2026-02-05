# Markdown Presentation Archive

This directory contains **text extractions** from JL presentation files (PPTX).

## Purpose

- **Version Control:** ~480KB vs ~1.5GB original PPTX files (4,200x smaller)
- **RAG Pipeline:** Text content ready for embedding and retrieval
- **Human Readable:** Easy to review and search

## Structure

Each `.md` file contains:

```yaml
---
source: "Original_File.pptx"     # Source file name
total_slides: 43                  # Slide count
total_chars: 12710                # Total text characters
avg_chars_per_slide: 296          # Text density
slides_with_notes: 0              # Speaker notes count
converted_at: "2026-02-05T..."    # Conversion timestamp
---
```

Followed by slide-by-slide content with speaker notes (when available).

## Regeneration

To regenerate from source PPTX files:

```bash
npm run convert -- --batch -i "./data/presentations" -o "./data/markdown" --analysis
```

## Statistics

| Metric | Value |
|--------|-------|
| Files | 19 |
| Total Slides | 1,026 |
| Total Characters | 363,104 |
| Size | ~480 KB |

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Created: 2026-02-05
