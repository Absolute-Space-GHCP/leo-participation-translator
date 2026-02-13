# Demo Walkthrough - Engine Room Dashboard

**Version:** 2.1.0
**Date:** 2026-02-13
**Purpose:** Step-by-step guide for the live demo with Leo and Jan

---

## Pre-Demo Checklist

- [x] **Production URL live:** `https://participation-translator-904747039219.us-central1.run.app`
- [x] **Auth configured:** Google OAuth with JL email allowlist
- [x] Anthropic API key configured
- [x] Knowledge base: 23 documents, 1,186 chunks, 12 clients
- [x] Cultural APIs: Exa.ai + Tavily configured
- [x] Demo sample fallback ready (Nike Running)
- [x] Three quick-load scenarios prepared (Adidas, Uber, Roblox)
- [ ] Resend API key for email delivery (optional — PDF download works without it)

### Authorized Users
- `charleys@johannesleonardo.com`
- `leop@johannesleonardo.com`
- `janj@johannesleonardo.com`

---

## Quick Start

**Production (recommended for demos):**
```
https://participation-translator-904747039219.us-central1.run.app
```

**Local development:**
```bash
# Start dev server
cd app && npx next dev --port 3005

# Open dashboard
open http://localhost:3005
```

---

## Demo Flow (15-20 minutes)

### 0. Login (30 seconds)

Navigate to the production URL or `http://localhost:3005`. You will be redirected to the login page.

1. Click **"Sign in with Google"**
2. Select your `@johannesleonardo.com` Google account
3. You'll be redirected to the landing page

> Only allowlisted JL emails can access the tool. Unauthorized emails see an access denied page.

### 1. Dashboard Overview (2 min)

Click **"Engine Room"** (Option C) from the landing page, or navigate directly to `/option-c`

**Show:**
- Split-panel layout (dark command center / white canvas)
- Knowledge base stats (1,186 chunks, 23 documents, 9 clients)
- Indexed client tags
- Quick-load scenario buttons

**Talking Points:**
- "This is the Engine Room — where passive ideas become participation-worthy platforms"
- "The system already has JL's institutional knowledge indexed — 23 presentations from Adidas, Uber, Roblox, MassMutual, and more"
- "Everything generates in real time using Claude, grounded in JL's past work and live cultural intelligence"

### 2. First Generation — Adidas (8-10 min)

Click the **"Adidas — Run Club Platform"** quick-load scenario.

The form auto-fills:
- **Brand:** Adidas
- **Category:** Running Shoes
- **Passive Idea:** TV commercial with slow-mo athletes
- **Audience:** Urban runners 20-35 in run club culture

Click **GENERATE BLUEPRINT**.

**What happens (visible in real time):**

1. **RETRIEVE** — Searches 1,186 chunks for relevant Adidas past work
2. **CULTURE** — Gathers live cultural signals from Exa.ai and Tavily
3. **ASSEMBLE** — Builds the strategic prompt with context
4. **GENERATE** — Claude streams the blueprint in real time

**Left panel fills with:**
- Retrieved chunks (Adidas ZX, Climacool presentations) with relevance scores
- Cultural intelligence signals (sneaker trends, running community discussions)

**Right panel streams 10 sections across 3 tabs:**
- **STRATEGIC NARRATIVE** (4 sections): Write-Up, Creative Approach, Media Strategy, Creator Strategy
- **EXECUTIONAL** (1 section): Specific recommendations
- **PARTICIPATION PACK** (5 sections): Big Audacious Act, Subculture Mini-Briefs, Mechanic Deep-Dives, Casting & Creators, 72-Hour Trend Hijacks

**Talking Points:**
- "Notice how it pulls from real Adidas ZX and Climacool presentations we've worked on"
- "The cultural layer found live conversations about running shoes happening right now"
- "The output follows our Participation Framework but reads as a seamless narrative — the framework is invisible"

