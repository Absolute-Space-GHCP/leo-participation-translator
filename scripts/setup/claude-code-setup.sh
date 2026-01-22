#!/bin/bash
# ============================================================================
# Claude Code Plugin Setup Script for macOS
# ============================================================================
# Version:     1.0.0
# Updated:     2026-01-22
# Purpose:     Automate Claude Code and Cursor hooks installation
# Usage:       ./scripts/setup/claude-code-setup.sh [--dry-run] [--skip-tokens]
# ============================================================================

set -e

VERSION="1.1.0"
DRY_RUN=false
SKIP_TOKENS=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run) DRY_RUN=true; shift ;;
        --skip-tokens) SKIP_TOKENS=true; shift ;;
        --help|-h)
            echo "Claude Code Setup Script v$VERSION"
            echo ""
            echo "USAGE:"
            echo "    ./claude-code-setup.sh [OPTIONS]"
            echo ""
            echo "OPTIONS:"
            echo "    --dry-run       Show what would be done without making changes"
            echo "    --skip-tokens   Skip GitHub token configuration"
            echo "    --help          Show this help message"
            echo ""
            echo "INSTALLS:"
            echo "    - Claude CLI (if not present)"
            echo "    - Cursor hooks for claude-mem"
            echo "    - Global CLAUDE.md standards"
            echo "    - Cursor rules and plugins structure"
            exit 0
            ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${YELLOW}[$1]${NC} $2"
}

print_ok() {
    echo -e "  ${GREEN}[OK]${NC} $1"
}

print_warn() {
    echo -e "  ${YELLOW}[!]${NC} $1"
}

print_err() {
    echo -e "  ${RED}[X]${NC} $1"
}

print_note() {
    echo -e "  ${CYAN}-->${NC} $1"
}

# ============================================================================
# Main Script
# ============================================================================

print_header "Claude Code Setup Script v$VERSION"

if $DRY_RUN; then
    echo -e "${YELLOW}DRY RUN MODE - No changes will be made${NC}"
    echo ""
fi

# Step 1: Check Node.js/npm
print_step 1 "Checking Node.js and npm..."

if command -v node &> /dev/null; then
    NODE_VER=$(node -v)
    print_ok "Node.js found: $NODE_VER"
else
    print_err "Node.js not found. Please run bootstrap.sh first."
    exit 1
fi

if command -v npm &> /dev/null; then
    NPM_VER=$(npm -v)
    print_ok "npm found: $NPM_VER"
else
    print_err "npm not found. Please run bootstrap.sh first."
    exit 1
fi

# Step 2: Check/Install Claude CLI
echo ""
print_step 2 "Checking Claude CLI..."

if command -v claude &> /dev/null; then
    CLAUDE_VER=$(claude --version 2>&1 || echo "unknown")
    print_ok "Claude CLI found: $CLAUDE_VER"
else
    print_warn "Claude CLI not found"
    print_note "Installing Claude CLI..."
    if ! $DRY_RUN; then
        npm install -g @anthropic-ai/claude-code
        print_ok "Claude CLI installed"
    else
        print_note "[DRY RUN] Would run: npm install -g @anthropic-ai/claude-code"
    fi
fi

# Step 3: Setup Cursor directory structure
echo ""
print_step 3 "Setting up Cursor directory structure..."

CURSOR_DIR="$HOME/.cursor"
CURSOR_RULES="$CURSOR_DIR/rules"
CURSOR_PLUGINS="$CURSOR_DIR/plugins"
CURSOR_HOOKS="$CURSOR_DIR/hooks"

for dir in "$CURSOR_DIR" "$CURSOR_RULES" "$CURSOR_PLUGINS" "$CURSOR_HOOKS"; do
    if [ ! -d "$dir" ]; then
        if ! $DRY_RUN; then
            mkdir -p "$dir"
            print_ok "Created $dir"
        else
            print_note "[DRY RUN] Would create: $dir"
        fi
    else
        print_ok "Exists: $dir"
    fi
