# Quick Start Guide - New Developer Setup

Version: 1.4.0
Last Updated: 2026-01-22
Purpose: Complete zero-to-hero guide for setting up the JL Dev Environment
Time Required: ~45 minutes

---

## Important: Global Standards

After setup, all AI coding sessions should follow the global standards in:

```
~/.cursor/CLAUDE.md
```

This file contains:
- Session startup checklist
- User authorization policy (pre-approved auth flows)
- Session backup and wrap-up protocols
- Coding standards and best practices
- AI development tooling documentation

**Read this file at the start of every coding session.**

---

## Before You Begin

### Requirements

#### macOS
| Requirement | Minimum | How to Check |
|-------------|---------|--------------|
| macOS | 14.0+ (Sonoma) | `sw_vers` |
| Apple Silicon | M1/M2/M3 | `uname -m` (should show `arm64`) |
| Admin access | Required | Can you run `sudo`? |
| Disk space | 20GB free | Check in System Settings |
| Internet | Required | For downloads |

#### Windows 11
| Requirement | Minimum | How to Check |
|-------------|---------|--------------|
| Windows | 11 Pro/Enterprise | `winver` |
| PowerShell | 5.1+ | `$PSVersionTable.PSVersion` |
| Admin access | Recommended | Run PowerShell as Admin |
| Disk space | 20GB free | Check in Settings > Storage |
| Internet | Required | For downloads |

### Accounts You'll Need

Request access to these before starting:

| Service | How to Get Access |
|---------|-------------------|
| GitHub | Ask team lead for invite to `Absolute-Space-GHCP` org |
| Google Cloud | Request access to `jlai-gm-v3` project |
| Slack | Join Johannes Leonardo workspace |
| Cursor | Sign up at cursor.sh (Pro plan recommended) |

> **📋 Repository Access Note:**  
> New developers start with **Read-only access** to the `Absolute-Space-GHCP` staging organization. This is where you'll clone verified builds from. Once onboarded and ready, you may be granted access to the `JohannesLeonardo-AI-JLIT` production organization. Do not request PROD access until cleared by your team lead.

---

## Step 1: Install Prerequisites (Manual)

These must be installed before running the bootstrap script.

### 1.1 Cursor IDE

Download and install from: https://cursor.sh

Or via Homebrew (if you already have it):
```bash
brew install --cask cursor
```

### 1.2 Docker Desktop

Download from: https://www.docker.com/products/docker-desktop/

Or via Homebrew:
```bash
brew install --cask docker
```

After install, launch Docker Desktop once to complete setup.

### 1.3 Google Cloud CLI

```bash
# Install via Homebrew
brew install --cask google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

### 1.4 GitHub CLI

```bash
brew install gh
```

---

## Step 2: Clone the Repository

```bash
# Navigate to your projects folder
cd ~/Projects

# Clone the dev environment repo
git clone https://github.com/Absolute-Space-GHCP/jl-dev-environment-gm.git

# Enter the directory
cd jl-dev-environment-gm
```

---

## Step 3: Run Bootstrap Script

The bootstrap script installs: Homebrew, nvm, Node.js, SDKMAN, Java, and Cursor extensions.

```bash
./scripts/bootstrap.sh
```

Follow the prompts. The script will:
1. Check for Apple Silicon
2. Install Xcode Command Line Tools (if needed)
3. Install Homebrew
4. Install nvm + Node.js LTS
5. Install SDKMAN + Java 21
6. Install essential Cursor extensions
7. Set up Continue AI config

**After bootstrap completes, restart your terminal:**
```bash
source ~/.zshrc
```

---

## Step 4: Install All Cursor Extensions

The bootstrap installs core extensions. Install the full set of 27:

```bash
# Install all extensions from the list
cat config/cursor/extensions.txt | grep -v '^#' | grep -v '^$' | xargs -L1 cursor --install-extension
```

Or install them via Cursor UI:
1. Open Cursor
2. Press `Cmd+Shift+X` (Extensions)
3. Search and install each from `config/cursor/extensions.txt`

---

## Step 5: Authenticate Services

### 5.1 GitHub Authentication

```bash
gh auth login
```

Select:
- GitHub.com
- HTTPS
- Yes (authenticate with browser)
- Login with web browser

Verify:
```bash
gh auth status
```

### 5.2 Google Cloud Authentication

```bash
# User authentication
gcloud auth login
# Opens browser - sign in with your @johannesleonardo.com account

# Set default project
gcloud config set project jlai-gm-v3

