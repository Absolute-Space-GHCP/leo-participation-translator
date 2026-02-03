#!/bin/bash
# ============================================================================
# session-end.sh - Cleanup and logging on session end
# ============================================================================
# Author: Charley Scholz, JLIT
# Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
# ============================================================================

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh" 2>/dev/null || exit 0

# Log session end
log_session "INFO" "Session ending"
log_session "INFO" "Final git status: $(get_git_status)"
log_session "INFO" "Modified files: $(count_modified_files)"

# Move session log to dated file
CURRENT_LOG="$SESSION_LOG_DIR/.current_session.log"
if [ -f "$CURRENT_LOG" ]; then
    DATED_LOG="$SESSION_LOG_DIR/session_$(get_timestamp).log"
    mv "$CURRENT_LOG" "$DATED_LOG" 2>/dev/null
fi

# Remove lock file
rm -f "$SESSION_LOG_DIR/.session_started" 2>/dev/null

# Output success
output_hook_response true "Session ended"
