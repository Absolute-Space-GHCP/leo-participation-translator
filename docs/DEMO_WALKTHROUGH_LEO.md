# The Participation Translator — Demo Walkthrough for Leo

**Date:** February 13, 2026
**URL:** https://participation-translator-904747039219.us-central1.run.app
**Local:** http://localhost:3005 (backup)

---

## Step 1: Open the App

Open your browser and navigate to:

```
https://participation-translator-904747039219.us-central1.run.app
```

You'll land on the **Login Page** — a dark screen with the Participation Translator logo and a "Sign in with Google" button.

---

## Step 2: Sign In

1. Click **"Sign in with Google"**
2. Select your `@johannesleonardo.com` Google account
3. You'll be redirected to the **Landing Page** — the 3-option selector

> **Note:** Only authorized JL accounts can sign in. Anyone outside the allowlist sees "Your account is not authorized."

---

## Step 3: Launch the Engine Room

From the Landing Page, you have three options. For the full experience:

- Click the green **"Launch The Participation Translator"** button at the top, OR
- Click **"Launch Option C"** (The Engine Room) at the bottom

Both take you to the same place: the **Engine Room Dashboard**.

---

## Step 4: Explore the Dashboard (Before Generating)

When the Engine Room loads, you'll see a **split-panel layout**:

**Left Panel (dark)** — the Command Center:
- **Knowledge Base Stats** at the top: ~1,186 indexed chunks, 23 documents, 12 clients
- **Input form** with fields for Brand, Category, Audience, and The Passive Idea
- **"+ More Options"** expander for Budget, Timeline, and Context
- **Reference Documents** drop zone (drag and drop PPTX/PDF/DOCX files)
- **"Generate Blueprint"** button (blue, activates once required fields are filled)
- **"Load Sample Demo"** button (pre-fills with a Nike Running scenario)
- **Quick-Load Scenarios** — three pre-built scenarios (Adidas, Uber, Roblox) with brand-colored highlights
- **Indexed Clients** list at the bottom showing all 12 clients in the knowledge base

**Right Panel (light)** — the Canvas:
- Shows "FROM PASSIVE TO PARTICIPATION" watermark text
- Instructions: "Fill in the form. Click generate."
- This is where the output will stream in real time

---

## Step 5: Fill in the Seed Data

**Option A — Use a Quick-Load Scenario:**
Click one of the three Quick-Load Scenarios (Adidas, Uber, or Roblox). The form auto-fills with a realistic brief. Notice the client tag highlights in the Indexed Clients list below.

**Option B — Enter Your Own Brief:**
Fill in the four required fields:
- **Brand:** e.g., "Adidas"
- **Category:** e.g., "Athletic Footwear"
- **Audience:** e.g., "Gen Z sneaker culture, streetwear communities"
- **The Passive Idea:** e.g., "A traditional TV campaign showing athletes wearing the new shoe line with an inspirational voiceover"

Optionally expand **"+ More Options"** to add:
- **Budget:** e.g., "$500K–$1M"
- **Timeline:** e.g., "Q3 2026"
- **Context:** Any additional brand considerations

**Option C — Upload a Reference Document:**
Drag a PPTX, PDF, or DOCX into the **Reference Documents** area. The file is parsed and its content is included as additional context for the generation.

---

## Step 6: Generate the Blueprint

Once the four required fields are filled, the **"GENERATE BLUEPRINT"** button glows blue.

1. Click **"GENERATE BLUEPRINT"**
2. Watch the **pipeline progress bar** appear in the header:

```
RETRIEVE → CULTURE → ASSEMBLE → GENERATE → COMPLETE
```

**What happens behind the scenes (visible in the left panel):**

- **RETRIEVE (RAG):** The system searches 1,186 chunks of JL institutional knowledge for relevant past work. Retrieved chunks appear in the left panel with relevance scores (color-coded: blue = high, gold = medium).

- **CULTURE (CI):** Four parallel searches hit Exa.ai and Tavily to gather real-time cultural intelligence — trending topics, subculture signals, and timely moments relevant to the brand/category. Cultural signals appear below the retrieved chunks in green.

