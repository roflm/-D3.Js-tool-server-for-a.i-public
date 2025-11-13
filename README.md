# AI D3.js Tool Server - Self-Hosted Visualization Platform

A complete self-hosted solution for AI agents to create and display data visualizations using D3.js charts with CSV data storage.

## 🎯 Overview

This tool server provides:
- **AI-friendly REST APIs** for programmatic data creation and chart generation
- **Multiple D3.js visualizations** (Bar, Line, Scatter, Pie, Area, Network charts)
- **CSV-based data storage** (no database required)
- **Self-contained deployment** (all D3.js libraries bundled locally)
- **Interactive dashboard** for data management and visualization
- **🐳 Docker support** for easy containerized deployment

## 🚀 Quick Start

### 🐳 Docker Deployment (Recommended)

#### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

#### Option 1: One-Command Setup
```bash
# Clone or download the project
git clone <repository-url>
cd ai-d3js-tool-server

# Complete setup with Docker
./scripts/docker-setup.sh setup
```

#### Option 2: Manual Docker Steps
```bash
# 1. Build images
docker-compose build

# 2. Start services
docker-compose up -d

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f
```

#### Option 3: Production Deployment
```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d
```

### 🖥️ Local Development

#### Prerequisites
- Python 3.11+
- Node.js 16+
- Yarn package manager

#### Setup Steps
1. **Backend setup:**
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

2. **Frontend setup:**
```bash
cd frontend
yarn install
yarn start
```

3. **Alternative: Use startup script:**
```bash
./start_server.sh
```

### 🌐 Access Points

After deployment, access the application at:
- **📊 Dashboard**: http://localhost:3000
- **🔗 API Server**: http://localhost:8001
- **📚 API Docs**: http://localhost:8001/docs
- **🤖 AI Integration Docs**: http://localhost:8001/api/docs/ai

## 🐳 Docker Management

### Using Docker Setup Script

```bash
# Complete setup (recommended for first-time)
./scripts/docker-setup.sh setup

# Individual operations
./scripts/docker-setup.sh build     # Build images
./scripts/docker-setup.sh start     # Start services
./scripts/docker-setup.sh stop      # Stop services
./scripts/docker-setup.sh restart   # Restart services
./scripts/docker-setup.sh status    # Check status
./scripts/docker-setup.sh logs      # View logs
./scripts/docker-setup.sh cleanup   # Clean up everything
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

# Check health
docker-compose exec backend curl http://localhost:8001/api/health
docker-compose exec frontend curl http://localhost:3000

# Scale services (if needed)
docker-compose up -d --scale backend=2

# Update images
docker-compose pull
docker-compose up -d
```

### Docker Compose Files

- **`docker-compose.yml`**: Development setup with local volumes
- **`docker-compose.prod.yml`**: Production setup with persistent volumes and nginx proxy
- **`nginx/nginx.conf`**: Production nginx configuration with rate limiting and SSL support

## 🤖 AI Integration

### Core API Endpoints

#### 1. Create Sales Data
```bash
curl -X POST "http://localhost:8001/api/ai/create-sales-data" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "q4_sales_2024",
    "description": "Q4 sales data",
    "data": [
      {"month": "Jan", "sales": 10000, "expenses": 5000},
      {"month": "Feb", "sales": 12000, "expenses": 6000},
      {"month": "Mar", "sales": 15000, "expenses": 7000}
    ]
  }'
```

#### 2. Upload CSV File
```bash
curl -X POST "http://localhost:8001/api/ai/upload-csv" \
  -F "file=@data.csv" \
  -F "dataset_name=my_dataset"
```

#### 3. Generate Chart
```bash
curl -X POST "http://localhost:8001/api/ai/generate-chart" \
  -H "Content-Type: application/json" \
  -d '{
    "chart_type": "bar",
    "dataset_name": "sales_data",
    "title": "Sales Performance",
    "width": 600,
    "height": 400
  }'
```

#### 4. List Datasets
```bash
curl "http://localhost:8001/api/ai/datasets"
```

#### 5. Health Check
```bash
curl "http://localhost:8001/api/health"
```

### Python Integration Example

```python
import requests
import pandas as pd

# Configuration
BASE_URL = "http://localhost:8001/api"

# Create dataset
sales_data = {
    "name": "monthly_sales",
    "description": "Monthly sales analysis",
    "data": [
        {"month": "Jan", "sales": 15000, "expenses": 8000},
        {"month": "Feb", "sales": 18000, "expenses": 9000},
        {"month": "Mar", "sales": 22000, "expenses": 11000}
    ]
}

# Send data to API
response = requests.post(f"{BASE_URL}/ai/create-sales-data", json=sales_data)
result = response.json()
print(f"Dataset created: {result['message']}")

# Generate chart
chart_config = {
    "chart_type": "bar",
    "dataset_name": "monthly_sales",
    "title": "Monthly Sales Performance",
    "width": 600,
    "height": 400
}

chart_response = requests.post(f"{BASE_URL}/ai/generate-chart", json=chart_config)
chart_result = chart_response.json()
print(f"Chart URL: {chart_result['chart_url']}")

# List all datasets
datasets_response = requests.get(f"{BASE_URL}/ai/datasets")
datasets = datasets_response.json()
print(f"Available datasets: {len(datasets['data']['datasets'])}")
```

## 📊 Supported Chart Types

- **📊 Bar Chart** (`bar`) - Compare categories and values
- **📈 Line Chart** (`line`) - Show trends over time
- **🔸 Scatter Plot** (`scatter`) - Display correlations between variables
- **🥧 Pie Chart** (`pie`) - Show proportions and percentages
- **📉 Area Chart** (`area`) - Stacked time series data
- **🕸️ Network Graph** (`network`) - Relationship visualizations

