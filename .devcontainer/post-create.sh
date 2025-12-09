#!/bin/bash
# ============================================================================
# Dev Container - Post Create Script
# ============================================================================
# Version:     1.0.0
# Updated:     2025-12-08
# Purpose:     Runs after dev container is created to complete setup
# ============================================================================

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       JL Dev Environment - Container Setup                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Source shell configs
source ~/.nvm/nvm.sh 2>/dev/null
source ~/.sdkman/bin/sdkman-init.sh 2>/dev/null

# Verify installations
echo "── Verifying Installations ─────────────────────────────────────"
echo "Node.js: $(node -v 2>/dev/null || echo 'not found')"
echo "npm: $(npm -v 2>/dev/null || echo 'not found')"
echo "Java: $(java -version 2>&1 | head -1)"
echo "Python: $(python3 --version 2>/dev/null || echo 'not found')"
echo "Git: $(git --version 2>/dev/null || echo 'not found')"
echo ""

# Install dashboard dependencies if present
if [ -f "dashboard/package.json" ]; then
    echo "── Installing Dashboard Dependencies ───────────────────────────"
    cd dashboard && npm install && cd ..
    echo ""
fi

# Setup Continue config if not exists
if [ ! -f ~/.continue/config.json ]; then
    echo "── Setting up Continue Config ──────────────────────────────────"
    mkdir -p ~/.continue
    if [ -f "config/continue/config.json.template" ]; then
        cp config/continue/config.json.template ~/.continue/config.json
        echo "Created ~/.continue/config.json (update YOUR_PROJECT_ID)"
    fi
    echo ""
fi

echo "══════════════════════════════════════════════════════════════════"
echo "Dev container setup complete!"
echo ""
echo "Next steps:"
echo "  1. Authenticate GCP: gcloud auth login"
echo "  2. Authenticate GitHub: gh auth login"
echo "  3. Run dashboard: ./scripts/utils/dashboard.sh"
echo "══════════════════════════════════════════════════════════════════"

