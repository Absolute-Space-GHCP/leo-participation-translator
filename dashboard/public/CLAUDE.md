# Dashboard Public Assets - AI Context

This directory contains the frontend assets for the monitoring dashboard.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Dashboard UI layout |
| `app.js` | Frontend JavaScript (API calls, DOM updates) |
| `styles.css` | Dark theme styling with CSS variables |

## Styling

The dashboard uses a dark theme with CSS variables:

```css
:root {
  --bg-primary: #0d1117;
  --accent-blue: #58a6ff;
  /* ... */
}
```

## Frontend Architecture

- Vanilla JavaScript (no framework)
- Fetches from `/api/*` endpoints
- Auto-refreshes every 30 seconds
- Status indicators: 🟢 Green, 🟡 Yellow, 🔴 Red

---

*Parent: `dashboard/` - See `dashboard/README.md` for full documentation.*
