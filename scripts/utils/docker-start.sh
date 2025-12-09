#!/bin/bash
# ============================================================================
# Docker Services Launcher
# ============================================================================
# Version:     1.0.0
# Updated:     2025-12-08
# Purpose:     Start Docker Desktop and optional dev services
# Usage:       ./scripts/utils/docker-start.sh [services]
# Examples:    ./scripts/utils/docker-start.sh
#              ./scripts/utils/docker-start.sh redis
#              ./scripts/utils/docker-start.sh all
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
DOCKER_DIR="$PROJECT_DIR/docker"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       JL Dev Environment - Docker Launcher                   ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed.${NC}"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo -e "${YELLOW}Docker daemon is not running. Starting Docker Desktop...${NC}"
    
    # macOS - open Docker Desktop
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open -a Docker
        
        echo "Waiting for Docker to start..."
        TIMEOUT=60
        ELAPSED=0
        while ! docker info &> /dev/null; do
            sleep 2
            ELAPSED=$((ELAPSED + 2))
            if [ $ELAPSED -ge $TIMEOUT ]; then
                echo -e "${RED}Timeout waiting for Docker to start.${NC}"
                echo "Please start Docker Desktop manually and try again."
                exit 1
            fi
            echo -n "."
        done
        echo ""
    else
        echo -e "${RED}Please start Docker daemon manually.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}Docker is running!${NC}"
docker --version
echo ""

# Show Docker status
echo "── Docker Status ─────────────────────────────────────────────────"
echo "Containers: $(docker ps -q | wc -l | tr -d ' ') running"
echo "Images: $(docker images -q | wc -l | tr -d ' ') available"
echo ""

# Handle arguments
SERVICES="$1"

if [ -z "$SERVICES" ]; then
    echo "Docker is ready. Available commands:"
    echo ""
    echo "  Start services:    docker compose -f docker/docker-compose.yml up -d"
    echo "  Stop services:     docker compose -f docker/docker-compose.yml down"
    echo "  View logs:         docker compose -f docker/docker-compose.yml logs -f"
    echo ""
    echo "  Dev container:     Open in VS Code/Cursor with 'Reopen in Container'"
    echo ""
elif [ "$SERVICES" == "all" ]; then
    echo -e "${CYAN}Starting all services...${NC}"
    cd "$PROJECT_DIR"
    docker compose -f docker/docker-compose.yml up -d
elif [ "$SERVICES" == "down" ] || [ "$SERVICES" == "stop" ]; then
    echo -e "${YELLOW}Stopping all services...${NC}"
    cd "$PROJECT_DIR"
    docker compose -f docker/docker-compose.yml down
else
    echo -e "${CYAN}Starting service: $SERVICES${NC}"
    cd "$PROJECT_DIR"
    docker compose -f docker/docker-compose.yml up -d "$SERVICES"
fi

echo ""
echo -e "${GREEN}Done!${NC}"

