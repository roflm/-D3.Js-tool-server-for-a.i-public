# AI D3.js Tool Server - Frontend Dockerfile
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Increase Node memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with network timeout
RUN yarn install --frozen-lockfile --network-timeout 100000

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Use nginx to serve the built app
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy built app from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]