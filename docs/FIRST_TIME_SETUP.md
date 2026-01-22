# First-Time Setup Guide

Version: 1.0.0
Last Updated: 2026-01-22
Audience: New developers with minimal setup experience

---

## Overview

This guide walks you through setting up your AI-powered development environment in **7 simple steps**. Total time: ~30-45 minutes.

**What you'll get:**
- Cursor IDE with AI coding assistant
- Gemini and Claude AI integrations
- All required tools pre-configured

---

## Before You Start

**Requirements:**
- macOS 14+ (Sonoma) on Apple Silicon (M1/M2/M3)
- Admin access (can run `sudo` commands)
- 20GB free disk space
- Internet connection

**Accounts needed:**
- GitHub account (request access to `Absolute-Space-GHCP` org)
- Google account (@johannesleonardo.com)

---

## Step 1: Install Cursor IDE

1. Go to https://cursor.sh
2. Download the macOS version
3. Drag to Applications folder
4. Open Cursor and sign in

---

## Step 2: Open Terminal and Run Bootstrap

Open **Terminal** app and paste these commands one at a time:

```bash
# Navigate to Projects folder (creates it if needed)
mkdir -p ~/Projects && cd ~/Projects

# Clone the dev environment repo
git clone https://github.com/Absolute-Space-GHCP/jl-dev-environment-gm.git

# Enter the directory
cd jl-dev-environment-gm

# Run the bootstrap script
./scripts/bootstrap.sh
```

**Follow the prompts.** This installs:
- Homebrew (package manager)
- Node.js (JavaScript runtime)
- Java (for some tools)
- Essential Cursor extensions

When done, restart Terminal:
```bash
source ~/.zshrc
```

---

## Step 3: Install AI Tools

```bash
# Install Gemini CLI
npm install -g @google/gemini-cli

# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Verify installations
gemini --version
claude --version
```

---

## Step 4: Authenticate

### GitHub

```bash
gh auth login
```

Select: **GitHub.com** → **HTTPS** → **Yes** → **Login with web browser**

A browser window opens - sign in with your GitHub account.

### Google Cloud

```bash
gcloud auth login
```

A browser window opens - sign in with your @johannesleonardo.com account.

Then run:
```bash
gcloud config set project jlai-gm-v3
gcloud auth application-default login --project=jlai-gm-v3
```

---

## Step 5: Setup Claude Code + Cursor Hooks

```bash
cd ~/Projects/jl-dev-environment-gm/scripts/setup
./claude-code-setup.sh
```

This installs:
- Cursor hooks for AI memory
- Global coding standards
- AI plugins

**Restart Cursor after this step.**

---

## Step 6: Start Claude-Mem Worker

Claude-mem gives AI persistent memory across sessions.

```bash
# Install claude-mem
mkdir -p ~/.claude/plugins/marketplaces
cd ~/.claude/plugins/marketplaces
git clone https://github.com/thedotmack/claude-mem.git thedotmack
cd thedotmack
npm install

# Start the worker
npm run worker:start
```

Verify it's running:
```bash
curl http://localhost:37777/api/readiness
```

Should return: `{"status":"ready","mcpReady":true}`

---

## Step 7: Verify Everything Works

```bash
cd ~/Projects/jl-dev-environment-gm
./scripts/validate.sh
```

**Expected result:** 18 passed, 0 failed

---

## You're Ready!

### Daily Workflow

1. **Start your day:** Open Cursor
2. **Open workspace:**
   ```bash
   open ~/Projects/jl-dev-environment-gm
   ```
3. **Start claude-mem** (if not running):
   ```bash
   cd ~/.claude/plugins/marketplaces/thedotmack && npm run worker:start
   ```

### Quick Commands

| Task | Command |
|------|---------|
| Open Cursor chat | `Cmd+L` |
| Validate setup | `./scripts/validate.sh` |
| Check GitHub auth | `gh auth status` |
| Check GCP auth | `gcloud auth list` |

### Getting Help

- **Full documentation:** See `QUICKSTART.md` for detailed steps
- **Troubleshooting:** See `docs/BUILD.md`
- **Standards:** Read `~/.cursor/CLAUDE.md`

---

## Optional: Claude Chrome Extension

For browser-based AI assistance:

1. Open Chrome
2. Go to Chrome Web Store
3. Search "Claude" by Anthropic
4. Click "Add to Chrome"
5. Sign in with Anthropic account

> Note: Full features require Claude Max subscription ($100-200/month)

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-01-22
