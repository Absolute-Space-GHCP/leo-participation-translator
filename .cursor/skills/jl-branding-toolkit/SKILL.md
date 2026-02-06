---
name: jl-branding-toolkit
description: Apply Johannes Leonardo brand guidelines to UI components, dashboards, frontend design, and UX elements. Use when creating or styling any visual interface — including React components, Tailwind CSS, HTML pages, dashboards, presentations, or any user-facing design work for JL.
---

# JL Branding Toolkit

Official brand guidelines for Johannes Leonardo (JL). Apply these when building any UI, dashboard, frontend component, or visual design element.

**Source:** JL Master Toolkit 2025 (internal branding deck)

## Color Palette

### Hero Colors (Primary)

| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| **JL Black** | `#111111` | `bg-[#111111]` / `text-[#111111]` | Primary backgrounds, text |
| **JL White** | `#F1F1F1` | `bg-[#F1F1F1]` / `text-[#F1F1F1]` | Light backgrounds, text on dark |

### Accent Colors (Use Sparingly)

| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| **JL Sapphire** | `#166AD8` | `bg-[#166AD8]` | Links, interactive elements, primary actions |
| **JL Ruby** | `#FF4133` | `bg-[#FF4133]` | Alerts, errors, critical highlights |
| **JL Emerald** | `#079176` | `bg-[#079176]` | Success states, confirmations |
| **JL Gold** | `#F6C627` | `bg-[#F6C627]` | Warnings, featured highlights |

### Color Rules

- Black and White are the **hero colors** — use them as the dominant palette
- Use **one accent color at a time** — never combine multiple accents in the same section
- Graphics over any color background should use **JL Black**
- Accent colors are for emphasis, not decoration

### CSS Custom Properties

```css
:root {
  --jl-black: #111111;
  --jl-white: #F1F1F1;
  --jl-sapphire: #166AD8;
  --jl-ruby: #FF4133;
  --jl-emerald: #079176;
  --jl-gold: #F6C627;
}
```

### Tailwind Config Extension

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        jl: {
          black: '#111111',
          white: '#F1F1F1',
          sapphire: '#166AD8',
          ruby: '#FF4133',
          emerald: '#079176',
          gold: '#F6C627',
        }
      }
    }
  }
}
```

Usage: `bg-jl-black`, `text-jl-sapphire`, `border-jl-emerald`, etc.

## Typography

### Font Stack

| Role | Font | Weight | Fallback |
|------|------|--------|----------|
| **Titles** | Helvetica Bold OR Times New Roman | Bold | `font-sans` / `font-serif` |
| **Subtitles** | Helvetica Neue | Regular (400) | `font-sans` |
| **Body** | Helvetica Neue | Regular + Bold | `font-sans` |
| **Body Alt** | Times New Roman | Regular | `font-serif` |
| **Numerals** | Inter | Medium / Semi-Bold | `font-sans` |

### Size Scale

| Element | Size | Line Spacing | Case |
|---------|------|--------------|------|
| Title | 65pt (4rem) | 0.8 | ALL CAPS |
| Subtitle | 30pt (1.875rem) | 0.8 | Sentence case |
| Body Title | 15pt (0.9375rem) | 0.9 | Sentence case |
| Body Copy | 10pt (0.625rem) | 1.0 | Sentence case |
| Body Small | 7pt (0.4375rem) | 1.0 | Sentence case |
| Large Numeral | 115pt (7.2rem) | 0.8 | — |

### Typography Rules

- Titles: ALL CAPS, Helvetica Bold or Times New Roman
- Body: Sentence case; **italicize** for call-outs on light backgrounds, **bold** for call-outs on dark
- Never use bold in body copy on light backgrounds — use italics instead
- Minimum readable size: 7pt (only when space-constrained)
- Numerals always use Inter font (Medium or Semi-Bold weight)

### CSS Font Stack

```css
.jl-title {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.8;
}

.jl-subtitle {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 400;
  line-height: 0.8;
}

.jl-body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 400;
  line-height: 1.0;
}

.jl-body-alt {
  font-family: 'Times New Roman', Times, Georgia, serif;
  font-weight: 400;
}