# Application Default Credentials (for API access)
gcloud auth application-default login --project=jlai-gm-v3
```

Verify:
```bash
gcloud auth list
gcloud config get-value project
```

---

## Step 6: Configure Continue (Gemini AI)

Edit the Continue config with your project ID:

```bash
# Open the config file
open ~/.continue/config.json
```

Find and replace `YOUR_PROJECT_ID` with `jlai-gm-v3`.

---

## Step 7: Clone the AI Agents Repository

```bash
cd ~/Projects
git clone https://github.com/Absolute-Space-GHCP/ai-agents-gmaster-build.git
```

---

## Step 8: Set Up Multi-Root Workspace

Create a workspace file that includes both projects:

```bash
# Create workspace file
cat > ~/Projects/absolute-space-ghcp.code-workspace << 'EOF'
{
  "folders": [
    {
      "name": "jl-dev-environment-gm",
      "path": "jl-dev-environment-gm"
    },
    {
      "name": "ai-agents-gmaster-build",
      "path": "ai-agents-gmaster-build"
    }
  ],
  "settings": {
    "window.title": "Absolute-Space-GHCP | ${activeEditorShort}${separator}${rootName}",
    "workbench.colorCustomizations": {
      "titleBar.activeBackground": "#1a1a2e",
      "titleBar.activeForeground": "#ffffff"
    },
    "continue.enableTabAutocomplete": true,
    "editor.formatOnSave": true,
    "files.autoSave": "afterDelay"
  },
  "extensions": {
    "recommendations": [
      "Continue.continue",
      "anthropic.claude-code",
      "eamodio.gitlens",
      "ms-python.python",
      "dbaeumer.vscode-eslint",
      "humao.rest-client"
    ]
  }
}
EOF

# Open the workspace
open ~/Projects/absolute-space-ghcp.code-workspace
```

---

## Step 9: Validate Your Setup

Run the validation script to check everything:

```bash
cd ~/Projects/jl-dev-environment-gm
./scripts/validate.sh
```

**Expected result:** 18 passed, 0 failed

### Troubleshooting Failed Checks

| Failed Check | Solution |
|--------------|----------|
| Homebrew | Run: `eval "$(/opt/homebrew/bin/brew shellenv)"` |
| Node.js | Run: `source ~/.nvm/nvm.sh && nvm install --lts` |
| Java | Run: `source ~/.sdkman/bin/sdkman-init.sh` |
| Docker | Launch Docker Desktop app |
| gcloud | Re-run: `gcloud auth login` |
| GCP ADC | Re-run: `gcloud auth application-default login` |
| Continue config | Check `~/.continue/config.json` exists |

---

## Step 10: Local Monitoring Dashboard

The dashboard provides real-time monitoring of your dev environment health.

### Start the Dashboard

```bash
# One-click launch
./scripts/utils/dashboard.sh
```

This will:
1. Install dependencies (first run only)
2. Start server on port 3333
3. Open dashboard in your browser

### Dashboard Features

| Section | What It Checks |
|---------|----------------|
| **Runtimes** | Node.js, npm, Java, Python versions |
| **DevOps** | Docker, gcloud, gh, kubectl status |
| **Authentication** | GitHub auth, GCP auth, ADC status |
| **AI Tools** | Cursor, Continue, Claude CLI |

**Dashboard URL:** http://localhost:3333

**API Endpoint:** `curl http://localhost:3333/api/status | jq`

---

## Step 11: Claude Code and Cursor Hooks

Install Claude Code CLI, Cursor hooks, and AI development plugins.

### macOS/Linux

```bash
cd ~/Projects/jl-dev-environment-gm/scripts/setup
./claude-code-setup.sh
```

### Windows 11

```powershell
cd $HOME\Projects\jl-dev-environment-gm\scripts\setup
.\claude-code-setup.ps1
```

The script will:
1. Install Claude CLI (if not present)
2. Create `~/.cursor/hooks.json` for claude-mem integration
3. Set up `~/.cursor/rules/` and `~/.cursor/plugins/` directories
4. Install global `~/.cursor/CLAUDE.md` standards
5. Configure code-simplifier plugin
6. Optionally configure GitHub token

> **💡 Tip:** Have your GitHub token ready! Create one at: https://github.com/settings/tokens/new  
> Required scopes: `repo`, `read:org`, `user`, `project`

After setup, restart Cursor and verify:
```bash
claude --version
ls ~/.cursor/hooks.json
```

---

## Step 12: Claude-Mem Worker (Persistent Memory)

Claude-mem provides persistent memory across coding sessions. The hooks were installed in Step 11; now start the worker.

### Install Claude-Mem

```bash
# Install using bun (recommended) or npm
cd ~/.claude/plugins/marketplaces
git clone https://github.com/thedotmack/claude-mem.git thedotmack
cd thedotmack
bun install  # or: npm install
```

### Start the Worker

