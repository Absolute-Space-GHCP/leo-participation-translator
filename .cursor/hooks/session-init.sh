#!/bin/bash
# ============================================================================
# session-init.sh - Initialize session on first prompt
# ============================================================================
# Author: Charley Scholz, JLIT
# Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
# ============================================================================

# Source common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh" 2>/dev/null || exit 0

# Only run once per session (check for lock file)
LOCK_FILE="$SESSION_LOG_DIR/.session_started"
if [ -f "$LOCK_FILE" ]; then
    output_hook_response true
    exit 0
fi

# Create lock file
mkdir -p "$SESSION_LOG_DIR"
touch "$LOCK_FILE"

# Log session start
log_session "INFO" "Session started"
log_session "INFO" "Branch: $(get_git_branch)"
log_session "INFO" "Git status: $(get_git_status)"

# Check claude-mem status
if check_claude_mem; then
    log_session "INFO" "claude-mem: connected"
else
    log_session "WARN" "claude-mem: not running"
fi

# Output success
output_hook_response true "Session initialized"
