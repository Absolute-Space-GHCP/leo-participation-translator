# Installed Components Inventory

Version: 1.0.0
Last Updated: 2026-01-22
Purpose: Complete inventory of AI development tooling and configuration

---

## Quick Status Check

Run these commands to verify your installation:

```bash
# Check all components
echo "Rules:" && ls ~/.cursor/rules/
echo "Plugins:" && ls ~/.cursor/plugins/
echo "Hooks:" && ls ~/.cursor/hooks/
echo "MCP:" && cat ~/.cursor/mcp.json
echo "Claude-Mem:" && curl -s http://localhost:37777/api/readiness
```

---

## 1. Cursor IDE Extensions (27)

**Location:** Installed via Cursor IDE
**Config:** `config/cursor/extensions.txt`

| Category | Extensions |
|----------|------------|
| **AI Assistants** | Continue.continue, anthropic.claude-code |
| **Python** | ms-python.python, vscode-pylance, debugpy, black-formatter |
| **Java** | vscjava.vscode-java-pack |
| **JavaScript** | dbaeumer.vscode-eslint |
| **API Development** | humao.rest-client, Postman.postman-for-vscode |
| **Git** | eamodio.gitlens |
| **Productivity** | path-intellisense, code-spell-checker |
| **Config Files** | redhat.vscode-yaml |
| **DevOps** | vscode-docker, vscode-kubernetes-tools, vscode-containers |

**Install all:**
```bash
cat config/cursor/extensions.txt | grep -v '^#' | grep -v '^$' | xargs -L1 cursor --install-extension
```

---

## 2. Cursor Rules (6)

**Location:** `~/.cursor/rules/`
**Distributed via:** `config/cursor/rules/`

| Rule File | Purpose | Always Applied |
|-----------|---------|----------------|
| `auth-permissions.mdc` | Pre-authorized auth flows (GCP, GitHub, Firebase) | ✅ |
| `authorship-standards.mdc` | File attribution requirements (Author + Co-authored) | ✅ |
| `claude-mem-context.mdc` | Persistent memory context injection | ✅ |
| `git-safety-archive.mdc` | Pre-push archive protocol | ✅ |
| `mandatory-plugins.mdc` | Required plugin verification checklist | ✅ |
| `session-wrap-up.mdc` | End-of-session checklist | ✅ |

**Install:**
```bash
cp config/cursor/rules/*.mdc ~/.cursor/rules/
```

---

## 3. Cursor Plugins (1)

**Location:** `~/.cursor/plugins/`

| Plugin | Purpose | Status |
|--------|---------|--------|
| `code-simplifier` | Simplifies code while preserving functionality | ✅ Installed |

**Install:**
```bash
mkdir -p ~/.cursor/plugins/code-simplifier/agents
cp config/cursor/plugins/code-simplifier/agents/code-simplifier.md ~/.cursor/plugins/code-simplifier/agents/
```

---

## 4. Cursor Hooks (claude-mem integration)

**Location:** `~/.cursor/hooks/`
**Config:** `~/.cursor/hooks.json`

| Hook Event | Script | Purpose |
|------------|--------|---------|
| beforeSubmitPrompt | session-init.sh | Initialize session |
| beforeSubmitPrompt | context-inject.sh | Inject past context |
| afterMCPExecution | save-observation.sh | Capture MCP results |
| afterShellExecution | save-observation.sh | Capture shell output |
| afterFileEdit | save-file-edit.sh | Track file changes |
| stop | session-summary.sh | Generate session summary |

**Verify:**
```bash
cat ~/.cursor/hooks.json
ls ~/.cursor/hooks/
```

---

## 5. MCP Servers (1)

**Location:** `~/.cursor/mcp.json`

| Server | Package | Purpose |
|--------|---------|---------|
| sequential-thinking | `@modelcontextprotocol/server-sequential-thinking` | Step-by-step reasoning with revision/branching |

