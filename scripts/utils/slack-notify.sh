#!/bin/bash
# ============================================================================
# Slack Notification Utility
# ============================================================================
# Version:     1.0.0
# Updated:     2025-12-08
# Purpose:     Send notifications to Slack via webhook
# Usage:       ./scripts/utils/slack-notify.sh "Your message"
# Requires:    SLACK_WEBHOOK_AI_SANDBOX environment variable
# ============================================================================

MESSAGE="${1:-Test notification from JL Dev Environment}"
WEBHOOK="$SLACK_WEBHOOK_AI_SANDBOX"

if [ -z "$WEBHOOK" ]; then
    echo "Error: SLACK_WEBHOOK_AI_SANDBOX environment variable not set"
    exit 1
fi

curl -s -X POST -H "Content-type: application/json" \
    --data "{\"text\":\"$MESSAGE\"}" \
    "$WEBHOOK"
