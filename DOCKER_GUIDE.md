# AI D3.js Tool Server - Docker Deployment Guide

## Quick Start with Docker

### 1. Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 2GB free disk space

### 2. One-Command Setup

```bash
# Complete setup
git clone <repository-url>
cd ai-d3js-tool-server
./scripts/docker-setup.sh setup
```

### 3. Manual Setup

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## Access Points

After successful deployment:

- **Dashboard**: http://localhost:3000
- **API Server**: http://localhost:8001  
- **API Documentation**: http://localhost:8001/docs
- **AI Integration Guide**: http://localhost:8001/api/docs/ai

## Docker Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                           │
│                                                             │
│  ┌─────────────────┐     ┌─────────────────┐               │
│  │   Frontend      │     │   Backend       │               │
│  │   (React+D3.js) │────▶│   (FastAPI)     │               │
│  │   Port: 3000    │     │   Port: 8001    │               │
│  │   nginx:alpine  │     │   python:3.11   │               │
│  └─────────────────┘     └─────────────────┘               │
│                                  │                          │
│                                  │                          │
│                          ┌─────────────────┐               │
│                          │   Persistent    │               │
│                          │   Volumes       │               │
│                          │   - data/       │               │
│                          │   - uploads/    │               │
│                          │   - exports/    │               │
│                          └─────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

## Container Details

### Backend Container
- **Image**: python:3.11-slim
- **Port**: 8001
- **Volumes**: `./backend/data`, `./backend/uploads`, `./backend/exports`
- **Health Check**: `curl -f http://localhost:8001/api/health`
- **Resources**: CPU: 0.5, Memory: 512MB

### Frontend Container
- **Image**: nginx:alpine (multi-stage build)
- **Port**: 3000
- **Build**: React app built and served via nginx
- **Health Check**: `curl -f http://localhost:3000`
- **Resources**: CPU: 0.25, Memory: 256MB

## Production Deployment

### Using Production Compose

```bash
# Production deployment with persistent volumes
docker-compose -f docker-compose.prod.yml up -d

# With nginx reverse proxy
docker-compose -f docker-compose.prod.yml up -d nginx
```

### Environment Configuration

```bash
# Backend environment
PYTHONUNBUFFERED=1
ENVIRONMENT=production

# Frontend environment  
REACT_APP_BACKEND_URL=http://localhost:8001
NODE_ENV=production
```

## Management Commands

### Using Docker Setup Script

```bash
# Complete setup
./scripts/docker-setup.sh setup

# Build images
./scripts/docker-setup.sh build

# Start services
./scripts/docker-setup.sh start

# Stop services
./scripts/docker-setup.sh stop

# Restart services
./scripts/docker-setup.sh restart

# Check status
./scripts/docker-setup.sh status

# View logs
./scripts/docker-setup.sh logs

# Clean up
./scripts/docker-setup.sh cleanup
```

### Manual Docker Commands

```bash
# Build and start
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Scale services
docker-compose up -d --scale backend=2

# Update services
docker-compose pull && docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **Port conflicts**:
```bash
# Check port usage
netstat -tlnp | grep :8001
# Kill conflicting process
sudo kill -9 <PID>
```

2. **Permission issues**:
```bash
# Fix permissions
sudo chown -R $USER:$USER backend/data
sudo chown -R $USER:$USER backend/uploads
sudo chown -R $USER:$USER backend/exports
```

3. **Container startup failures**:
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild without cache
docker-compose build --no-cache
```

4. **Health check failures**:
```bash
# Test manually
docker-compose exec backend curl http://localhost:8001/api/health
docker-compose exec frontend curl http://localhost:3000
```

### Performance Optimization

```bash
# Resource limits
docker-compose up -d --scale backend=2
docker stats

# Volume optimization
docker volume create ai_d3js_data
docker volume create ai_d3js_uploads
```

## Security Considerations

### Production Security

1. **Environment variables**:
```bash
# Use .env file
cp .env.example .env
# Edit with production values
```

2. **Nginx security**:
```nginx
# Rate limiting configured
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

3. **SSL/TLS**:
```bash
# Place certificates in nginx/ssl/
# cert.pem and key.pem
# Uncomment HTTPS in nginx.conf
```

## Monitoring

### Health Checks

```bash
# Application health
curl http://localhost:8001/api/health

# Container health
docker-compose ps

# System resources
docker stats
```

### Logging

```bash
# Follow logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Export logs
docker-compose logs > application.log
```

## Backup & Recovery

### Data Backup

```bash
# Backup data volumes
docker run --rm -v ai_d3js_data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz /data

# Restore data
docker run --rm -v ai_d3js_data:/data -v $(pwd):/backup alpine tar xzf /backup/data-backup.tar.gz
```

### Configuration Backup

```bash
# Backup compose and configs
tar czf config-backup.tar.gz docker-compose*.yml nginx/ scripts/
```

## Scaling

### Horizontal Scaling

```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Load balancer setup
# Edit nginx/nginx.conf upstream configuration
```

### Vertical Scaling

```yaml
# Resource limits in docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
```

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy AI D3.js Tool Server

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and deploy
      run: |
        docker-compose build
        docker-compose up -d
        
    - name: Health check
      run: |
        sleep 30
        curl -f http://localhost:8001/api/health
```

## Support

### Getting Help

1. **Check logs first**:
```bash
docker-compose logs -f
```

2. **Verify configuration**:
```bash
docker-compose config
```

3. **Test components**:
```bash
# Test backend
curl http://localhost:8001/api/health

# Test frontend
curl http://localhost:3000
```

### Common Solutions

- **CORS issues**: Check `REACT_APP_BACKEND_URL` environment variable
- **File upload fails**: Verify volume permissions and nginx config
- **Charts not loading**: Check D3.js console errors and API connectivity
- **Performance issues**: Monitor resources with `docker stats`

---

**Docker Ready** 🐳 | **Production Ready** 🚀 | **AI Integrated** 🤖