# Scripts - AI Context

This directory contains automation scripts for the JL Dev Environment.

## Script Categories

### Root Scripts

| Script | Purpose |
|--------|---------|
| `bootstrap.sh` | One-command environment setup (Homebrew, nvm, SDKMAN, etc.) |
| `validate.sh` | Verify all tools installed (18 checks) |

### Setup Scripts (`setup/`)

| Script | Purpose |
|--------|---------|
| `claude-code-setup.sh` | macOS: Install Claude CLI, Cursor hooks, plugins |
| `claude-code-setup.ps1` | Windows: Install Claude CLI, Cursor hooks, plugins |

### Utility Scripts (`utils/`)

| Script | Purpose |
|--------|---------|
| `dashboard.sh` | Launch monitoring dashboard |
| `docker-start.sh` | Start Docker services |
| `archive-session.sh` | Archive AI chat sessions |
| `slack-notify.sh` | Send Slack notifications |
| `verify-links.sh` | Test Quick Links connectivity |
| `end-session.ps1` | Windows session cleanup |

## Script Standards

- Include version header comment
- Use `set -e` for bash scripts
- Provide `--help` option where applicable
- Log with emoji prefixes (✅, ❌, ⚠️)

## Running Scripts

```bash
# From repo root
./scripts/bootstrap.sh
./scripts/validate.sh
./scripts/utils/dashboard.sh
```

---

*Global standards: `~/.cursor/CLAUDE.md`*
