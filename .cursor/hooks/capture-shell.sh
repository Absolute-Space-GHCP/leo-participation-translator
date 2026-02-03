#!/bin/bash
# ============================================================================
# capture-shell.sh - Log shell command executions
# ============================================================================
# Author: Charley Scholz, JLIT
# Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
# ============================================================================

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh" 2>/dev/null || exit 0

# Read input from stdin (Cursor passes command info)
INPUT=$(cat 2>/dev/null)

if [ -n "$INPUT" ]; then
    # Extract command if available
    COMMAND=$(echo "$INPUT" | grep -o '"command":\s*"[^"]*"' | cut -d'"' -f4 2>/dev/null)
    EXIT_CODE=$(echo "$INPUT" | grep -o '"exitCode":\s*[0-9]*' | grep -o '[0-9]*' 2>/dev/null)
    
    if [ -n "$COMMAND" ]; then
        # Truncate long commands
        if [ ${#COMMAND} -gt 100 ]; then
            COMMAND="${COMMAND:0:100}..."
        fi
        log_session "SHELL" "Command: $COMMAND (exit: ${EXIT_CODE:-?})"
    fi
fi

# Output success (always continue)
output_hook_response true
