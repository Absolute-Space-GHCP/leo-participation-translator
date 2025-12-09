#!/bin/bash
# ============================================================================
# JL Dev Environment - Validation Script
# ============================================================================
# Version:     1.2.0
# Updated:     2025-12-09
# Purpose:     Checks that all required tools are installed and configured
# Usage:       ./scripts/validate.sh
# Expected:    19 passed, 0 failed
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

# Standard project path pattern
EXPECTED_PATH_PATTERN="dev/ai-agents-and-apps-dev/jl-dev-environment-gm-v1.0"

check() {
    local name="$1"
    local cmd="$2"

    if eval "$cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $name"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}✗${NC} $name"
        FAIL=$((FAIL + 1))
    fi
}

check_warn() {
    local name="$1"
    local cmd="$2"

    if eval "$cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $name"
        PASS=$((PASS + 1))
    else
        echo -e "${YELLOW}○${NC} $name (optional)"
        WARN=$((WARN + 1))
    fi
}

check_version() {
    local name="$1"
    local cmd="$2"

    local version
    version=$(eval "$cmd" 2>&1 | head -1)
    if [ -n "$version" ]; then
        echo -e "${GREEN}✓${NC} $name: $version"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}✗${NC} $name: NOT FOUND"
        FAIL=$((FAIL + 1))
    fi
}

# Get script directory and project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       JL Dev Environment - Validation Report v1.1.0          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
echo "── Workspace ─────────────────────────────────────────────────────"
# ─────────────────────────────────────────────────────────────────────────────

# Check if running from correct workspace path
if [[ "$PROJECT_DIR" == *"$EXPECTED_PATH_PATTERN"* ]]; then
    echo -e "${GREEN}✓${NC} Workspace path: $PROJECT_DIR"
    PASS=$((PASS + 1))
else
    echo -e "${RED}✗${NC} Workspace path: $PROJECT_DIR"
    echo -e "  ${YELLOW}Expected path pattern:${NC} ~/$EXPECTED_PATH_PATTERN"
    FAIL=$((FAIL + 1))
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────────
echo "── System ──────────────────────────────────────────────────────"
# ─────────────────────────────────────────────────────────────────────────────
check_version "macOS" "sw_vers -productVersion"
check_version "Architecture" "uname -m"
check "Xcode CLI Tools" "xcode-select -p"

echo ""
echo "── Package Managers ─────────────────────────────────────────────"
check_version "Homebrew" "brew --version | head -1"
check "nvm" "[ -d ~/.nvm ]"
check "SDKMAN" "[ -d ~/.sdkman ]"

echo ""
echo "── Runtimes ─────────────────────────────────────────────────────"
check_version "Node.js" "node -v"
check_version "npm" "npm -v"
check_version "Java" "java -version 2>&1 | head -1"
check_version "Python" "python3 --version"

echo ""
echo "── Development Tools ────────────────────────────────────────────"
check_version "Git" "git --version"
check "Cursor" "[ -d /Applications/Cursor.app ]"
check_version "Docker" "docker --version"
check_version "gcloud" "gcloud --version 2>&1 | head -1"
check_version "gh (GitHub CLI)" "gh --version | head -1"

echo ""
echo "── Configuration ────────────────────────────────────────────────"
check "Continue config" "[ -f ~/.continue/config.json ]"
check "GCP ADC" "[ -f ~/.config/gcloud/application_default_credentials.json ]"
check "GCP project set" "gcloud config get-value project 2>/dev/null | grep -q 'jlai'"

echo ""
echo "══════════════════════════════════════════════════════════════════"
echo -e "Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC}, ${YELLOW}$WARN warnings${NC}"
echo "══════════════════════════════════════════════════════════════════"

if [ $FAIL -gt 0 ]; then
    echo ""
    echo "Run 'cat docs/BUILD.md' for setup instructions."
    exit 1
fi
