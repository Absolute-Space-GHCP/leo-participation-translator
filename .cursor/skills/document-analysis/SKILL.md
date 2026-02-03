---
name: document-analysis
description: Parse and analyze JL presentations to extract strategic patterns, voice, and tactical approaches. Use when working with presentation files.
---

# Document Analysis Skill

## Quick Start

### Parse a Presentation

```bash
npx ts-node scripts/parse-presentation.ts --file path/to/deck.pptx
```

## When to Use

- **New presentation upload**: Extract content for ingestion
- **Pattern identification**: Find JL strategic patterns
- **Voice analysis**: Identify JL language and tone

## Supported Formats

| Format  | Parser    | Notes                |
| ------- | --------- | -------------------- |
| `.pdf`  | pdf-parse | Text extraction      |
| `.pptx` | pptx2json | Slide-by-slide       |
| `.docx` | mammoth   | Section preservation |

## JL Pattern Vocabulary

When analyzing documents, look for these patterns:

### Strategic Patterns

- **Think Small** - Contrarian positioning
- **Cultural Hijack** - Riding existing momentum
- **Unfinished Platform** - Audience completes the idea
- **First Responders** - Seeding with micro-communities

### Framework Mapping

Map content to the 8-Part Framework sections:

1. Cultural Context
2. Brand Credibility
3. Shared Interest
4. Passive Trap
5. Participation Worthy Idea
6. Moments and Places
7. Mechanics
8. First Responders
9. Ripple Effect

## Output Format

```json
{
  "document": {
    "filename": "presentation.pptx",
    "type": "presentation",
    "pages": 25
  },
  "content": {
    "slides": [
      {
        "number": 1,
        "title": "Slide Title",
        "content": "Extracted text",
        "notes": "Speaker notes if available"
      }
    ]
  },
  "analysis": {
    "patterns": ["cultural_hijack", "first_responders"],
    "frameworkCoverage": [1, 3, 5, 7, 8],
    "voiceMarkers": ["bold positioning", "cultural fluency"]
  }
}
```

## Related

- `document-analyzer` agent - Uses this skill
- `participation-rag` skill - Receives parsed output

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
