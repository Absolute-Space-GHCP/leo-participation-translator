#!/bin/bash
# ============================================================================
# Quick Link Connectivity Verification Script
# ============================================================================
# Version:     1.0.0
# Updated:     2025-12-09
# Purpose:     Verify all dashboard quick links are accessible
# Usage:       ./scripts/utils/verify-links.sh [--verbose]
# ============================================================================

# Don't exit on errors - we want to continue checking all links
# set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
TIMEOUT=10
VERBOSE=false
PASS=0
FAIL=0
WARN=0

# Parse arguments
if [[ "$1" == "--verbose" || "$1" == "-v" ]]; then
    VERBOSE=true
fi

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       Quick Link Connectivity Verification                   ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to check a URL
check_url() {
    local name="$1"
    local url="$2"
    local category="$3"
    
    if $VERBOSE; then
        echo -e "  Checking: $url"
    fi
    
    # Use curl to check if URL is accessible
    local http_code
    http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" -L "$url" 2>/dev/null || echo "000")
    
    if [[ "$http_code" == "200" || "$http_code" == "301" || "$http_code" == "302" || "$http_code" == "303" ]]; then
        echo -e "  ${GREEN}✓${NC} $name ${GREEN}($http_code)${NC}"
        PASS=$((PASS + 1))
    elif [[ "$http_code" == "401" || "$http_code" == "403" ]]; then
        # Auth required but reachable
        echo -e "  ${YELLOW}○${NC} $name ${YELLOW}($http_code - Auth required)${NC}"
        WARN=$((WARN + 1))
    elif [[ "$http_code" == "000" ]]; then
        echo -e "  ${RED}✗${NC} $name ${RED}(Timeout/Unreachable)${NC}"
        FAIL=$((FAIL + 1))
    else
        echo -e "  ${RED}✗${NC} $name ${RED}($http_code)${NC}"
        FAIL=$((FAIL + 1))
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
echo -e "${CYAN}── Repositories ────────────────────────────────────────────────${NC}"
# ─────────────────────────────────────────────────────────────────────────────

check_url "GitHub (Dev Env)" "https://github.com/Absolute-Space-GHCP/jl-dev-environment-gm" "repos"
check_url "GitHub (AI Agents)" "https://github.com/Absolute-Space-GHCP/ai-agents-gmaster-build" "repos"

echo ""

# ─────────────────────────────────────────────────────────────────────────────
echo -e "${CYAN}── Cloud & AI ──────────────────────────────────────────────────${NC}"
# ─────────────────────────────────────────────────────────────────────────────

check_url "GCP Console" "https://console.cloud.google.com" "cloud"
check_url "Vertex AI" "https://console.cloud.google.com/vertex-ai" "cloud"
check_url "Anthropic Console" "https://console.anthropic.com" "cloud"
check_url "Google AI Studio" "https://aistudio.google.com" "cloud"

echo ""

# ─────────────────────────────────────────────────────────────────────────────
echo -e "${CYAN}── Dev Tools ───────────────────────────────────────────────────${NC}"
# ─────────────────────────────────────────────────────────────────────────────

check_url "Slack API" "https://api.slack.com" "devtools"
check_url "Cursor Docs" "https://cursor.sh/docs" "devtools"
check_url "Docker Hub" "https://hub.docker.com" "devtools"
check_url "Node.js Docs" "https://nodejs.org/docs/latest-v22.x/api/" "devtools"

echo ""

# ─────────────────────────────────────────────────────────────────────────────
echo -e "${CYAN}── Documentation ───────────────────────────────────────────────${NC}"
# ─────────────────────────────────────────────────────────────────────────────

check_url "Claude Docs" "https://docs.anthropic.com" "docs"
check_url "Vertex AI Docs" "https://cloud.google.com/vertex-ai/docs" "docs"
check_url "Homebrew" "https://brew.sh" "docs"
check_url "SDKMAN" "https://sdkman.io" "docs"

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────────────────────

echo "══════════════════════════════════════════════════════════════════"
echo -e "Results: ${GREEN}$PASS passed${NC}, ${YELLOW}$WARN auth-required${NC}, ${RED}$FAIL failed${NC}"
echo "══════════════════════════════════════════════════════════════════"
echo ""

# Exit with appropriate code
if [[ $FAIL -gt 0 ]]; then
    echo -e "${RED}Some links are not accessible. Check your network connection.${NC}"
    exit 1
elif [[ $WARN -gt 0 ]]; then
    echo -e "${YELLOW}All links reachable. Some require authentication.${NC}"
    exit 0
else
    echo -e "${GREEN}All links are accessible!${NC}"
    exit 0
fi

