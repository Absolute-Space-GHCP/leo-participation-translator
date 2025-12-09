# Docker Integration

Version: 1.0.0
Last Updated: 2025-12-08
Purpose: Docker setup and usage for the JL Dev Environment

---

## Overview

This dev environment includes full Docker integration:

| Component | Purpose |
|-----------|---------|
| **Dev Container** | Full development environment in a container |
| **Docker Compose** | Local services (Redis, Postgres, etc.) |
| **Dashboard Container** | Containerized status dashboard |
| **Helper Scripts** | One-click Docker management |

---

## Quick Start

### Start Docker

```bash
./scripts/utils/docker-start.sh
```

This will:
1. Check if Docker is installed
2. Start Docker Desktop if not running
3. Show current Docker status

---

## Dev Container

The dev container provides a fully configured development environment identical to the Golden Master setup.

### Using with Cursor/VS Code

1. Install the "Dev Containers" extension
2. Open the repo in Cursor/VS Code
3. Press `Cmd+Shift+P` → "Dev Containers: Reopen in Container"
4. Wait for the container to build (~5 minutes first time)

### What's Included

| Tool | Version |
|------|---------|
| Node.js | 22 LTS |
| Java | 21 (Temurin) |
| Python | 3.11 |
| Git | Latest |
| Docker-in-Docker | Yes |
| GitHub CLI | Latest |
| gcloud CLI | Latest |

### Customizing

Edit `.devcontainer/devcontainer.json`:

```json
{
  "build": {
    "args": {
      "NODE_VERSION": "22",
      "JAVA_VERSION": "21.0.7-tem",
      "PYTHON_VERSION": "3.11"
    }
  }
}
```

---

## Docker Compose Services

### Available Services

Edit `docker/docker-compose.yml` to enable services:

| Service | Port | Default |
|---------|------|---------|
| Redis | 6379 | Commented out |
| PostgreSQL | 5432 | Commented out |
| Dashboard | 3333 | Enabled |

### Enable a Service

Uncomment the service in `docker/docker-compose.yml`:

```yaml
services:
  redis:
    image: redis:7-alpine
    # ... rest of config
```

### Start Services

```bash
# Start all enabled services
docker compose -f docker/docker-compose.yml up -d

# Start specific service
docker compose -f docker/docker-compose.yml up -d redis

# View logs
docker compose -f docker/docker-compose.yml logs -f

# Stop all services
docker compose -f docker/docker-compose.yml down
```

---

## Dashboard in Docker

Run the status dashboard as a container:

```bash
# Build and run
docker compose -f docker/docker-compose.yml up -d dashboard

# Access at
open http://localhost:3333
```

---

## Docker Commands Reference

### Containers

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop all containers
docker stop $(docker ps -q)

# Remove all stopped containers
docker container prune
```

### Images

```bash
# List images
docker images

# Remove unused images
docker image prune

# Remove all unused data
docker system prune -a
```

### Logs & Debugging

```bash
# View container logs
docker logs <container-name>

# Follow logs
docker logs -f <container-name>

# Execute command in container
docker exec -it <container-name> /bin/bash
```

---

## Troubleshooting

### Docker Desktop Won't Start

```bash
# Kill any stuck processes
killall Docker

# Restart
open -a Docker
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3333

# Kill it
lsof -ti:3333 | xargs kill -9
```

### Container Build Fails

```bash
# Rebuild without cache
docker compose build --no-cache

# Or for dev container
# Cmd+Shift+P → "Dev Containers: Rebuild Container"
```

### Out of Disk Space

```bash
# Check Docker disk usage
docker system df

# Clean up everything unused
docker system prune -a --volumes
```

---

## Environment Variables

Services can use these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `GCP_PROJECT` | jlai-gm-v3 | Google Cloud project |
| `NODE_ENV` | development | Node environment |
| `DASHBOARD_PORT` | 3333 | Dashboard server port |

---

## Security Notes

1. **Never commit secrets** to Docker images
2. Use `.env` files for local secrets (gitignored)
3. Mount credentials at runtime, don't bake them in
4. The Docker socket mount (`/var/run/docker.sock`) gives container access to host Docker - use carefully

---

Maintained by: Charley (@charleymm)