## 📁 Data Management

### CSV Format Examples

**Sales Data:**
```csv
month,sales,expenses
Jan,10000,6000
Feb,12000,7000
Mar,15000,8000
```

**Time Series Data:**
```csv
date,visitors,page_views,conversions
2024-01-01,150,450,15
2024-01-02,180,540,22
2024-01-03,165,495,18
```

### Data Storage Structure (Docker)
```
├── backend/
│   ├── data/              # CSV datasets (persistent volume)
│   ├── uploads/           # Uploaded files (persistent volume)
│   └── exports/           # Generated charts (persistent volume)
└── frontend/
    └── build/             # Static React build
```

## 🔧 Configuration

### Environment Variables

**Backend:**
```env
PYTHONUNBUFFERED=1
ENVIRONMENT=production  # Optional
```

**Frontend:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
NODE_ENV=production
```

**Docker Compose Override:**
```yaml
# docker-compose.override.yml
version: '3.8'
services:
  backend:
    environment:
      - CUSTOM_ENV_VAR=value
    ports:
      - "8002:8001"  # Custom port mapping
```

## 🛡️ Production Deployment

### Docker Production Setup

1. **Use production compose file:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

2. **Enable nginx proxy (optional):**
```bash
# Edit docker-compose.prod.yml to uncomment nginx service
docker-compose -f docker-compose.prod.yml up -d nginx
```

3. **Configure SSL (optional):**
```bash
# Place SSL certificates in nginx/ssl/
# cert.pem and key.pem
# Uncomment HTTPS server block in nginx/nginx.conf
```

### Security Considerations

- **Rate Limiting**: Configured in nginx.conf (10 req/s for API, 5 req/s for uploads)
- **File Upload Limits**: 50MB max file size
- **CORS**: Configured for localhost by default
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **API Authentication**: Add JWT or API key middleware as needed

### Monitoring & Health Checks

```bash
# Container health
docker-compose ps

# Application health
curl http://localhost:8001/api/health

# Resource usage
docker stats

# Logs
docker-compose logs -f --tail=100
```

## 🔍 Troubleshooting

### Common Docker Issues

1. **Port conflicts:**
```bash
# Check port usage
netstat -tulpn | grep :8001
# Kill conflicting process
sudo kill -9 <PID>
```

2. **Permission issues:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER backend/data
sudo chown -R $USER:$USER backend/uploads
```

3. **Container won't start:**
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild images
docker-compose build --no-cache
```

4. **Health check failures:**
```bash
# Check container status
docker-compose ps

# Test endpoints manually
docker-compose exec backend curl http://localhost:8001/api/health
```

### Development Issues

1. **CORS errors:**
```bash
# Check backend environment
curl http://localhost:8001/api/health

# Verify frontend env
cat frontend/.env
```

2. **File upload issues:**
```bash
# Check backend logs
docker-compose logs -f backend

# Verify file permissions
ls -la backend/uploads/
```

## 🚀 Scaling & Performance

### Horizontal Scaling

```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Load balance with nginx
# Edit nginx/nginx.conf upstream configuration
```

### Performance Optimization

1. **Resource limits:**
```yaml
# In docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

2. **Volume optimization:**
```bash
# Use named volumes for better performance
docker volume create ai_d3js_data
```

3. **Image optimization:**
```bash
# Multi-stage builds are already configured
# Images are optimized for production
```

## 📚 API Reference

### Health Endpoints
- `GET /api/health` - System health check
- `GET /health` - Nginx health check (production)

### AI Integration Endpoints
- `POST /api/ai/create-sales-data` - Create datasets programmatically
- `POST /api/ai/upload-csv` - Upload CSV files
- `POST /api/ai/generate-chart` - Generate charts
- `GET /api/ai/datasets` - List datasets (AI-friendly format)

### Data Access Endpoints
- `GET /api/data/{dataset_name}` - Get dataset data
- `GET /api/datasets` - List all datasets with metadata
- `GET /api/charts/{chart_id}` - Get generated chart configuration

### Documentation Endpoints
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - ReDoc API documentation
- `GET /api/docs/ai` - AI integration documentation

## 🤝 Contributing

### Development Setup

```bash
# Fork the repository
git clone <your-fork>
cd ai-d3js-tool-server

# Local development
./scripts/docker-setup.sh setup

# Make changes and test
docker-compose restart

# Submit pull request
```

### Adding New Features

1. **New chart types**: Extend D3.js components in `frontend/src/components/`
2. **New data formats**: Modify Pydantic models in `backend/server.py`
3. **Authentication**: Add middleware in FastAPI
4. **New endpoints**: Follow existing patterns in `backend/server.py`

## 📄 License

Open source - modify and distribute as needed for your AI projects.

---

## 🎯 Quick Reference

### Docker Commands
```bash
# Full setup
./scripts/docker-setup.sh setup

# Start/stop
docker-compose up -d
docker-compose down

# View logs
docker-compose logs -f

# Health check
curl http://localhost:8001/api/health
```

### AI Integration
```bash
# Create data
curl -X POST "http://localhost:8001/api/ai/create-sales-data" -H "Content-Type: application/json" -d '{"name": "test", "data": [{"month": "Jan", "sales": 1000, "expenses": 500}]}'

# Generate chart
curl -X POST "http://localhost:8001/api/ai/generate-chart" -H "Content-Type: application/json" -d '{"chart_type": "bar", "dataset_name": "test", "title": "Test Chart"}'
```

### Access Points
- **Dashboard**: http://localhost:3000
- **API**: http://localhost:8001
- **Docs**: http://localhost:8001/docs

---

**Built for AI Agents** 🤖 | **Self-Hosted** 🏠 | **Docker Ready** 🐳 | **D3.js Powered** 📊