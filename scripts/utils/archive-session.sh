#!/bin/bash
# ============================================================================
# Archive Session Script
# ============================================================================
# Version:     1.0.0
# Updated:     2025-12-08
# Purpose:     Create, edit, and commit a session archive
# Usage:       ./scripts/utils/archive-session.sh "topic-name"
# Example:     ./scripts/utils/archive-session.sh "gcp-auth-setup"
# ============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
SESSIONS_DIR="$PROJECT_DIR/sessions"
TEMPLATE="$SESSIONS_DIR/SESSION_TEMPLATE.md"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get topic from argument or prompt
if [ -z "$1" ]; then
    echo -e "${CYAN}Enter a brief topic description (e.g., 'gcp-auth-setup'):${NC}"
    read -r TOPIC
else
    TOPIC="$1"
fi

# Sanitize topic for filename (lowercase, hyphens only)
TOPIC_CLEAN=$(echo "$TOPIC" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')

# Generate filename
DATE=$(date +%Y-%m-%d)
FILENAME="${DATE}_${TOPIC_CLEAN}.md"
FILEPATH="$SESSIONS_DIR/$FILENAME"

# Check if file already exists
if [ -f "$FILEPATH" ]; then
    echo -e "${YELLOW}Warning: $FILENAME already exists.${NC}"
    read -p "Overwrite? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# Create session file from template
echo -e "${GREEN}Creating session archive: $FILENAME${NC}"
cp "$TEMPLATE" "$FILEPATH"

# Replace placeholder with actual topic
sed -i '' "s/\[TOPIC\]/$TOPIC/" "$FILEPATH"
sed -i '' "s/YYYY-MM-DD/$DATE/g" "$FILEPATH"

# Detect editor
if [ -n "$EDITOR" ]; then
    EDIT_CMD="$EDITOR"
elif command -v cursor &> /dev/null; then
    EDIT_CMD="cursor"
elif command -v code &> /dev/null; then
    EDIT_CMD="code"
elif command -v nano &> /dev/null; then
    EDIT_CMD="nano"
else
    EDIT_CMD="open -e"
fi

echo ""
echo -e "${CYAN}Opening $FILENAME in editor...${NC}"
echo -e "${YELLOW}Instructions:${NC}"
echo "  1. Fill in the session details"
echo "  2. Paste your chat transcript in the Transcript section"
echo "  3. Save and close the file"
echo ""

# Open in editor
$EDIT_CMD "$FILEPATH"

# Wait for user to finish editing
echo ""
read -p "Press Enter when you've finished editing the file..."

# Verify file has content beyond template
LINES=$(wc -l < "$FILEPATH" | tr -d ' ')
if [ "$LINES" -lt 50 ]; then
    echo -e "${YELLOW}Warning: File seems short. Did you add content?${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "File saved but not committed. Edit manually and commit when ready."
        exit 0
    fi
fi

# Commit and push
echo ""
echo -e "${GREEN}Committing session archive...${NC}"
cd "$PROJECT_DIR"
git add "$FILEPATH"
git commit -m "docs(sessions): archive session - $TOPIC_CLEAN"

echo ""
read -p "Push to GitHub? (Y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    git push
    echo -e "${GREEN}Session archived and pushed to GitHub!${NC}"
else
    echo -e "${YELLOW}Committed locally. Run 'git push' when ready.${NC}"
fi

echo ""
echo -e "${GREEN}Archive complete: sessions/$FILENAME${NC}"

