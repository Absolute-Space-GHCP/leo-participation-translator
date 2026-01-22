# Claude Code Setup Scripts

Version: 1.1.0  
Last Updated: 2026-01-22  
Purpose: Automated setup of Claude Code, Cursor hooks, and AI plugins

---

## Overview

These scripts automate the installation and configuration of:
- Claude Code (Claude CLI)
- Cursor hooks for claude-mem integration
- Global CLAUDE.md standards
- Code-simplifier plugin
- Directory structure for plugins and rules

## Scripts

### `claude-code-setup.ps1`

**Windows 11/PowerShell** version of the setup script.

```powershell
# Navigate to setup directory
cd $HOME\Projects\jl-dev-environment-gm\scripts\setup

# Run the script
.\claude-code-setup.ps1

# Or with options
.\claude-code-setup.ps1 -DryRun      # Preview without changes
.\claude-code-setup.ps1 -SkipTokens  # Skip token configuration
.\claude-code-setup.ps1 -Help        # Show help
```

### `claude-code-setup.sh`

**macOS/Linux** version of the setup script (Bash).

```bash
# Navigate to setup directory
cd ~/Projects/jl-dev-environment-gm/scripts/setup

# Run the script
./claude-code-setup.sh

# Or with options
./claude-code-setup.sh --dry-run      # Preview without changes
./claude-code-setup.sh --skip-tokens  # Skip token configuration
./claude-code-setup.sh --help         # Show help
```

---

## What Gets Installed

### Cursor Configuration

| Item | Location | Purpose |
|------|----------|---------|
| `hooks.json` | `~/.cursor/hooks.json` | Claude-mem integration hooks |
| `CLAUDE.md` | `~/.cursor/CLAUDE.md` | Global coding standards and session protocols |
| `rules/` | `~/.cursor/rules/` | Project rule templates |
| `plugins/` | `~/.cursor/plugins/` | Plugin agents directory |
| `code-simplifier` | `~/.cursor/plugins/code-simplifier/` | Code quality plugin |

### Claude CLI Plugins (via Windows script)

| Plugin | Purpose |
|--------|---------|
| `claude-mem` | Conversation history and memory persistence |
| `typescript-lsp` | TypeScript IntelliSense and language features |
| `pyright-lsp` | Python IntelliSense and type checking |
| `github` | GitHub API integration (issues, PRs, repos) |
| `slack` | Slack workspace access and notifications |

---

## Prerequisites

### All Platforms
- Node.js 18+ (LTS recommended)
- npm 8+
- Git

### Windows 11
- PowerShell 5.1+ (comes with Windows)
- Run as Administrator (if npm global install fails)

### macOS
- Homebrew (recommended)
- Xcode Command Line Tools

---

## Authentication Setup

### GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens/new
2. Create token with these scopes:
   - `repo` - Full control of private repositories
   - `read:org` - Read organization membership
   - `user` - Read user profile data  
   - `project` - Full control of projects
3. Copy the token (you won't see it again!)
4. Run the setup script and paste when prompted

The token is stored securely in your shell profile:
- **Windows:** `$PROFILE` (PowerShell profile)
- **macOS/Linux:** `~/.zshrc` or `~/.bashrc`

### Slack OAuth (Optional)

For Slack integration, you'll need:
- `SLACK_BOT_TOKEN` (xoxb-...)
- `SLACK_SIGNING_SECRET`

Contact your Slack workspace admin or create a Slack app at:
https://api.slack.com/apps

---

## Multi-Device Setup

| Device | OS | Script Command |
|--------|----|----|
| Mac #1 | macOS | `./claude-code-setup.sh` |
| Mac #2 | macOS | `./claude-code-setup.sh` |
| Mac #3 | macOS | `./claude-code-setup.sh` |
| Windows Desktop | Windows 11 | `.\claude-code-setup.ps1` |

Each device needs its own GitHub token configured.

---

## Verification

After running the setup script:

```bash
# Check Claude CLI
claude --version

# List installed plugins
claude mcp list

# Check specific plugin status
claude mcp status github
claude mcp status claude-mem

# Test in a project
cd your-project
claude
```

---

## Troubleshooting

### "claude" command not found

**Windows:**
```powershell
# Restart terminal, or:
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

**macOS/Linux:**
```bash
# Restart terminal, or:
source ~/.zshrc  # or ~/.bashrc
```

### Plugin installation fails

```bash
# Try with force flag
claude mcp install <plugin> --force

# Or reinstall Claude CLI
npm uninstall -g @anthropic-ai/claude-code
npm install -g @anthropic-ai/claude-code
```

### GitHub token not working

1. Verify token has correct scopes
2. Check token hasn't expired
3. Regenerate token if needed
4. Re-run: `.\claude-code-setup.ps1` (Windows) or `./claude-code-setup.sh` (macOS)

### Permission denied (Windows)

Run PowerShell as Administrator:
```powershell
Start-Process powershell -Verb runAs
```

### Permission denied (macOS/Linux)

```bash
chmod +x ./claude-code-setup.sh
./claude-code-setup.sh
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-01-22 | Added Cursor hooks, global CLAUDE.md, code-simplifier |
| 1.0.0 | 2026-01-09 | Initial release with Windows and macOS support |

---

## See Also

- [QUICKSTART.md](../../QUICKSTART.md) - Full environment setup guide
- [docs/AUTH.md](../../docs/AUTH.md) - Authentication reference
- [docs/BUILD.md](../../docs/BUILD.md) - Build configuration details

---

Maintained by: Johannes Leonardo Dev Team
