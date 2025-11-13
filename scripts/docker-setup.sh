#!/bin/bash

# AI D3.js Tool Server - Docker Setup Script
# This script helps with Docker deployment and management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 AI D3.js Tool Server - Docker Setup${NC}"

# Function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        echo -e "${YELLOW}💡 Please install Docker: https://docs.docker.com/get-docker/${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is not installed${NC}"
        echo -e "${YELLOW}💡 Please install Docker Compose: https://docs.docker.com/compose/install/${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
}

# Function to create necessary directories
create_directories() {
    echo -e "${BLUE}📁 Creating necessary directories...${NC}"
    
    mkdir -p backend/data
    mkdir -p backend/uploads
    mkdir -p backend/exports
    
    # Create .gitkeep files
    touch backend/data/.gitkeep
    touch backend/uploads/.gitkeep
    touch backend/exports/.gitkeep
    
    echo -e "${GREEN}✅ Directories created${NC}"
}

# Function to build Docker images
build_images() {
    echo -e "${BLUE}🔨 Building Docker images...${NC}"
    
    docker-compose build --no-cache
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Docker images built successfully${NC}"
    else
        echo -e "${RED}❌ Failed to build Docker images${NC}"
        exit 1
    fi
}

# Function to start services
start_services() {
    echo -e "${BLUE}🚀 Starting services...${NC}"
    
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Services started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start services${NC}"
        exit 1
    fi
}

# Function to check service health
check_health() {
    echo -e "${BLUE}🏥 Checking service health...${NC}"
    
    # Wait for services to start
    sleep 10
    
    # Check backend health
    if curl -f http://localhost:8001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is healthy${NC}"
    else
        echo -e "${RED}❌ Frontend health check failed${NC}"
    fi
}

# Function to show running containers
show_status() {
    echo -e "${BLUE}📊 Container Status:${NC}"
    docker-compose ps
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📋 Recent Logs:${NC}"
    docker-compose logs --tail=20
}

# Function to stop services
stop_services() {
    echo -e "${BLUE}🛑 Stopping services...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Services stopped${NC}"
}

# Function to cleanup
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    docker-compose down -v
    docker system prune -f
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Main menu
case "${1:-}" in
    "build")
        check_docker
        create_directories
        build_images
        ;;
    "start")
        check_docker
        start_services
        check_health
        show_status
        ;;
    "stop")
        check_docker
        stop_services
        ;;
    "restart")
        check_docker
        stop_services
        start_services
        check_health
        ;;
    "status")
        check_docker
        show_status
        ;;
    "logs")
        check_docker
        show_logs
        ;;
    "cleanup")
        check_docker
        cleanup
        ;;
    "setup")
        check_docker
        create_directories
        build_images
        start_services
        check_health
        show_status
        ;;
    *)
        echo -e "${YELLOW}Usage: $0 {build|start|stop|restart|status|logs|cleanup|setup}${NC}"
        echo ""
        echo -e "${BLUE}Commands:${NC}"
        echo -e "  setup     - Complete setup (build + start + health check)"
        echo -e "  build     - Build Docker images"
        echo -e "  start     - Start services"
        echo -e "  stop      - Stop services"
        echo -e "  restart   - Restart services"
        echo -e "  status    - Show container status"
        echo -e "  logs      - Show recent logs"
        echo -e "  cleanup   - Stop services and clean up"
        echo ""
        echo -e "${BLUE}Examples:${NC}"
        echo -e "  $0 setup      # First-time setup"
        echo -e "  $0 start      # Start services"
        echo -e "  $0 logs       # View logs"
        echo -e "  $0 stop       # Stop services"
        exit 1
        ;;
esac

if [ "${1:-}" = "setup" ]; then
    echo ""
    echo -e "${GREEN}🎉 AI D3.js Tool Server is now running!${NC}"
    echo ""
    echo -e "${BLUE}📊 Dashboard:${NC}     http://localhost:3000"
    echo -e "${BLUE}🔗 API Server:${NC}    http://localhost:8001"
    echo -e "${BLUE}📚 API Docs:${NC}      http://localhost:8001/docs"
    echo -e "${BLUE}🤖 AI Docs:${NC}       http://localhost:8001/api/docs/ai"
    echo ""
    echo -e "${YELLOW}🔧 Management:${NC}"
    echo -e "  $0 status     # Check container status"
    echo -e "  $0 logs       # View logs"
    echo -e "  $0 stop       # Stop services"
    echo ""
fi