.jl-numeral {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  line-height: 0.8;
}
```

## Logo Usage

### Variants Available

| Variant | Use When |
|---------|----------|
| **Stacked Logo** | Default — most contexts |
| **Horizontal Logo** | Wide/narrow spaces (headers, footers) |
| **Monogram** | Small spaces (favicons, avatars) |
| **Partner Logo** | Co-branded contexts with client logos |

### Logo Rules

- Logo assets are vector-based — always scale, never rasterize
- Logo color can be changed (black on light, white on dark)
- Maintain clear space around the logo (minimum: logo height on all sides)

## Layout Patterns

### Page Types

| Type | Background | Use For |
|------|------------|---------|
| **Black Page** | `#111111` | Bold statements, hero sections |
| **White/Color Page** | `#F1F1F1` | Content-heavy sections, data |
| **Blank Page** | Flexible | Cover pages, thank-you slides, dense copy |

### Section Structure

- **Divider sections**: Bold, centered text on solid background
- **Content sections**: Left-aligned with clear hierarchy
- **Data sections**: Percentage callouts in large Inter numerals with supporting body text
- **Testimonial sections**: Quote text with attribution below

### Spacing

- Text boxes should have **zero padding and zero indentation**
- Let whitespace breathe — JL aesthetic is clean and minimal
- Section breaks use bold divider text, not horizontal rules

## Component Patterns

### Buttons

```tsx
// Primary action
<button className="bg-jl-black text-jl-white px-6 py-3 uppercase tracking-wide font-bold hover:bg-jl-sapphire transition-colors">
  Action
</button>

// Secondary action
<button className="border-2 border-jl-black text-jl-black px-6 py-3 uppercase tracking-wide font-bold hover:bg-jl-black hover:text-jl-white transition-colors">
  Action
</button>
```

### Cards

```tsx
<div className="bg-jl-white border border-jl-black/10 p-6">
  <h3 className="font-bold uppercase tracking-wide text-jl-black">Title</h3>
  <p className="text-jl-black/80 mt-2">Body content here.</p>
</div>
```

### Status Indicators

| State | Color | Example |
|-------|-------|---------|
| Success | JL Emerald `#079176` | Completed, active, verified |
| Warning | JL Gold `#F6C627` | Pending, attention needed |
| Error | JL Ruby `#FF4133` | Failed, critical, blocked |
| Info | JL Sapphire `#166AD8` | Links, navigation, neutral info |

### Data Display

```tsx
// Large statistic callout (JL numeral style)
<div className="text-center">
  <span className="font-['Inter'] font-medium text-7xl leading-none text-jl-black">
    60%
  </span>
  <p className="text-sm text-jl-black/60 mt-2 uppercase tracking-wide">
    Source attribution here
  </p>
</div>
```

## Brand Voice in UI

### Copy Guidelines

- **Bold and direct** — short, punchy headlines in ALL CAPS
- **Confident without ego** — "We know our place in the world. We believe humbleness is a virtue."
- **Human-centered language** — Reference people, participation, and culture
- Use arrows and directional cues to guide the eye

### Key Phrases to Reference

- "The Consumer Is The Medium"
- "We Instigate Consumer Participation On Behalf Of Brands"
- "Participation Worthy"
- "Humans are the most influential vehicles for ideas to spread"

## JL Identity Summary

- **Founded:** 2007, NYC
- **Address:** 115 Broadway, 20th Floor, New York, NY 10006
- **Phone:** (212) 462-8120
- **Philosophy:** Independent creative agency, consumer-as-medium, participation-driven
- **Theme:** JLNY*24

## Checklist

When creating or reviewing UI/frontend work, verify:

- [ ] Colors use JL palette (hero colors dominant, one accent at a time)
- [ ] Titles are uppercase Helvetica Bold or Times New Roman
- [ ] Body text is Helvetica Neue, sentence case
- [ ] Numerals use Inter font
- [ ] Layout is clean with minimal padding
- [ ] No more than one accent color per section
- [ ] Graphics on colored backgrounds use JL Black
- [ ] Status indicators use correct color mapping

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Created: 2026-02-06
