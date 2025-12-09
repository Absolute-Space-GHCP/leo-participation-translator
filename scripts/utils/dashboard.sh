#!/bin/bash
# ============================================================================
# Dashboard Launcher
# ============================================================================
# Version:     1.0.0
# Updated:     2025-12-08
# Purpose:     One-click launcher for the dev environment dashboard
# Usage:       ./scripts/utils/dashboard.sh
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
DASHBOARD_DIR="$PROJECT_DIR/dashboard"
PORT="${DASHBOARD_PORT:-3333}"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       JL Dev Environment Dashboard                           ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "$DASHBOARD_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    cd "$DASHBOARD_DIR"
    npm install
    echo ""
fi

# Check if already running
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}Dashboard already running at: http://localhost:$PORT${NC}"
    echo ""
    echo "Opening in browser..."
    open "http://localhost:$PORT"
    exit 0
fi

# Start the dashboard
cd "$DASHBOARD_DIR"
echo -e "${GREEN}Starting dashboard on port $PORT...${NC}"
echo ""

# Open browser after short delay
(sleep 2 && open "http://localhost:$PORT") &

# Run the server
npm start