```bash
# Start worker service
cd ~/.claude/plugins/marketplaces/thedotmack
bun run worker:start  # or: npm run worker:start
```

### Configure Gemini for Summarization

Create `~/.claude/plugins/marketplaces/thedotmack/settings.json`:

```json
{
  "CLAUDE_MEM_PROVIDER": "gemini",
  "CLAUDE_MEM_GEMINI_API_KEY": "YOUR_GEMINI_API_KEY",
  "CLAUDE_MEM_GEMINI_MODEL": "gemini-2.0-flash"
}
```

> **Get a Gemini API key:** https://aistudio.google.com/apikey

### Verify Installation

```bash
# Check worker is running
curl http://localhost:37777/api/readiness
# Expected: {"status":"ready","mcpReady":true}

# Check web viewer
open http://localhost:37777
```

### After Installation

**Restart Cursor** to load the hooks.

**Verify working:**
1. Open any project in Cursor
2. Start a new chat
3. Claude-mem should inject context automatically
4. Web viewer at http://localhost:37777 shows session history

---

## Step 13: Test AI Integration

### Test Gemini (via Continue)

1. Open Cursor with the workspace
2. Press `Cmd+L` (macOS) or `Ctrl+L` (Windows) to open Continue sidebar
3. Type: "Hello, what model are you?"
4. Should respond with Gemini model info

### Test Claude (via Claude Code)

1. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows)
2. Type: "Claude Code: Open"
3. Ask: "What files are in this project?"

### Test Claude-Mem

1. Start a new Cursor chat in any project
2. Check http://localhost:37777 for session tracking
3. Session context should auto-inject on prompts

---

## Step 14: Verify Global AI Standards

Copy the global CLAUDE.md that provides session protocols and coding standards for all AI sessions:

```bash
# The global CLAUDE.md should already exist at ~/.cursor/CLAUDE.md
# If not, copy from this repo:
cp config/cursor/CLAUDE.md ~/.cursor/CLAUDE.md

# Verify it exists
cat ~/.cursor/CLAUDE.md | head -20
```

This file contains:
- **User Authorization Policy** - Pre-approved auth flows
- **Session Protocols** - Backup, wrap-up, git safety
- **Coding Standards** - JS/Node.js, error handling, security
- **AI Development Tooling** - Claude-mem, Code-simplifier, Superpowers

---

## You're Done!

Your environment is now set up with:

- **IDE:** Cursor with 27 extensions
- **AI:** Gemini 3 Pro, Claude Opus 4.5
- **Runtimes:** Node.js 22 LTS, Java 21 LTS, Python 3.11+
- **DevOps:** Docker, gcloud, gh CLI
- **Projects:** jl-dev-environment-gm, ai-agents-gmaster-build
- **Global Standards:** `~/.cursor/CLAUDE.md` (session protocols, coding standards)

### Daily Workflow

1. **Start:** Read `~/.cursor/CLAUDE.md` for session protocols
2. **Backup:** Create session backup (per protocol)
3. **Work:** Open workspace: `open ~/Projects/absolute-space-ghcp.code-workspace`
4. **End:** Follow wrap-up protocol (commit, push, document)

### Getting Help

- **Global Standards:** `~/.cursor/CLAUDE.md`
- Build details: `docs/BUILD.md`
- Auth reference: `docs/AUTH.md`
- Roadmap: `TODO.md`
- Changelog: `CHANGELOG.md`

---

## Quick Reference Card

### macOS/Linux
```bash
# Open workspace
open ~/Projects/absolute-space-ghcp.code-workspace

# Start monitoring dashboard
./scripts/utils/dashboard.sh

# Validate setup
./scripts/validate.sh

# Setup Claude Code + Cursor hooks
./scripts/setup/claude-code-setup.sh

# Start claude-mem worker
cd ~/.claude/plugins/marketplaces/thedotmack && bun run worker:start

# Update extensions
cat config/cursor/extensions.txt | grep -v '^#' | xargs -L1 cursor --install-extension

# Refresh GCP auth
gcloud auth login && gcloud auth application-default login

# Check GitHub auth
gh auth status
```

### Windows 11
```powershell
# Open workspace
Start-Process "$HOME\Projects\absolute-space-ghcp.code-workspace"

# Setup Claude Code + Cursor hooks
.\scripts\setup\claude-code-setup.ps1

# Update extensions (from project root)
Get-Content config\cursor\extensions.txt | Where-Object {$_ -notmatch '^#' -and $_ -ne ''} | ForEach-Object { cursor --install-extension $_ }

# Refresh GCP auth
gcloud auth login; gcloud auth application-default login

# Check GitHub auth
gh auth status
```

---

Maintained by: Charley (@charleymm)
Last Updated: 2026-01-22

