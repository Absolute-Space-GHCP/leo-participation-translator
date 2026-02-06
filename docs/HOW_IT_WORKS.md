# How It Works

Version: 1.0.0
Last Updated: 2026-01-22
Purpose: Explain how the AI-powered development environment functions

---

## Overview

This development environment combines multiple AI assistants with automation tools to create a seamless, intelligent coding experience. The system remembers your work across sessions, follows consistent coding standards, and provides powerful AI capabilities directly in your IDE.

---

## The Three Pillars

### 1. AI Assistants (The Brains)

You have access to multiple AI models, each optimized for different tasks:

| Assistant | Best For | How to Access |
|-----------|----------|---------------|
| **Claude Opus 4.6** | Complex reasoning, architecture, debugging | Cursor chat (`Cmd+L`) |
| **Gemini 2.5 Pro** | Code completion, quick questions | Continue sidebar |
| **Gemini CLI** | Terminal tasks, file operations | `gemini` command |

**Example workflow:**
1. Use Gemini for quick code completions while typing
2. Ask Claude for architectural decisions or debugging
3. Use Gemini CLI for terminal-based tasks

### 2. Persistent Memory (The Brain's Memory)

Unlike standard AI assistants that forget everything between chats, this system **remembers**:

- What files you edited
- What commands you ran
- What decisions you made
- What problems you solved

**How it works:**

```
Session 1: You debug an auth issue
  ↓ Claude-mem captures the solution
  ↓ Gemini summarizes the session

Session 2: You return to auth code
  ↓ Claude-mem injects relevant context
  ↓ AI already knows your previous solution
```

### 3. Standardized Workflows (The Habits)

The system enforces good practices automatically through **Cursor Rules**:

| Rule | What It Does |
|------|--------------|
| **Auth Permissions** | Pre-authorizes login flows (no constant prompts) |
| **Git Safety** | Prevents accidental overwrites (archive-first) |
| **Session Wrap-Up** | Ensures clean handoffs between sessions |
| **Authorship** | Maintains consistent file attribution |

---

## What Happens When You Code

### Opening Your IDE

```
1. You open Cursor
2. System loads your global standards (~/.cursor/CLAUDE.md)
3. System loads project-specific rules (.cursor/rules/)
4. Claude-mem injects your past session context
5. MCP servers start (filesystem, git, thinking)
6. You're ready to code with full AI support
```

### While You Work

```
You type code
  → AI suggests completions (Gemini via Continue)

You ask a question
  → AI responds with project context (Claude via Cursor)
  → MCP servers provide file/git access

You run a command
  → Hooks capture the output
  → Claude-mem stores the observation

You edit a file
  → Hooks track the change
  → Code-simplifier can refine it
```

### Ending Your Session

```
1. You close Cursor (or explicitly end session)
2. session-summary.sh triggers
3. Gemini generates a summary of your work
4. Summary stored for next session
5. Git status verified (wrap-up protocol)
```

---

## The MCP Servers

MCP (Model Context Protocol) servers give AI assistants **tools** to interact with your system:

### Sequential Thinking
**What it does:** Enables step-by-step reasoning with the ability to revise and branch thoughts.

**When it's used:** Complex problems, architecture decisions, debugging.

**Example:**
```
You: "Think step by step about how to refactor this auth system"
AI: Uses sequential-thinking to break down the problem, 
    revise approaches, and arrive at a solution
```

### Filesystem Server
**What it does:** Secure file read/write/search operations.

**When it's used:** AI needs to read or modify files.

**Scope:** Limited to `~/Projects/` for security.

### Git Server
**What it does:** Git operations (status, diff, log, commit).

**When it's used:** AI needs to understand or modify version control.

**Scope:** Limited to `~/Projects/` repositories.

---

## The Hooks System

Hooks are **event triggers** that run scripts when things happen:

| Event | Hook | What Runs |
|-------|------|-----------|
| Before prompt | `session-init.sh` | Initialize session |
| Before prompt | `context-inject.sh` | Inject past context |
| After MCP call | `save-observation.sh` | Capture results |
| After shell cmd | `save-observation.sh` | Capture output |
| After file edit | `save-file-edit.sh` | Track changes |
| Session end | `session-summary.sh` | Generate summary |

---

## Practical Examples

### Example 1: Debugging a Bug

```
You: "I'm getting a null pointer error in auth.js"

What happens:
1. Claude-mem checks if you've worked on auth.js before
2. If yes, injects that context into the prompt
3. Claude analyzes the error with your history
4. MCP filesystem reads the file
5. MCP git checks recent changes
6. Claude provides a solution informed by all this
```

### Example 2: Creating a New Feature

```
You: "Create a user dashboard component"

What happens:
1. Cursor rules load project standards
2. Claude generates code following your patterns
3. Code-simplifier reviews for consistency
4. Hooks track the file creation
5. Git MCP can stage the changes
6. Claude-mem remembers this for later
```

### Example 3: Returning After Time Away

```
You open Cursor after a week

What happens:
1. Claude-mem injects your last session summary
2. AI knows what you were working on
3. AI knows what decisions you made
4. AI can continue where you left off
5. No "context lost" problem
```

---

## Why This Approach?

### Traditional AI Coding
- ❌ Forgets everything between sessions
- ❌ No project-specific knowledge
- ❌ Inconsistent coding standards
- ❌ Manual context management

### This Environment
- ✅ Persistent memory across sessions
- ✅ Project rules and standards enforced
- ✅ Automated context injection
- ✅ Multiple AI models for different tasks
- ✅ Secure file and git operations

---

## Quick Reference

| Need | Solution |
|------|----------|
| Quick code completion | Type and wait (Gemini auto-completes) |
| Ask AI a question | `Cmd+L` (Cursor chat) |
| Complex reasoning | Ask to "think step by step" |
| File operations | AI uses filesystem MCP automatically |
| Git operations | AI uses git MCP automatically |
| Check session history | http://localhost:37777 |
| View past context | Check `.cursor/rules/claude-mem-context.mdc` |

---

Author: Charley Scholz, JLIT
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-01-22