done

# Step 4: Install Cursor hooks.json
echo ""
print_step 4 "Configuring Cursor hooks..."

HOOKS_JSON="$CURSOR_DIR/hooks.json"
if [ ! -f "$HOOKS_JSON" ]; then
    if ! $DRY_RUN; then
        cat > "$HOOKS_JSON" << 'HOOKSJSONEOF'
{
  "version": 1,
  "hooks": {
    "beforeSubmitPrompt": [
      {
        "command": "~/.cursor/hooks/session-init.sh"
      },
      {
        "command": "~/.cursor/hooks/context-inject.sh"
      }
    ],
    "afterMCPExecution": [
      {
        "command": "~/.cursor/hooks/save-observation.sh"
      }
    ],
    "afterShellExecution": [
      {
        "command": "~/.cursor/hooks/save-observation.sh"
      }
    ],
    "afterFileEdit": [
      {
        "command": "~/.cursor/hooks/save-file-edit.sh"
      }
    ],
    "stop": [
      {
        "command": "~/.cursor/hooks/session-summary.sh"
      }
    ]
  }
}
HOOKSJSONEOF
        print_ok "Created hooks.json"
    else
        print_note "[DRY RUN] Would create: $HOOKS_JSON"
    fi
else
    print_ok "hooks.json already exists"
fi

# Step 5: Copy hook scripts if claude-mem is installed
echo ""
print_step 5 "Checking claude-mem hook scripts..."

CLAUDE_MEM_DIR="$HOME/.claude/plugins/marketplaces/thedotmack"
if [ -d "$CLAUDE_MEM_DIR" ]; then
    print_ok "claude-mem found at $CLAUDE_MEM_DIR"
    
    # Check if hook scripts exist
    if [ -f "$CURSOR_HOOKS/session-init.sh" ]; then
        print_ok "Hook scripts already installed"
    else
        print_warn "Hook scripts not found in ~/.cursor/hooks/"
        print_note "Copy from claude-mem installation or run claude-mem setup"
    fi
else
    print_warn "claude-mem not found"
    print_note "Install claude-mem for persistent memory features:"
    print_note "  cd ~/.claude/plugins/marketplaces"
    print_note "  git clone https://github.com/thedotmack/claude-mem.git thedotmack"
    print_note "  cd thedotmack && bun install && bun run worker:start"
fi

# Step 6: Install Global CLAUDE.md
echo ""
print_step 6 "Installing global CLAUDE.md..."

GLOBAL_CLAUDE="$CURSOR_DIR/CLAUDE.md"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
CONFIG_CLAUDE="$PROJECT_ROOT/config/cursor/CLAUDE.md"

if [ -f "$CONFIG_CLAUDE" ]; then
    if ! $DRY_RUN; then
        cp "$CONFIG_CLAUDE" "$GLOBAL_CLAUDE"
        print_ok "Installed global CLAUDE.md"
    else
        print_note "[DRY RUN] Would copy: $CONFIG_CLAUDE -> $GLOBAL_CLAUDE"
    fi
elif [ ! -f "$GLOBAL_CLAUDE" ]; then
    print_warn "Global CLAUDE.md not found"
    print_note "Copy from: config/cursor/CLAUDE.md"
else
    print_ok "Global CLAUDE.md already exists"
fi

# Step 7: Install Cursor rules
echo ""
print_step 7 "Installing Cursor rules..."

