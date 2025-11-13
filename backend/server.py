from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import pandas as pd
import json
import io
import base64
from pathlib import Path
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime
from pydantic import BaseModel, Field

ROOT_DIR = Path(__file__).parent

# Create the main app
app = FastAPI(
    title="AI D3.js Tool Server", 
    description="Self-hosted AI tool server for creating and displaying sales data visualizations using D3.js",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Create directories
csv_dir = ROOT_DIR / "data"
csv_dir.mkdir(exist_ok=True)

uploads_dir = ROOT_DIR / "uploads"
uploads_dir.mkdir(exist_ok=True)

exports_dir = ROOT_DIR / "exports"
exports_dir.mkdir(exist_ok=True)

# Pydantic models for AI integration
class SalesDataPoint(BaseModel):
    month: str
    sales: float
    expenses: Optional[float] = 0
    profit: Optional[float] = None

class SalesDataset(BaseModel):
    name: str
    description: Optional[str] = ""
    data: List[SalesDataPoint]

class UserDataPoint(BaseModel):
    age: int
    income: float
    satisfaction: float
    category: Optional[str] = "General"

class CategoryDataPoint(BaseModel):
    category: str
    value: float
    color: Optional[str] = "#4F46E5"

class TimeSeriesDataPoint(BaseModel):
    date: str  # YYYY-MM-DD format
    visitors: int
    page_views: int
    conversions: int

class ChartConfig(BaseModel):
    chart_type: str  # "bar", "line", "scatter", "pie", "area", "network"
    dataset_name: str
    title: Optional[str] = ""
    width: Optional[int] = 500
    height: Optional[int] = 300
    export_format: Optional[str] = "json"  # "json", "png", "svg"

class AIToolResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    chart_url: Optional[str] = None
    export_url: Optional[str] = None

# Create comprehensive sample data
def create_sample_data():
    # Enhanced sales data
    sales_data = {
        'month': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'sales': [12000, 19000, 13000, 25000, 22000, 30000, 28000, 32000, 27000, 35000, 40000, 38000],
        'expenses': [8000, 12000, 9000, 15000, 14000, 18000, 16000, 19000, 15000, 20000, 24000, 22000],
        'profit': [4000, 7000, 4000, 10000, 8000, 12000, 12000, 13000, 12000, 15000, 16000, 16000]
    }
    pd.DataFrame(sales_data).to_csv(csv_dir / "sales_data.csv", index=False)
    
    # Quarterly sales data
    quarterly_data = {
        'quarter': ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
        'sales': [44000, 77000, 87000, 113000],
        'expenses': [29000, 47000, 50000, 66000],
        'profit': [15000, 30000, 37000, 47000]
    }
    pd.DataFrame(quarterly_data).to_csv(csv_dir / "quarterly_sales.csv", index=False)
    
    # Product performance data
    product_data = {
        'product': ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
        'sales': [85000, 65000, 45000, 35000, 25000],
        'units_sold': [850, 1300, 750, 500, 400],
        'profit_margin': [0.35, 0.28, 0.42, 0.31, 0.38]
    }
    pd.DataFrame(product_data).to_csv(csv_dir / "product_performance.csv", index=False)
    
    # Keep existing datasets
    user_data = {
        'age': [23, 45, 56, 78, 32, 24, 35, 67, 29, 45, 39, 52, 28, 33, 41, 59, 26, 37, 48, 55],
        'income': [35000, 65000, 80000, 45000, 55000, 38000, 62000, 70000, 42000, 68000, 58000, 75000, 
                  40000, 51000, 64000, 82000, 36000, 59000, 71000, 77000],
        'satisfaction': [7.2, 8.1, 6.8, 7.9, 8.4, 6.9, 7.6, 8.2, 7.1, 8.0, 7.8, 8.3, 6.7, 7.4, 8.1, 7.7, 7.0, 8.2, 7.9, 8.0]
    }
    pd.DataFrame(user_data).to_csv(csv_dir / "user_data.csv", index=False)
    
    category_data = {
        'category': ['Technology', 'Healthcare', 'Finance', 'Education', 'Entertainment', 'Retail'],
        'value': [350, 280, 220, 180, 160, 140],
        'color': ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd']
    }
    pd.DataFrame(category_data).to_csv(csv_dir / "category_data.csv", index=False)
    
    dates = pd.date_range('2024-01-01', periods=50, freq='D')
    time_data = {
        'date': dates.strftime('%Y-%m-%d'),
        'visitors': [100 + i*5 + (i%7)*20 for i in range(50)],
        'page_views': [300 + i*15 + (i%5)*50 for i in range(50)],
        'conversions': [10 + i*2 + (i%3)*8 for i in range(50)]
    }
    pd.DataFrame(time_data).to_csv(csv_dir / "time_series_data.csv", index=False)

# Initialize sample data
create_sample_data()

# AI Tool Endpoints
@api_router.post("/ai/create-sales-data", response_model=AIToolResponse)
async def create_sales_data(dataset: SalesDataset):
    """AI endpoint to create sales data programmatically"""
    try:
        # Process the data
        data_records = []
        for point in dataset.data:
            record = {
                'month': point.month,
                'sales': point.sales,
                'expenses': point.expenses or 0
            }
            if point.profit is not None:
                record['profit'] = point.profit
            else:
                record['profit'] = point.sales - (point.expenses or 0)
            data_records.append(record)
        
        # Save to CSV
        df = pd.DataFrame(data_records)
        filename = f"{dataset.name.replace(' ', '_').lower()}.csv"
        df.to_csv(csv_dir / filename, index=False)
        
        return AIToolResponse(
            success=True,
            message=f"Sales dataset '{dataset.name}' created successfully",
            data={
                "filename": filename,
                "records": len(data_records),
                "api_endpoint": f"/api/data/{dataset.name.replace(' ', '_').lower()}"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ai/upload-csv", response_model=AIToolResponse)
async def upload_csv_data(file: UploadFile = File(...), dataset_name: str = Form(...)):
    """AI endpoint to upload CSV data files"""
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are allowed")
        
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        
        # Save the file
        filename = f"{dataset_name.replace(' ', '_').lower()}.csv"
        df.to_csv(csv_dir / filename, index=False)
        
        return AIToolResponse(
            success=True,
            message=f"CSV file uploaded as '{dataset_name}'",
            data={
                "filename": filename,
                "rows": len(df),
                "columns": list(df.columns),
                "sample": df.head(3).to_dict('records'),
                "api_endpoint": f"/api/data/{dataset_name.replace(' ', '_').lower()}"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ai/generate-chart", response_model=AIToolResponse)
async def generate_chart(config: ChartConfig):
    """AI endpoint to generate charts programmatically"""
    try:
        # Check if dataset exists
        dataset_file = csv_dir / f"{config.dataset_name}.csv"
        if not dataset_file.exists():
            raise HTTPException(status_code=404, detail=f"Dataset {config.dataset_name} not found")
        
        # Load data
        df = pd.read_csv(dataset_file)
        chart_data = df.to_dict('records')
        
        # Generate chart configuration
        chart_config = {
            "type": config.chart_type,
            "data": chart_data,
            "title": config.title or f"{config.chart_type.title()} Chart - {config.dataset_name}",
            "width": config.width,
            "height": config.height
        }
        
        # Save chart config for frontend
        chart_id = str(uuid.uuid4())
        chart_file = exports_dir / f"chart_{chart_id}.json"
        with open(chart_file, 'w') as f:
            json.dump(chart_config, f)
        
        return AIToolResponse(
            success=True,
            message=f"Chart generated successfully",
            data=chart_config,
            chart_url=f"/api/charts/{chart_id}",
            export_url=f"/api/exports/chart_{chart_id}.json"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/ai/datasets", response_model=AIToolResponse)
async def list_datasets_for_ai():
    """AI endpoint to list all available datasets"""
    try:
        datasets = []
        for csv_file in csv_dir.glob("*.csv"):
            df = pd.read_csv(csv_file)
            datasets.append({
                "name": csv_file.stem,
                "filename": csv_file.name,
                "rows": len(df),
                "columns": list(df.columns),
                "sample": df.head(2).to_dict('records'),
                "api_endpoint": f"/api/data/{csv_file.stem}"
            })
        
        return AIToolResponse(
            success=True,
            message=f"Found {len(datasets)} datasets",
            data={"datasets": datasets}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Original endpoints (enhanced)
@api_router.get("/")
async def root():
    return {
        "message": "AI D3.js Tool Server",
        "version": "1.0.0",
        "ai_endpoints": [
            "/api/ai/create-sales-data",
            "/api/ai/upload-csv", 
            "/api/ai/generate-chart",
            "/api/ai/datasets"
        ],
        "data_endpoints": [
            "/api/data/sales_data", "/api/data/quarterly_sales", "/api/data/product_performance",
            "/api/data/user_data", "/api/data/category_data", "/api/data/time_series_data"
        ],
        "chart_endpoints": ["/api/charts/{chart_id}"],
        "utility_endpoints": ["/api/datasets", "/api/health"]
    }

@api_router.get("/health")
async def health_check():
    """Health check endpoint for AI monitoring"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "datasets_count": len(list(csv_dir.glob("*.csv"))),
        "server": "AI D3.js Tool Server"
    }

@api_router.get("/datasets")
async def get_available_datasets():
    """Enhanced datasets endpoint"""
    datasets = []
    for csv_file in csv_dir.glob("*.csv"):
        df = pd.read_csv(csv_file)
        datasets.append({
            "name": csv_file.stem,
            "filename": csv_file.name,
            "rows": len(df),
            "columns": list(df.columns),
            "sample": df.head(3).to_dict('records'),
            "chart_types": get_recommended_charts(df)
        })
    return {"datasets": datasets}

def get_recommended_charts(df):
    """Recommend chart types based on data structure"""
    recommendations = []
    columns = df.columns.tolist()
    
    if any(col in ['month', 'quarter', 'date'] for col in columns):
        recommendations.extend(['line', 'area', 'bar'])
    if any(col in ['category', 'product', 'type'] for col in columns):
        recommendations.extend(['pie', 'bar'])
    if len([col for col in columns if df[col].dtype in ['int64', 'float64']]) >= 2:
        recommendations.append('scatter')
    
    return list(set(recommendations)) or ['bar']

# Data endpoints
@api_router.get("/data/{dataset_name}")
async def get_dataset(dataset_name: str):
    """Enhanced data endpoint with error handling"""
    try:
        csv_file = csv_dir / f"{dataset_name}.csv"
        if not csv_file.exists():
            raise HTTPException(status_code=404, detail=f"Dataset {dataset_name} not found")
        df = pd.read_csv(csv_file)
        return {
            "data": df.to_dict('records'),
            "metadata": {
                "rows": len(df),
                "columns": list(df.columns),
                "recommended_charts": get_recommended_charts(df)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chart serving endpoint
@api_router.get("/charts/{chart_id}")
async def get_chart(chart_id: str):
    """Serve generated charts"""
    try:
        chart_file = exports_dir / f"chart_{chart_id}.json"
        if not chart_file.exists():
            raise HTTPException(status_code=404, detail=f"Chart {chart_id} not found")
        
        with open(chart_file, 'r') as f:
            chart_config = json.load(f)
        
        return chart_config
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Export endpoint
@api_router.get("/exports/{filename}")
async def download_export(filename: str):
    """Download exported files"""
    file_path = exports_dir / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

# API Documentation endpoint
@api_router.get("/docs/ai", response_class=HTMLResponse)
async def ai_documentation():
    """AI Integration Documentation"""
    docs_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>AI D3.js Tool Server - Documentation</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { background: #007bff; color: white; padding: 5px 10px; border-radius: 3px; }
            code { background: #e9ecef; padding: 2px 4px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <h1>AI D3.js Tool Server - API Documentation</h1>
        
        <h2>AI Integration Endpoints</h2>
        
        <div class="endpoint">
            <h3><span class="method">POST</span> /api/ai/create-sales-data</h3>
            <p>Create sales datasets programmatically</p>
            <code>curl -X POST "http://localhost:8001/api/ai/create-sales-data" -H "Content-Type: application/json" -d '{"name": "my_sales", "data": [{"month": "Jan", "sales": 10000, "expenses": 5000}]}'</code>
        </div>
        
        <div class="endpoint">
            <h3><span class="method">POST</span> /api/ai/upload-csv</h3>
            <p>Upload CSV files</p>
            <code>curl -X POST "http://localhost:8001/api/ai/upload-csv" -F "file=@data.csv" -F "dataset_name=my_dataset"</code>
        </div>
        
        <div class="endpoint">
            <h3><span class="method">POST</span> /api/ai/generate-chart</h3>
            <p>Generate charts programmatically</p>
            <code>curl -X POST "http://localhost:8001/api/ai/generate-chart" -H "Content-Type: application/json" -d '{"chart_type": "bar", "dataset_name": "sales_data", "title": "Sales Chart"}'</code>
        </div>
        
        <div class="endpoint">
            <h3><span class="method">GET</span> /api/ai/datasets</h3>
            <p>List all datasets</p>
            <code>curl "http://localhost:8001/api/ai/datasets"</code>
        </div>
        
        <h2>Data Endpoints</h2>
        <div class="endpoint">
            <h3><span class="method">GET</span> /api/data/{dataset_name}</h3>
            <p>Get data for any dataset</p>
            <code>curl "http://localhost:8001/api/data/sales_data"</code>
        </div>
        
        <h2>Server Info</h2>
        <p>Base URL: <code>http://localhost:8001</code></p>
        <p>Dashboard URL: <code>http://localhost:3000</code></p>
        <p>Health Check: <code>http://localhost:8001/api/health</code></p>
    </body>
    </html>
    """
    return HTMLResponse(content=docs_html)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("AI D3.js Tool Server started successfully!")
