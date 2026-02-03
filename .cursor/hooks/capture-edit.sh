#!/bin/bash
# ============================================================================
# capture-edit.sh - Log file edits
# ============================================================================
# Author: Charley Scholz, JLIT
# Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
# ============================================================================

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh" 2>/dev/null || exit 0

# Read input from stdin (Cursor passes edit info)
INPUT=$(cat 2>/dev/null)

if [ -n "$INPUT" ]; then
    # Extract filename if available
    FILENAME=$(echo "$INPUT" | grep -o '"file":\s*"[^"]*"' | cut -d'"' -f4 2>/dev/null)
    if [ -n "$FILENAME" ]; then
        log_session "EDIT" "Modified: $FILENAME"
    else
        log_session "EDIT" "File modified"
    fi
fi

# Output success (always continue)
output_hook_response true
