---
name: large-file-ingestion
description: Bypass Cursor chat upload limits by ingesting large files (>50MB) directly via CLI. Use when a user tries to upload a file and gets a connection error, session crash, or timeout — or when working with PPTX/PDF files over 50MB.
---

# Large File Ingestion

When Cursor's chat interface crashes or errors on file uploads (typically >50MB), use the CLI pipeline instead.

## Symptoms That Trigger This Skill

- "Connection Error" or "Connection failed" in Cursor chat
- Session crash when attaching a file
- Timeout on file upload
- User mentions a large PPTX, PDF, or DOCX they can't upload

## Quick Start

### 1. Locate the File

```bash
# Search common locations
find ~/Desktop ~/Downloads ~/Documents -maxdepth 3 \
  \( -name "*.pptx" -o -name "*.pdf" -o -name "*.docx" \) \
  -size +50M 2>/dev/null
```

If the filename is known, search by name:

```bash
find ~/Desktop ~/Downloads ~/Documents -maxdepth 3 -iname "*keyword*" 2>/dev/null
```

### 2. Copy to Project

```bash
# Sanitize filename (replace spaces/special chars with underscores)
cp "/path/to/Original File Name.pptx" \
   "./data/presentations/Sanitized_Filename.pptx"
```

**Naming convention:** `Client_DeckName_Year.pptx` (e.g., `JL_Master_Toolkit_2025.pptx`)

### 3. Convert to Markdown (for version control)

```bash
npm run convert -- -i "./data/presentations/Filename.pptx" \
  -o "./data/markdown/Filename.md" --analysis
```

The `--analysis` flag adds text density assessment and slide stats.

### 4. Dry Run (validate parsing)

```bash
npm run ingest -- "./data/presentations/Filename.pptx" \
  --client "ClientName" --type presentation --dry-run
```

Check the output for:
- Chunk count (should be reasonable — roughly 1 per slide)
- Sample chunk quality (readable text, not garbled)
- Image-heavy alerts (if avg text <50 chars/slide)

### 5. Full Ingest (embed + index)

```bash
npm run ingest -- "./data/presentations/Filename.pptx" \
  --client "ClientName" --type presentation
```

Optional flags:
- `--campaign "Campaign Name"` — tag with campaign
- `--type presentation|case_study|framework|other`

### 6. Verify Retrieval

```bash
npm run retrieve -- --query "relevant search terms about the content"
```

Confirm results appear from the new document with reasonable similarity scores (>55%).

## CLI Reference

| Command | Purpose |
|---------|---------|
| `npm run convert -- -i <file> -o <output>` | PPTX to Markdown |
| `npm run ingest -- <file> --client <name>` | Parse + embed + index |
| `npm run retrieve -- --query <text>` | Search vector store |
| `npm run batch-ingest -- <dir>` | Batch process directory |

## File Size Guidelines

| Size | Approach |
|------|----------|
| <50MB | Chat upload usually works |
| 50-500MB | Use this CLI workflow |
| >500MB | CLI workflow; expect 15-30s for embedding |

## Troubleshooting

- **"File not found"** — Use absolute path or verify with `ls -lh`
- **GCP auth error** — Run `gcloud auth application-default login`
- **Embedding timeout** — Check network; Vertex AI needs internet access
- **Low chunk quality** — File may be image-heavy; check the markdown conversion and speaker notes

## Related Skills

- `document-analysis` — Pattern extraction from parsed documents
- `participation-rag` — Full RAG pipeline operations
- `image-heavy-detection` — Handling presentations with minimal text

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Created: 2026-02-06
