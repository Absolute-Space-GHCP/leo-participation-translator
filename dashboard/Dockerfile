# Dockerfile for Participation Translator Progress Dashboard
# Author: Charley Scholz, JLIT
# Co-authored: Claude Opus 4.5

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (none currently, but for future)
RUN npm install --production 2>/dev/null || true

# Copy application files
COPY server.js ./
COPY tasks.json ./

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run the server
CMD ["node", "server.js"]
