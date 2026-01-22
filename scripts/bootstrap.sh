#!/bin/bash
# ============================================================================
# JL Dev Environment - Bootstrap Script
# ============================================================================
# Version:     1.1.0
# Updated:     2026-01-22
# Purpose:     One-command setup for the Golden Master dev environment
# Usage:       ./scripts/bootstrap.sh
# ============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       JL Dev Environment - Golden Master Bootstrap v1.0.0    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check for Apple Silicon
if [[ $(uname -m) != "arm64" ]]; then
    echo "Warning: This script is optimized for Apple Silicon."
    echo "Intel Macs may require modifications."
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "This script will install:"
echo "  - Homebrew (package manager)"
echo "  - nvm + Node.js LTS"
echo "  - SDKMAN + Java 21 LTS"
echo "  - Cursor extensions"
echo "  - Continue AI assistant config"
echo ""
read -p "Proceed with installation? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0
fi

echo ""
echo "── Phase 1: Xcode CLI Tools ────────────────────────────────────"
if ! xcode-select -p &> /dev/null; then
    echo "Installing Xcode Command Line Tools..."
    xcode-select --install
    echo "Please complete the installation dialog, then re-run this script."
    exit 0
else
    echo "Xcode CLI Tools already installed"
fi

echo ""
echo "── Phase 2: Homebrew ────────────────────────────────────────────"
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval "$(/opt/homebrew/bin/brew shellenv)"
else
    echo "Homebrew already installed"
fi

echo ""
echo "── Phase 3: Node.js (via nvm) ──────────────────────────────────"
if [ ! -d "$HOME/.nvm" ]; then
    echo "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm install --lts
    nvm alias default lts/*
else
    echo "nvm already installed"
fi

echo ""
echo "── Phase 4: Java (via SDKMAN) ──────────────────────────────────"
if [ ! -d "$HOME/.sdkman" ]; then
    echo "Installing SDKMAN..."
    curl -s "https://get.sdkman.io" | bash
    source "$HOME/.sdkman/bin/sdkman-init.sh"
    sdk install java 21.0.7-tem
else
    echo "SDKMAN already installed"
fi

echo ""
echo "── Phase 5: Cursor Extensions ──────────────────────────────────"
if [ -d "/Applications/Cursor.app" ]; then
    echo "Installing Cursor extensions..."
    /Applications/Cursor.app/Contents/Resources/app/bin/cursor \
        --install-extension Continue.continue \
        --install-extension anthropic.claude-code \
        --install-extension ms-python.python \
        --install-extension vscjava.vscode-java-pack \
        --install-extension dbaeumer.vscode-eslint \
        --install-extension eamodio.gitlens \
        2>/dev/null || true
else
    echo "Cursor not found. Please install from https://cursor.sh"
fi

echo ""
echo "── Phase 6: Configuration ──────────────────────────────────────"
if [ ! -f "$HOME/.continue/config.json" ]; then
    mkdir -p "$HOME/.continue"
    cp "$PROJECT_DIR/config/continue/config.json.template" "$HOME/.continue/config.json"
    echo "Created ~/.continue/config.json (update YOUR_PROJECT_ID)"
else
    echo "Continue config already exists"
fi

echo ""
echo "══════════════════════════════════════════════════════════════════"
echo "Bootstrap complete!"
echo ""
echo "Next steps:"
echo "  1. Restart your terminal (or run: source ~/.zshrc)"
echo "  2. Update ~/.continue/config.json with your GCP project ID"
echo "  3. Run: gcloud auth application-default login"
echo "  4. Run: ./scripts/validate.sh to verify setup"
echo "══════════════════════════════════════════════════════════════════"