- **ASSEMBLE:** The system assembles the context: your seed data + retrieved JL patterns + cultural intelligence into a structured prompt.

- **GENERATE:** Claude generates the full Participation Blueprint. Text streams into the right panel in real time. You'll see a blinking blue cursor as it writes.

---

## Step 7: Explore the Output

When generation completes, the output is organized into **three tabs** across the top of the right panel:

### Tab 1: NARRATIVE (4 sections)
The strategic foundation:
- **Participation Worthy Idea Write-Up** — The core reframe from passive to participation
- **Overall Creative Approach** — Creative direction and tone
- **Media Strategy Overview** — Channel strategy built for participation
- **Creator / Influencer Strategy** — First Responders and amplifiers

### Tab 2: EXECUTIONAL (1 section)
- **Executional Recommendations** — 5-7 specific activation ideas with details

### Tab 3: PACK (5 sections)
The Participation Pack:
- **The Big Audacious Act** — The headline-grabbing centerpiece
- **Subculture Mini-Briefs** — Tailored approaches for specific communities
- **Mechanic Deep-Dives** — Detailed breakdowns of key mechanics
- **Casting & Creators** — Specific talent and community recommendations
- **72-Hour Trend Hijacks** — Time-sensitive cultural opportunities

Click each tab to explore the different tiers of output.

---

## Step 8: Metadata Footer

At the very bottom of the right panel, a **metadata bar** shows:
- **MODEL:** Which Claude model was used
- **INPUT / OUTPUT:** Token counts
- **DURATION:** How long generation took
- **RAG:** Number of knowledge chunks used
- **CULTURAL:** Number of cultural intelligence signals
- **SECTIONS:** Total sections generated

This gives full transparency into what powered the output.

---

## Step 9: Actions (Header Bar)

After generation completes, action buttons appear in the top-right header:

| Button | What It Does |
|---|---|
| **COPY** | Copies the active tab's content to clipboard |
| **PDF** | Downloads the full blueprint as a branded PDF |
| **EMAIL** | Opens a modal to email the PDF to any address |
| **REGENERATE** | Runs the full pipeline again with the same inputs |
| **RESET** | Clears everything and returns to the empty form |

---

## Step 10: Refine the Output

At the bottom of the right panel, click **"REFINE THIS OUTPUT..."** to open a refinement bar.

Type a direction, e.g.:
- "Make it bolder"
- "Focus more on TikTok activations"
- "Add a guerrilla marketing element"
- "Lean into the Gen Z humor angle"

Press Enter or click **REFINE**. The system re-runs with your feedback included, producing an updated blueprint.

---

## Quick Demo Script (5 minutes)

If time is short:

1. **Login** → Sign in with Google (30 sec)
2. **Landing** → Click green "Launch" button (5 sec)
3. **Quick-Load** → Click "Adidas" scenario (5 sec)
4. **Show the form** → Point out the auto-filled fields + knowledge base stats (30 sec)
5. **Generate** → Click "GENERATE BLUEPRINT" (60-90 sec to complete)
6. **Watch the pipeline** → Narrate as chunks and cultural signals appear (during generation)
7. **Explore tabs** → Click through Narrative, Executional, Pack (60 sec)
8. **Download PDF** → Click PDF button (5 sec)
9. **Refine** → Type "Make it more disruptive" → watch it regenerate (60-90 sec)
10. **Reset** → Show it's ready for the next brief (5 sec)

---

## Backup: Load Sample Demo

If the API or network has issues, click **"LOAD SAMPLE DEMO"** on the left panel. This loads a pre-generated Nike Running blueprint instantly — perfect for showing the output format and tab navigation without needing live generation.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Login page shows error | Clear cookies, try again |
| "Your account is not authorized" | Contact Charley — email needs to be added to the allowlist |
| Generation takes too long | API calls to Claude + cultural sources can take 60-90 seconds. Pipeline progress bar shows current stage. |
| No chunks retrieved | The knowledge base may not have content for that specific brand/category. Try a brand we've indexed (Adidas, Nike, Uber, Roblox, etc.) |
| Blank right panel after generation | Check the tabs — content may be in a different tab than the one currently selected |

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Cursor (IDE)
Last Updated: 2026-02-13
