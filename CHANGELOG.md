# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-01-11 🧠 AI TOOLING INTEGRATION

**Author:** Charley Scholz (Johannes Leonardo IT)  
**Co-author:** Claude (Anthropic AI Assistant), Cursor (IDE)

### 🧠 AI Development Tooling

- **Claude-Mem Integration** - Persistent memory across coding sessions
  - User-level hooks installed (`~/.cursor/hooks.json`)
  - Gemini-powered session summarization
  - Web viewer at http://localhost:37777
  - Automatic capture of tool usage, file edits, shell commands

- **Code-Simplifier Plugin** - Code quality and consistency tool
  - User-level installation (`~/.cursor/plugins/code-simplifier/`)
  - Follows project standards in CLAUDE.md
  - Preserves functionality while improving clarity

### Documentation
- Updated `CLAUDE.md` with AI Development Tooling section
- Added auto-approve note for batch maintenance tasks
- Cross-project tooling now works via user-level setup

---

## [1.2.0] - 2025-12-09

### Summary
First complete Golden Master build of the JL Dev Environment for Johannes Leonardo engineering team.

### Added

#### Foundation (Phase 1)
- Homebrew 5.0.5 package manager installation
- nvm 0.40.1 + Node.js v22.16.0 LTS + npm 11.6.0
- fnm 1.38.1 (backup Node version manager)
- SDKMAN 5.20.0 + Java 21.0.7 LTS (Eclipse Temurin)
- Python 3.11.8 via pyenv

#### IDE & Extensions (Phase 2)
- Cursor IDE with 27 extensions installed
- Claude Code extension v2.0.61 (Anthropic)
- Continue extension (Gemini integration)
- Full Python/Java/JavaScript tooling
- Docker and Kubernetes extensions
- GitLens, REST Client, Postman

#### AI Integration (Phase 3)
- Gemini 3 Pro (Preview) via Vertex AI - global endpoint
- Gemini 2.5 Pro via Vertex AI - us-central1
- Gemini 2.5 Flash via Vertex AI - us-central1
- Claude Opus 4.5 via Claude Code extension
- Claude Sonnet 4.5 via Cursor Pro Plan
- Continue configuration for all Gemini models

#### Google Cloud (Phase 3)
- GCP authentication (user + ADC)
- Project: jlai-gm-v3
- Vertex AI API enabled
- Application Default Credentials configured

#### Slack Integration (Phase 4)
- DevBot-v3 Slack app configured
- Incoming webhooks to #ai-v3-sandbox
- GitHub Actions workflow for push/PR notifications
- CLI notification utility script

#### GitHub Integration (Phase 5)
- Repository: Absolute-Space-GHCP/jl-dev-environment-gm-v1.0
- GitHub CLI authentication
- GitHub Actions CI/CD workflow

#### Validation (Phase 6)
- Comprehensive validation script (18 checks)
- All checks passing

#### Documentation
- BUILD.md - Complete step-by-step guide
- README.md - Project overview
- TODO.md - Future development roadmap
- AUTH.md - OAuth accounts reference (new)

#### Configuration Templates
- Continue config (Gemini models)
- Cursor settings and extensions list
- Shell (.zshrc) template
- Slack environment variables
- EditorConfig for consistent formatting

### Infrastructure
- macOS 26.1 (Tahoe) on Apple Silicon (M2 Pro)
- Multi-root Cursor workspace (2 projects)
- 32GB RAM Mac mini

---

## [1.2.0] - 2025-12-09

### Summary
Major dashboard improvements, standardized project path convention, and link verification system.

---

## [1.0.0] - 2025-12-08

### Added

#### Dashboard Enhancements
- **⚡ Verify Links button** - One-click connectivity test for all Quick Links
- `/api/verify-links` - API endpoint for link verification
- `/api/project` - API endpoint for project info (name, version)
- `/api/links` - API endpoint for Quick Links configuration
- Version badge display in dashboard header
- Organized Quick Links by category (Repositories, Cloud & AI, Dev Tools, Documentation)
- New Quick Links: Anthropic Console, Google AI Studio, Docker Hub, Node.js Docs, Claude Docs, Vertex AI Docs, Homebrew, SDKMAN

#### Scripts
- `scripts/utils/verify-links.sh` - CLI tool for testing Quick Link connectivity

#### Documentation
- `PROJECT_GUARDRAILS.md` - Project constraints and development rules
- Standard project path convention: `~/dev/ai-agents-and-apps-dev/PROJECT_NAME`
- Workspace path verification in validation script

### Changed
- Dashboard repository paths: `~/Projects/` → `~/dev/ai-agents-and-apps-dev/`
- Refactored `/api/status` to use direct function calls (removed internal HTTP)
- Fixed deprecated `kubectl version --client --short` flag
- Fixed repository display to show clean names (not raw command output)
- Validation script now checks workspace path (19 checks total)
- Updated `CLAUDE.md` with path conventions and session workflow

### Fixed
- Repository section no longer shows ugly command output on errors
- Repos now show "Not found" cleanly instead of path errors

---

## [1.1.0] - 2025-12-08

### Added
- QUICKSTART.md - Comprehensive zero-to-hero guide for new developers
- CONTRIBUTING.md - Contribution guidelines
- SECURITY.md - Security policy and best practices
- .env.example - Environment variables template
- .github/PULL_REQUEST_TEMPLATE.md - PR template
- .github/ISSUE_TEMPLATE/bug_report.md - Bug report template
- .github/ISSUE_TEMPLATE/feature_request.md - Feature request template
- sessions/ - Session archive system for AI chat preservation
- sessions/README.md - How to use session archiving
- sessions/SESSION_TEMPLATE.md - Template for new session archives
- scripts/utils/archive-session.sh - Helper script to create and commit session archives
- dashboard/ - Local status dashboard (Node.js/Express)
- dashboard/server.js - Express server with health check APIs
- dashboard/public/ - Dashboard UI (HTML/CSS/JS)
- scripts/utils/dashboard.sh - One-click dashboard launcher
- .devcontainer/ - VS Code/Cursor dev container configuration
- .devcontainer/Dockerfile - Full dev environment container
- .devcontainer/devcontainer.json - Dev container settings
- docker/docker-compose.yml - Local development services
- docker/Dockerfile.dashboard - Containerized dashboard
- scripts/utils/docker-start.sh - Docker launcher script
- docs/DOCKER.md - Docker integration documentation
- CLAUDE.md - AI assistant context file

### Changed
- README.md - Updated documentation table with new files
- All repo URLs updated to jl-dev-environment-gm-v1.0

---

## [Unreleased]

### Planned
- MCP Server (Local Model Context Protocol)
- Slack slash commands
- Architecture diagrams
- Terraform/Pulumi infrastructure as code

---

[1.2.0]: https://github.com/Absolute-Space-GHCP/jl-dev-environment-gm-v1.0/releases/tag/v1.2.0
[1.1.0]: https://github.com/Absolute-Space-GHCP/jl-dev-environment-gm-v1.0/releases/tag/v1.1.0
[1.0.0]: https://github.com/Absolute-Space-GHCP/jl-dev-environment-gm-v1.0/releases/tag/v1.0.0