### 3. Explore the Output (3 min)

Once generation completes:

- **Switch tabs** to show Strategic Narrative → Executional → Participation Pack
- **Click PDF** to download the blueprint
- **Try REFINE** — type "Make it bolder and add a guerrilla activation" → hit Refine
- **Click COPY** to copy the current tab to clipboard

**Talking Points:**
- "Every section is formatted for easy scanning — click through the tabs"
- "Download as PDF at any time — title page, tier dividers, the whole blueprint"
- "If something needs adjusting, type a note and hit Refine — it regenerates with your feedback baked in"

### 4. File Upload (2 min)

Expand **"+ MORE OPTIONS"** and **"REFERENCE DOCUMENTS"** section.

Drag a file in (or click Browse):
- Accepts PPTX, PDF, DOCX, TXT, MD
- Text is extracted in-memory — no files saved to disk
- Becomes additional context for the generation

**Talking Points:**
- "If a client shares a brief or reference doc, just drop it in — the system extracts the text and uses it as additional context"
- "This is all in-memory — nothing hits the disk. Fast and reliable."

### 5. Demo Fallback — Nike Sample (if needed)

If live generation is slow or you want a guaranteed-perfect result:

Click **"LOAD SAMPLE DEMO"**

- Form fills with Nike Running scenario
- Output instantly shows the pre-built 10-section blueprint
- Tabs, PDF download, copy — all work immediately

### 6. Second Scenario (Optional, 3-5 min)

Click **RESET** → Select **"Uber — Urban Mobility"** or **"Roblox — Creator Economy"**

Shows the system works across different brands and categories, not just sports.

---

## Seed Scenarios Available

| Scenario | Brand | Category | RAG Leverage |
|---|---|---|---|
| **Adidas — Run Club Platform** | Adidas | Running Shoes | Strong (Adidas ZX, Climacool presentations) |
| **Uber — Urban Mobility** | Uber | Ride-Hailing | Good (Uber presentations indexed) |
| **Roblox — Creator Economy** | Roblox | Gaming / Virtual Worlds | Good (Roblox presentations indexed) |
| **Nike — Sample Demo** | Nike | Running | Pre-built (instant, no API call) |

---

## Key Features to Highlight

| Feature | Where | What It Does |
|---|---|---|
| RAG Retrieval | Left panel (during generation) | Shows relevant past JL work with relevance scores |
| Cultural Intel | Left panel (during generation) | Live signals from Exa.ai + Tavily |
| Streaming Output | Right panel | Blueprint appears in real time as Claude generates |
| Tabbed Display | Right panel tabs | 3 tiers: Narrative, Executional, Pack |
| PDF Export | Header → PDF button | Downloads full blueprint as formatted PDF |
| Refine | Bottom of right panel | Iterate with feedback without starting over |
| Regenerate | Header → REGENERATE | Fresh generation with same inputs |
| Demo Mode | LOAD SAMPLE DEMO button | Instant pre-built Nike output |

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Redirected to login page | Expected — sign in with your `@johannesleonardo.com` account |
| "Access Denied" after login | Email not on allowlist — contact Charley to add |
| "Connection refused" (local) | Dev server stopped — restart: `cd app && npx next dev --port 3005` |
| "Email not configured" | Normal — add `RESEND_API_KEY` to `.env.local` or use PDF download |
| Generation takes 4+ min | Normal for 10-section output — content streams progressively |
| "No chunks found" | Knowledge base issue — check `/api/stats` |
| Error during generation | Click "TRY AGAIN" or use the demo sample fallback |

---

## After the Demo

**Ask Leo and Jan:**
1. How does the output quality feel? Anything to tune?
2. Which sections are most valuable?
3. What's the first real brief to run through it?
4. Preferred output format (PDF good for now? PPTX later?)
5. Any additional past work to index?

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.6, Cursor (IDE)
Updated: 2026-02-13
