# JL Dev Environment Golden Master - Build Guide

Version: 1.0.0
Last Updated: 2025-12-08
Purpose: Complete step-by-step guide to build the Golden Master dev environment
Target: Johannes Leonardo engineering team (macOS Apple Silicon)

---

## Build Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Foundation (Homebrew, nvm, SDKMAN, Java) | COMPLETE |
| 2 | Cursor IDE + 27 Extensions | COMPLETE |
| 3 | GCP Auth + Gemini Models | COMPLETE |
| 4 | Slack Integration | COMPLETE |
| 5 | GitHub Repository | COMPLETE |
| 6 | Validation (18 checks) | COMPLETE |

---

## Prerequisites

| Requirement | Minimum | Verified |
|-------------|---------|----------|
| macOS | 14.0+ (Sonoma) | 26.1 (Tahoe) |
| Apple Silicon | M1/M2/M3 | M2 Pro |
| Admin Access | Required | Yes |
| Disk Space | 20GB free | Yes |
| RAM | 16GB+ | 32GB |

---

## Phase 1: Foundation

### 1.1 Xcode CLI Tools
Already installed at: /Library/Developer/CommandLineTools

    xcode-select --install
    xcode-select -p

### 1.2 Homebrew
Version: 5.0.5

    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
    brew --version

### 1.3 Node.js via nvm
Version: Node v22.16.0 LTS, npm 11.6.0

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    source ~/.zshrc
    nvm install --lts
    nvm alias default lts/*
    node -v && npm -v

### 1.4 fnm (backup)
Version: 1.38.1

    brew install fnm

### 1.5 Java via SDKMAN
Version: Java 21.0.7 LTS (Eclipse Temurin)

    curl -s "https://get.sdkman.io" | bash
    source "$HOME/.sdkman/bin/sdkman-init.sh"
    sdk install java 21.0.7-tem
    java -version

---

## Phase 2: Cursor IDE and Extensions

### 2.1 Install Cursor
Download from: https://cursor.sh
Or: brew install --cask cursor

### 2.2 Install Extensions (27 total)
See config/cursor/extensions.txt for full list.

    cursor --install-extension Continue.continue
    cursor --install-extension anthropic.claude-code
    cursor --install-extension ms-python.python
    cursor --install-extension vscjava.vscode-java-pack
    cursor --install-extension dbaeumer.vscode-eslint
    cursor --install-extension eamodio.gitlens

### 2.3 Verify Extensions

    cursor --list-extensions | wc -l
    # Expected: 27

### 2.4 Configure Claude Code
In Cursor Settings, search "Claude Code":
- Selected Model: Opus 4.5

---

## Phase 3: GCP Auth and Gemini Models

### 3.1 User Authentication

    gcloud auth login
    # Account: charleys@johannesleonardo.com

### 3.2 Application Default Credentials

    gcloud auth application-default login --project=jlai-gm-v3
    # Creates: ~/.config/gcloud/application_default_credentials.json

### 3.3 Set Default Project

    gcloud config set project jlai-gm-v3

### 3.4 Verify Gemini Access
Test Gemini 3 Pro (global endpoint):

    curl -X POST "https://aiplatform.googleapis.com/v1/projects/jlai-gm-v3/locations/global/publishers/google/models/gemini-3-pro-preview:generateContent" \
      -H "Authorization: Bearer $(gcloud auth print-access-token)" \
      -H "Content-Type: application/json" \
      -d '{"contents":[{"role":"user","parts":[{"text":"Hello"}]}]}'

### 3.5 Available Models

| Model | ID | Region |
|-------|-----|--------|
| Gemini 3 Pro | gemini-3-pro-preview | global |
| Gemini 2.5 Pro | gemini-2.5-pro | us-central1 |
| Gemini 2.5 Flash | gemini-2.5-flash | us-central1 |

### 3.6 Configure Continue

    mkdir -p ~/.continue
    cp config/continue/config.json.template ~/.continue/config.json
    # Edit and replace YOUR_PROJECT_ID with jlai-gm-v3

---

## Phase 4: Slack Integration

### 4.1 Slack App Details

| Item | Value |
|------|-------|
| App Name | DevBot-v3 |
| App ID | A09SYTY3YHL |
| Workspace ID | T7QD38DKM |
| Test Channel | #ai-v3-sandbox |
| App URL | https://api.slack.com/apps/A09SYTY3YHL |

### 4.2 Configure Webhook

    export SLACK_WEBHOOK_AI_SANDBOX="https://hooks.slack.com/services/T7QD38DKM/B0A1UBPAZ1D/..."

### 4.3 Test Webhook

    curl -X POST -H 'Content-type: application/json' \
      --data '{"text":"Test"}' \
      "$SLACK_WEBHOOK_AI_SANDBOX"

---

## Phase 5: GitHub Repository

### 5.1 GitHub CLI Auth

    gh auth login
    # Account: cmscholz222
    # Organization: Absolute-Space-GHCP

### 5.2 Verify Access

    gh auth status
    gh api user/orgs --jq '.[].login'

### 5.3 Repository URL
https://github.com/Absolute-Space-GHCP/jl-dev-environment-gm-v1.0

### 5.4 Clone (Other Team Members)

    gh repo clone Absolute-Space-GHCP/jl-dev-environment-gm-v1.0
    cd jl-dev-environment-gm-v1.0
    ./scripts/bootstrap.sh

---

## Phase 6: Validation

### 6.1 Run Validation Script

    ./scripts/validate.sh

### 6.2 Expected Results
18 passed, 0 failed

### 6.3 Checks Performed

| Category | Checks |
|----------|--------|
| System | macOS, Architecture, Xcode CLI |
| Package Managers | Homebrew, nvm, SDKMAN |
| Runtimes | Node.js, npm, Java, Python |
| Dev Tools | Git, Cursor, Docker, gcloud, gh |
| Configuration | Continue, GCP ADC, GCP project |

---

## Troubleshooting

### Homebrew: Command not found

    eval "$(/opt/homebrew/bin/brew shellenv)"

### Java: JAVA_HOME not set

    source "$HOME/.sdkman/bin/sdkman-init.sh"

### GCP: Authentication errors

    gcloud auth revoke --all
    gcloud auth login
    gcloud auth application-default login --project=jlai-gm-v3

### Claude Code: Not showing in Cursor

    Cmd+Shift+P -> "Claude Code: Open in Side Bar"

### Gemini 3: Model not found
Use global endpoint, not us-central1

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-08 | 1.0.0 | Initial complete build |

---

Maintained by: Charley (@charleymm)
