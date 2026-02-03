#!/bin/bash
# ============================================================================
# Participation Translator - Cursor Hooks Common Functions
# Cross-platform utility functions for session management
# ============================================================================
# Author: Charley Scholz, JLIT
# Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
# Created: 2026-02-03
# Updated: 2026-02-03
# ============================================================================

# Configuration
PROJECT_NAME="leo-participation-translator"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SESSION_LOG_DIR="$PROJECT_ROOT/sessions"
CLAUDE_MEM_URL="${CLAUDE_MEM_URL:-http://127.0.0.1:37777}"

# ============================================================================
# Utility Functions
# ============================================================================

# Check if claude-mem is running
check_claude_mem() {
    local response
    response=$(curl -s --max-time 2 "$CLAUDE_MEM_URL/api/readiness" 2>/dev/null)
    if echo "$response" | grep -q '"status":"ready"'; then
        return 0
    fi
    return 1
}

# Get current timestamp
get_timestamp() {
    date +"%Y-%m-%d_%H%M%S"
}

# Get ISO timestamp
get_iso_timestamp() {
    date -u +"%Y-%m-%dT%H:%M:%SZ"
}

# Log message to session file
log_session() {
    local level="$1"
    local message="$2"
    local session_file="$SESSION_LOG_DIR/.current_session.log"
    
    mkdir -p "$SESSION_LOG_DIR"
    echo "[$(get_iso_timestamp)] [$level] $message" >> "$session_file"
}

# Get current git branch
get_git_branch() {
    git -C "$PROJECT_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown"
}

# Get current git status (clean/dirty)
get_git_status() {
    if git -C "$PROJECT_ROOT" diff --quiet HEAD 2>/dev/null; then
        echo "clean"
    else
        echo "dirty"
    fi
}

# Count modified files
count_modified_files() {
    git -C "$PROJECT_ROOT" status --porcelain 2>/dev/null | wc -l | tr -d ' '
}

# Output JSON for hook response
output_hook_response() {
    local continue_flag="${1:-true}"
    local message="${2:-}"
    
    if [ -n "$message" ]; then
        echo "{\"continue\": $continue_flag, \"message\": \"$message\"}"
    else
        echo "{\"continue\": $continue_flag}"
    fi
}

# ============================================================================
# Export functions for use in other scripts
# ============================================================================

export -f check_claude_mem
export -f get_timestamp
export -f get_iso_timestamp
export -f log_session
export -f get_git_branch
export -f get_git_status
export -f count_modified_files
export -f output_hook_response
export PROJECT_NAME
export PROJECT_ROOT
export SESSION_LOG_DIR
export CLAUDE_MEM_URL