**Current Config:**
```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

**Features:**
- Breaks down complex problems into manageable steps
- Revises and refines thoughts as understanding deepens
- Branches into alternative reasoning paths
- Dynamically adjusts total number of thoughts needed

**Trigger:** Automatically activates for complex reasoning, or prompt with "think step by step"

---

## 6. Claude-Mem (Persistent Memory)

**Location:** `~/.claude/plugins/marketplaces/thedotmack/`
**Status:** ✅ Running

| Component | Status |
|-----------|--------|
| Worker | Running on port 37777 |
| Web Viewer | http://localhost:37777 |
| Cursor Hooks | Configured |

**Commands:**
```bash
# Check status
curl http://localhost:37777/api/readiness

# Start worker
cd ~/.claude/plugins/marketplaces/thedotmack && bun run worker:start

# View web interface
open http://localhost:37777
```

---

## 7. Claude Code CLI Plugins

**Location:** `~/.claude/plugins/marketplaces/`

### Installed Marketplaces

| Marketplace | Purpose | Status |
|-------------|---------|--------|
| `thedotmack` | Claude-mem persistent memory | ✅ Active |
| `superpowers-marketplace` | TDD, debugging, collaboration | ⚠️ Needs activation |
| `claude-plugins-official` | Anthropic official plugins | ✅ Installed |
| `claude-code-plugins` | Additional community plugins | ✅ Installed |

### Superpowers Plugin - Manual Activation Required

The Superpowers marketplace is installed, but the plugin needs CLI activation:

```bash
# In Claude Code CLI terminal, run:
/plugin install superpowers@superpowers-marketplace
```

**Available after activation:**
| Command | Purpose |
|---------|---------|
| `/superpowers:brainstorm` | Structured brainstorming sessions |
| `/superpowers:write-plan` | Create detailed implementation plans |
| `/superpowers:execute-plan` | Execute plans with checkpoints |
| `/superpowers:tdd` | Test-Driven Development workflow |
| `/superpowers:debug` | Systematic 4-phase debugging |

---

## 8. Global Standards

**Location:** `~/.cursor/CLAUDE.md`

Contains:
- User Authorization Policy (pre-approved auth flows)
- Session Startup Checklist
- AI Session Guidelines (Incremental Development, Debug Before Rollback)
- Session Protocols (Backup, Wrap-Up, Pre-Push Archive)
- Coding Standards (JS/Node.js, Error Handling, Security)
- AI Development Tooling documentation

---

## 9. CLI Tools

| Tool | Command | Purpose |
|------|---------|---------|
| Gemini CLI | `gemini` | Terminal AI assistant |
| Claude Code CLI | `claude` | AI coding assistant |
| gcloud | `gcloud` | Google Cloud Platform |
| GitHub CLI | `gh` | GitHub operations |

**Verify:**
```bash
gemini --version
claude --version
gcloud --version
gh --version
```

---

## Installation Summary

| Category | Count | Status |
|----------|-------|--------|
| Cursor Extensions | 27 | ✅ |
| Cursor Rules | 6 | ✅ |
| Cursor Plugins | 1 | ✅ |
| Cursor Hooks | 6 scripts | ✅ |
| MCP Servers | 1 | ✅ |
| Claude-Mem | 1 | ✅ Running |
| CLI Tools | 4 | ✅ |
| **Superpowers** | - | ⚠️ Needs CLI activation |

---

## Troubleshooting

### Claude-Mem Not Running

```bash
cd ~/.claude/plugins/marketplaces/thedotmack
bun run worker:start
```

### MCP Server Not Working

Restart Cursor after creating/editing `~/.cursor/mcp.json`

### Superpowers Commands Not Available

Run in Claude Code CLI:
```bash
/plugin install superpowers@superpowers-marketplace
```

### Hooks Not Firing

1. Verify `~/.cursor/hooks.json` exists
2. Check hook scripts are executable: `chmod +x ~/.cursor/hooks/*.sh`
3. Restart Cursor

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-01-22
