import { useState } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const APIDocumentation = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: '📋 Overview', icon: '📋' },
    { id: 'ai-endpoints', label: '🤖 AI Endpoints', icon: '🤖' },
    { id: 'data-endpoints', label: '📊 Data Endpoints', icon: '📊' },
    { id: 'examples', label: '💡 Examples', icon: '💡' },
    { id: 'deployment', label: '🚀 Deployment', icon: '🚀' }
  ];

  const endpoints = [
    {
      method: 'POST',
      path: '/api/ai/create-sales-data',
      description: 'Create sales datasets programmatically',
      example: `{
  "name": "q4_sales_2024",
  "description": "Q4 sales data",
  "data": [
    {"month": "Jan", "sales": 10000, "expenses": 5000},
    {"month": "Feb", "sales": 12000, "expenses": 6000}
  ]
}`
    },
    {
      method: 'POST',
      path: '/api/ai/upload-csv',
      description: 'Upload CSV files for visualization',
      example: `curl -X POST "${BACKEND_URL}/api/ai/upload-csv" \\
  -F "file=@data.csv" \\
  -F "dataset_name=my_dataset"`
    },
    {
      method: 'POST',
      path: '/api/ai/generate-chart',
      description: 'Generate charts programmatically',
      example: `{
  "chart_type": "bar",
  "dataset_name": "sales_data",
  "title": "Monthly Sales",
  "width": 500,
  "height": 300
}`
    },
    {
      method: 'GET',
      path: '/api/ai/datasets',
      description: 'List all available datasets',
      example: `curl "${BACKEND_URL}/api/ai/datasets"`
    }
  ];

  const dataEndpoints = [
    {
      method: 'GET',
      path: '/api/data/{dataset_name}',
      description: 'Get data for any dataset',
      example: `curl "${BACKEND_URL}/api/data/sales_data"`
    },
    {
      method: 'GET',
      path: '/api/datasets',
      description: 'List datasets with metadata',
      example: `curl "${BACKEND_URL}/api/datasets"`
    },
    {
      method: 'GET',
      path: '/api/health',
      description: 'Health check endpoint',
      example: `curl "${BACKEND_URL}/api/health"`
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Navigation */}
      <div className="mb-6 border-b">
        <nav className="flex space-x-8">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 API Overview</h2>
            <p className="text-gray-600 mb-4">
              The AI D3.js Tool Server provides a comprehensive REST API for creating, managing, and visualizing data using D3.js charts. 
              It's designed specifically for AI agents and automated systems to generate data visualizations programmatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🎯 Key Features</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• RESTful API for data management</li>
                <li>• CSV-based data storage</li>
                <li>• Multiple chart types (Bar, Line, Scatter, Pie, Area)</li>
                <li>• Programmatic chart generation</li>
                <li>• File upload support</li>
                <li>• AI-friendly response formats</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">🛠️ Tech Stack</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Backend: FastAPI + Pandas</li>
                <li>• Frontend: React + D3.js</li>
                <li>• Data: CSV files</li>
                <li>• Charts: D3.js visualizations</li>
                <li>• Self-hosted (no external dependencies)</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">🔗 Base URLs</h3>
            <div className="space-y-2 text-sm">
              <div>API Server: <code className="bg-gray-200 px-2 py-1 rounded">{BACKEND_URL}</code></div>
              <div>Dashboard: <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:3000</code></div>
              <div>Health Check: <code className="bg-gray-200 px-2 py-1 rounded">{BACKEND_URL}/api/health</code></div>
            </div>
          </div>
        </div>
      )}

      {/* AI Endpoints Section */}
      {activeSection === 'ai-endpoints' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🤖 AI Integration Endpoints</h2>
          
          {endpoints.map((endpoint, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-gray-800">{endpoint.path}</code>
              </div>
              
              <p className="text-gray-600 mb-3">{endpoint.description}</p>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs font-medium text-gray-700 mb-1">Example:</div>
                <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                  {endpoint.example}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Endpoints Section */}
      {activeSection === 'data-endpoints' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Data Access Endpoints</h2>
          
          {dataEndpoints.map((endpoint, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-gray-800">{endpoint.path}</code>
              </div>
              
              <p className="text-gray-600 mb-3">{endpoint.description}</p>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs font-medium text-gray-700 mb-1">Example:</div>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {endpoint.example}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Examples Section */}
      {activeSection === 'examples' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Usage Examples</h2>
          
          <div className="space-y-6">
            
            {/* Python Example */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">🐍 Python Integration</h3>
              <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`import requests
import pandas as pd

# Base URL
BASE_URL = "${BACKEND_URL}/api"

# Create sales data
sales_data = {
    "name": "monthly_sales_2024",
    "description": "Monthly sales data for 2024",
    "data": [
        {"month": "Jan", "sales": 15000, "expenses": 8000},
        {"month": "Feb", "sales": 18000, "expenses": 9000},
        {"month": "Mar", "sales": 22000, "expenses": 11000}
    ]
}

response = requests.post(f"{BASE_URL}/ai/create-sales-data", json=sales_data)
result = response.json()
print(f"Dataset created: {result['message']}")

# Generate a chart
chart_config = {
    "chart_type": "bar",
    "dataset_name": "monthly_sales_2024",
    "title": "Monthly Sales Performance",
    "width": 600,
    "height": 400
}

chart_response = requests.post(f"{BASE_URL}/ai/generate-chart", json=chart_config)
chart_result = chart_response.json()
print(f"Chart URL: {chart_result['chart_url']}")
`}
              </pre>
            </div>

            {/* JavaScript Example */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">🟨 JavaScript Integration</h3>
              <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`// Using fetch API
const BASE_URL = "${BACKEND_URL}/api";

// Upload CSV file
async function uploadCSV(file, datasetName) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('dataset_name', datasetName);
  
  const response = await fetch(\`\${BASE_URL}/ai/upload-csv\`, {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
}

// Generate chart
async function generateChart(config) {
  const response = await fetch(\`\${BASE_URL}/ai/generate-chart\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  
  return await response.json();
}

// Usage
const chartConfig = {
  chart_type: "line",
  dataset_name: "sales_data",
  title: "Sales Trend Analysis"
};

generateChart(chartConfig).then(result => {
  console.log('Chart generated:', result.chart_url);
});`}
              </pre>
            </div>

            {/* AI Agent Example */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">🤖 AI Agent Workflow</h3>
              <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`# Example AI Agent Workflow

1. Check server health:
   GET ${BACKEND_URL}/api/health

2. List available datasets:
   GET ${BACKEND_URL}/api/ai/datasets

3. Create new sales data:
   POST ${BACKEND_URL}/api/ai/create-sales-data
   {
     "name": "q1_performance",
     "data": [
       {"month": "Jan", "sales": 25000, "expenses": 12000},
       {"month": "Feb", "sales": 28000, "expenses": 13000},
       {"month": "Mar", "sales": 32000, "expenses": 15000}
     ]
   }

4. Generate visualization:
   POST ${BACKEND_URL}/api/ai/generate-chart
   {
     "chart_type": "bar",
     "dataset_name": "q1_performance",
     "title": "Q1 Performance Analysis"
   }

5. Access generated chart:
   GET {chart_url} # From step 4 response
`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Section */}
      {activeSection === 'deployment' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Self-Hosting & Deployment</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Local Development */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">💻 Local Development</h3>
              <pre className="bg-gray-50 p-3 rounded text-sm">
{`# Backend (FastAPI)
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001

# Frontend (React)
cd frontend
yarn install
yarn start

# Access
Dashboard: http://localhost:3000
API: http://localhost:8001`}
              </pre>
            </div>

            {/* Docker Deployment */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">🐳 Docker Deployment</h3>
              <pre className="bg-gray-50 p-3 rounded text-sm">
{`# Create Dockerfile for backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]

# Run with Docker
docker build -t ai-d3js-server .
docker run -p 8001:8001 ai-d3js-server`}
              </pre>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Production Considerations</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Add authentication for AI API endpoints</li>
              <li>• Implement rate limiting for data uploads</li>
              <li>• Set up file size limits for CSV uploads</li>
              <li>• Configure CORS for specific domains</li>
              <li>• Add data validation and sanitization</li>
              <li>• Set up monitoring and logging</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">✅ Self-Hosted Benefits</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Complete data privacy and control</li>
              <li>• No external API dependencies</li>
              <li>• Customizable for specific needs</li>
              <li>• Offline operation capability</li>
              <li>• Cost-effective for high-volume usage</li>
              <li>• Full D3.js library included locally</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIDocumentation;