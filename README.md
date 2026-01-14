# JL Dev Environment Golden Master

Version: 1.0.0
Last Updated: 2025-12-08
Purpose: Reproducible AI-first development environment for Johannes Leonardo engineering team

## Overview

This repository contains everything needed to bootstrap a standardized macOS development environment optimized for:

- AI-assisted development (Gemini 3 Pro, Claude Opus 4.5 via Cursor)
- Full-stack development (Node.js, Java, Python)
- Slack bot development (DevBot-v3)
- Enterprise tooling (Docker, Kubernetes, GCP)

## Quick Start

    # Clone the repo (get URL from team lead or company GitHub)
    git clone <repo-url>/jl-dev-environment-gm.git
    cd jl-dev-environment-gm

    # Run the bootstrap script
    ./scripts/bootstrap.sh

    # Validate setup
    ./scripts/validate.sh

## Documentation

| Document        | Purpose                                         |
| --------------- | ----------------------------------------------- |
| QUICKSTART.md   | **Start here!** Zero-to-hero guide for new devs |
| docs/BUILD.md   | Detailed step-by-step build guide               |
| docs/AUTH.md    | OAuth accounts and authentication reference     |
| docs/DOCKER.md  | Docker and dev container setup                  |
| CONTRIBUTING.md | How to contribute to this project               |
| SECURITY.md     | Security policy and best practices              |
| CHANGELOG.md    | Version history and changes                     |
| TODO.md         | Future development roadmap                      |

## Repository Structure

    jl-dev-environment-gm/
    ├── .github/workflows/    # GitHub Actions (Slack notifications)
    ├── config/
    │   ├── continue/         # Gemini AI assistant config
    │   ├── cursor/           # Cursor IDE settings + extensions
    │   ├── shell/            # .zshrc template
    │   └── slack/            # Slack app config
    ├── docs/                  # Documentation
    ├── scripts/
    │   ├── bootstrap.sh      # One-command setup
    │   ├── validate.sh       # Environment verification
    │   └── utils/            # Helper scripts (incl. session archiver)
    ├── sessions/              # Archived AI chat sessions
    ├── CHANGELOG.md          # Version history
    ├── LICENSE               # MIT License
    ├── README.md             # This file
    ├── TODO.md               # Development roadmap
    └── VERSION               # Current version number

## Requirements

- macOS 14.0+ (Sonoma) or later
- Apple Silicon (M1/M2/M3)
- Admin access
- 20GB free disk space

## What Gets Installed

| Category         | Tools                                     |
| ---------------- | ----------------------------------------- |
| Package Managers | Homebrew 5.x, nvm, SDKMAN                 |
| Runtimes         | Node.js 22 LTS, Java 21 LTS, Python 3.11+ |
| IDE              | Cursor with 27 extensions                 |
| AI Tools         | Claude Code, Continue (Gemini), Cursor AI |
| DevOps           | Docker, kubectl, gcloud CLI, gh CLI       |

## AI Models Available

| Model                | Provider  | Access                   |
| -------------------- | --------- | ------------------------ |
| Claude Opus 4.5      | Anthropic | Cursor Pro + Claude Code |
| Claude Sonnet 4.5    | Anthropic | Cursor Pro               |
| Gemini 3 Pro         | Google    | Vertex AI (global)       |
| Gemini 2.5 Pro/Flash | Google    | Vertex AI (us-central1)  |
| GPT-5.1 Codex Max    | OpenAI    | Cursor Pro               |

## Authentication Summary

| Service      | Account                               |
| ------------ | ------------------------------------- |
| GitHub       | Your GitHub account (JL org)          |
| Google Cloud | your-email@johannesleonardo.com       |
| Slack        | Johannes Leonardo workspace           |

See docs/AUTH.md for setup instructions and full authentication details.

## Dashboard

Launch the local status dashboard for visual monitoring:

    ./scripts/utils/dashboard.sh

Opens at http://localhost:3333 with:
- Real-time status for runtimes, package managers, DevOps tools
- Authentication status (GitHub, GCP, ADC)
- Repository status with branch and clean/dirty state
- **⚡ Verify Links** - One-click connectivity test for all Quick Links
- Organized Quick Links by category (Repos, Cloud & AI, Dev Tools, Docs)
- Auto-refresh every 30 seconds

### Verify Links (CLI)

Test Quick Link connectivity from the command line:

    ./scripts/utils/verify-links.sh

## Validation

Run the validation script to verify your setup:

    ./scripts/validate.sh

Expected: 19 passed, 0 failed (includes workspace path check)

## License

MIT - See LICENSE file

## Maintainers

- JL Engineering Team

## Repository

- GitHub: Company GitHub instance (see team lead for access)
- Status: Golden Master v1.0.0
