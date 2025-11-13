#!/bin/bash

# AI D3.js Tool Server - Self-Hosted Startup Script
# This script starts both backend and frontend servers for local development

echo "🚀 Starting AI D3.js Tool Server..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1
    else
        return 0
    fi
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check Yarn
if ! command -v yarn &> /dev/null; then
    echo -e "${RED}❌ Yarn is not installed${NC}"
    echo -e "${YELLOW}💡 Install with: npm install -g yarn${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites satisfied${NC}"

# Check ports
echo -e "${BLUE}🔍 Checking ports...${NC}"

if ! check_port 8001; then
    echo -e "${RED}❌ Port 8001 is already in use (Backend)${NC}"
    echo -e "${YELLOW}💡 Stop the process using: lsof -ti:8001 | xargs kill -9${NC}"
    exit 1
fi

if ! check_port 3000; then
    echo -e "${RED}❌ Port 3000 is already in use (Frontend)${NC}"
    echo -e "${YELLOW}💡 Stop the process using: lsof -ti:3000 | xargs kill -9${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Ports 8001 and 3000 are available${NC}"

# Install backend dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}🔧 Creating virtual environment...${NC}"
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd ../frontend
yarn install > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

# Start backend server
echo -e "${BLUE}🖥️  Starting backend server on port 8001...${NC}"
cd ../backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}❌ Failed to start backend server${NC}"
    exit 1
fi

# Start frontend server
echo -e "${BLUE}🌐 Starting frontend server on port 3000...${NC}"
cd ../frontend
yarn start &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${RED}❌ Failed to start frontend server${NC}"
    kill $BACKEND_PID
    exit 1
fi

# Display success message
echo ""
echo -e "${GREEN}🎉 AI D3.js Tool Server is now running!${NC}"
echo ""
echo -e "${BLUE}📊 Dashboard:${NC}     http://localhost:3000"
echo -e "${BLUE}🔗 API Server:${NC}    http://localhost:8001"
echo -e "${BLUE}📚 API Docs:${NC}      http://localhost:8001/docs"
echo -e "${BLUE}🤖 AI Docs:${NC}       http://localhost:8001/api/docs/ai"
echo ""
echo -e "${YELLOW}💡 Server PIDs:${NC}"
echo -e "   Backend:  $BACKEND_PID"
echo -e "   Frontend: $FRONTEND_PID"
echo ""
echo -e "${YELLOW}🛑 To stop servers:${NC}"
echo -e "   kill $BACKEND_PID $FRONTEND_PID"
echo -e "   or use Ctrl+C"
echo ""

# Create a stop script
cat > stop_servers.sh << EOF
#!/bin/bash
echo "🛑 Stopping AI D3.js Tool Server..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo "✅ Servers stopped"
rm -f stop_servers.sh
EOF

chmod +x stop_servers.sh
echo -e "${BLUE}📝 Created stop_servers.sh for easy shutdown${NC}"

# Wait for user input to keep script running
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers...${NC}"

# Trap Ctrl+C to clean up
trap 'echo -e "\n🛑 Shutting down servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✅ Servers stopped"; exit 0' INT

# Keep script running
wait