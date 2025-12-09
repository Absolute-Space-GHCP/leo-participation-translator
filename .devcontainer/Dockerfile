# ============================================================================
# JL Dev Environment - Dev Container
# ============================================================================
# Version:     1.0.0
# Updated:     2025-12-08
# Purpose:     Full development container with all Golden Master tools
# Base:        Microsoft's universal dev container image
# ============================================================================

ARG NODE_VERSION=22
ARG JAVA_VERSION=21.0.7-tem
ARG PYTHON_VERSION=3.11

FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    zsh \
    vim \
    jq \
    unzip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Switch to vscode user for remaining installations
USER vscode
WORKDIR /home/vscode

# ── Node.js via nvm ──────────────────────────────────────────────────────────
ARG NODE_VERSION
ENV NVM_DIR=/home/vscode/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install ${NODE_VERSION} \
    && nvm alias default ${NODE_VERSION} \
    && nvm use default

# ── Java via SDKMAN ──────────────────────────────────────────────────────────
ARG JAVA_VERSION
ENV SDKMAN_DIR=/home/vscode/.sdkman
RUN curl -s "https://get.sdkman.io" | bash \
    && bash -c "source $SDKMAN_DIR/bin/sdkman-init.sh && sdk install java ${JAVA_VERSION}"

# ── Python ───────────────────────────────────────────────────────────────────
ARG PYTHON_VERSION
USER root
RUN apt-get update && apt-get install -y \
    python${PYTHON_VERSION} \
    python${PYTHON_VERSION}-venv \
    python3-pip \
    && update-alternatives --install /usr/bin/python3 python3 /usr/bin/python${PYTHON_VERSION} 1 \
    && rm -rf /var/lib/apt/lists/*
USER vscode

# ── Shell Configuration ──────────────────────────────────────────────────────
RUN echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc \
    && echo 'export SDKMAN_DIR="$HOME/.sdkman"' >> ~/.zshrc \
    && echo '[ -s "$SDKMAN_DIR/bin/sdkman-init.sh" ] && source "$SDKMAN_DIR/bin/sdkman-init.sh"' >> ~/.zshrc

# ── Workspace ────────────────────────────────────────────────────────────────
WORKDIR /workspaces

# Default command
CMD ["sleep", "infinity"]