RULES_SRC="$PROJECT_ROOT/config/cursor/rules"
if [ -d "$RULES_SRC" ]; then
    for rule in "$RULES_SRC"/*.mdc; do
        if [ -f "$rule" ]; then
            rule_name=$(basename "$rule")
            if ! $DRY_RUN; then
                cp "$rule" "$CURSOR_RULES/$rule_name"
                print_ok "Installed rule: $rule_name"
            else
                print_note "[DRY RUN] Would copy: $rule_name"
            fi
        fi
    done
else
    print_warn "Rules directory not found: $RULES_SRC"
    print_note "Skipping rule installation"
fi

# Step 8: Setup code-simplifier plugin
echo ""
print_step 8 "Setting up code-simplifier plugin..."

CODE_SIMP_DIR="$CURSOR_PLUGINS/code-simplifier/agents"
CODE_SIMP_FILE="$CODE_SIMP_DIR/code-simplifier.md"

if [ ! -f "$CODE_SIMP_FILE" ]; then
    if ! $DRY_RUN; then
        mkdir -p "$CODE_SIMP_DIR"
        
        # Check if we have a template in the project
        if [ -f "$PROJECT_ROOT/.cursor/plugins/code-simplifier/agents/code-simplifier.md" ]; then
            cp "$PROJECT_ROOT/.cursor/plugins/code-simplifier/agents/code-simplifier.md" "$CODE_SIMP_FILE"
            print_ok "Installed code-simplifier plugin"
        else
            print_warn "code-simplifier template not found in project"
            print_note "Will be created on first use"
        fi
    else
        print_note "[DRY RUN] Would create: $CODE_SIMP_FILE"
    fi
else
    print_ok "code-simplifier plugin already installed"
fi

# Step 9: Configure GitHub token (optional)
echo ""
if ! $SKIP_TOKENS; then
    print_step 9 "Configuring GitHub token..."
    
    if [ -z "$GITHUB_TOKEN" ]; then
        echo ""
        echo -e "${CYAN}GitHub Token Configuration${NC}"
        echo "Create a token at: https://github.com/settings/tokens/new"
        echo "Required scopes: repo, read:org, user, project"
        echo ""
        
        if ! $DRY_RUN; then
            read -p "Enter GitHub Personal Access Token (or press Enter to skip): " -s token
            echo ""
            
            if [ -n "$token" ]; then
                # Add to .zshrc
                if ! grep -q "GITHUB_TOKEN.*claude" ~/.zshrc 2>/dev/null; then
                    echo "" >> ~/.zshrc
                    echo "# GitHub Token for Claude Code" >> ~/.zshrc
                    echo "export GITHUB_TOKEN=\"$token\"" >> ~/.zshrc
                fi
                export GITHUB_TOKEN="$token"
                print_ok "GitHub token configured"
            else
                print_warn "Skipped GitHub token"
            fi
        else
            print_note "[DRY RUN] Would prompt for GitHub token"
        fi
    else
        print_ok "GitHub token already set"
    fi
else
    print_step 9 "Skipping token configuration (--skip-tokens flag)"
fi

# Summary
print_header "Setup Complete!"

echo -e "${GREEN}Claude Code and Cursor plugins configured!${NC}"
echo ""
echo -e "${CYAN}INSTALLED:${NC}"
echo "  - ~/.cursor/hooks.json (Cursor hooks for claude-mem)"
echo "  - ~/.cursor/rules/*.mdc (Global rules: auth, git-safety, session-wrap-up)"
echo "  - ~/.cursor/plugins/code-simplifier/ (Code quality plugin)"
echo "  - ~/.cursor/CLAUDE.md (Global standards and session protocols)"
echo ""
echo -e "${CYAN}NEXT STEPS:${NC}"
echo "  1. Restart Cursor to load hooks"
echo "  2. Verify: claude --version"
echo "  3. Start claude-mem worker: cd ~/.claude/plugins/marketplaces/thedotmack && bun run worker:start"
echo "  4. Test hooks by starting a new Cursor chat"
echo ""
echo -e "${CYAN}DOCUMENTATION:${NC}"
echo "  - Global standards: ~/.cursor/CLAUDE.md"
echo "  - Hook scripts: ~/.cursor/hooks/"
echo "  - This script: scripts/setup/README.md"
echo ""

if $DRY_RUN; then
    echo -e "${YELLOW}[DRY RUN] No changes were made.${NC}"
fi

echo -e "${GREEN}Done!${NC}"
