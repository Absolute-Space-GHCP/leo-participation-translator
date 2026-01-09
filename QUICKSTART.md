# Quick Start Guide - New Developer Setup

Version: 1.1.0
Last Updated: 2026-01-09
Purpose: Complete zero-to-hero guide for setting up the JL Dev Environment
Time Required: ~45 minutes

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
git clone https://github.com/Absolute-Space-GHCP/jl-dev-environment-gm-v1.0.git

# Enter the directory
cd jl-dev-environment-gm-v1.0
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
      "name": "jl-dev-environment-gm-v1.0",
      "path": "jl-dev-environment-gm-v1.0"
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
cd ~/Projects/jl-dev-environment-gm-v1.0
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

## Step 10: Claude Code Plugins

Install Claude Code CLI and plugins for enhanced development experience.

### macOS/Linux

```bash
cd ~/Projects/jl-dev-environment-gm-v1.0/scripts/setup
./claude-code-setup.sh
```

### Windows 11

```powershell
cd $HOME\Projects\jl-dev-environment-gm-v1.0\scripts\setup
.\claude-code-setup.ps1
```

The script will:
1. ✅ Install Claude CLI (if not present)
2. ✅ Add plugin marketplaces
3. ✅ Install core plugins (LSPs, memory)
4. ✅ Install external plugins (GitHub, Slack)
5. ✅ Configure your GitHub Personal Access Token

> **💡 Tip:** Have your GitHub token ready! Create one at: https://github.com/settings/tokens/new  
> Required scopes: `repo`, `read:org`, `user`, `project`

After setup, restart your terminal and verify:
```bash
claude --version
claude mcp list
```

---

## Step 11: Test AI Integration

### Test Gemini (via Continue)

1. Open Cursor with the workspace
2. Press `Cmd+L` (macOS) or `Ctrl+L` (Windows) to open Continue sidebar
3. Type: "Hello, what model are you?"
4. Should respond with Gemini model info

### Test Claude (via Claude Code)

1. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows)
2. Type: "Claude Code: Open"
3. Ask: "What files are in this project?"

---

## You're Done!

Your environment is now set up with:

- **IDE:** Cursor with 27 extensions
- **AI:** Gemini 3 Pro, Claude Opus 4.5
- **Runtimes:** Node.js 22 LTS, Java 21 LTS, Python 3.11+
- **DevOps:** Docker, gcloud, gh CLI
- **Projects:** jl-dev-environment-gm-v1.0, ai-agents-gmaster-build

### Daily Workflow

1. Open the workspace: `open ~/Projects/absolute-space-ghcp.code-workspace`
2. Or double-click `Absolute-Space-Workspace` on Desktop (if shortcut created)

### Getting Help

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

# Validate setup
./scripts/validate.sh

# Setup Claude Code plugins
./scripts/setup/claude-code-setup.sh

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

# Setup Claude Code plugins
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

