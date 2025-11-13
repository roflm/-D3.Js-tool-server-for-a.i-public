import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import ScatterPlot from "./components/ScatterPlot";
import PieChart from "./components/PieChart";
import AreaChart from "./components/AreaChart";
import NetworkGraph from "./components/NetworkGraph";
import AIDataCreator from "./components/AIDataCreator";
import FileUploader from "./components/FileUploader";
import ChartGenerator from "./components/ChartGenerator";
import APIDocumentation from "./components/APIDocumentation";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [salesData, setSalesData] = useState([]);
  const [quarterlySales, setQuarterlySales] = useState([]);
  const [productData, setProductData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [networkData, setNetworkData] = useState({ nodes: [], links: [] });
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch enhanced datasets
      const [
        salesRes, quarterlyRes, productRes, userRes, 
        categoryRes, timeSeriesRes, datasetsRes
      ] = await Promise.all([
        axios.get(`${API}/data/sales_data`),
        axios.get(`${API}/data/quarterly_sales`),
        axios.get(`${API}/data/product_performance`),
        axios.get(`${API}/data/user_data`),
        axios.get(`${API}/data/category_data`),
        axios.get(`${API}/data/time_series_data`),
        axios.get(`${API}/datasets`)
      ]);

      setSalesData(salesRes.data.data);
      setQuarterlySales(quarterlyRes.data.data);
      setProductData(productRes.data.data);
      setUserData(userRes.data.data);
      setCategoryData(categoryRes.data.data);
      setTimeSeriesData(timeSeriesRes.data.data);
      setDatasets(datasetsRes.data.datasets);

      // Mock network data for demo
      setNetworkData({
        nodes: [
          {id: 'A', group: 1, size: 10},
          {id: 'B', group: 1, size: 15},
          {id: 'C', group: 2, size: 12}
        ],
        links: [
          {source: 'A', target: 'B', value: 1},
          {source: 'B', target: 'C', value: 2}
        ]
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please check if the backend server is running.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDataRefresh = () => {
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading AI D3.js Tool Server...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleDataRefresh}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🤖 AI D3.js Tool Server
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Self-hosted visualization server for AI agents and data analysis
            </p>
            
            {/* Tab Navigation */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('ai-tools')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'ai-tools' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🤖 AI Tools
              </button>
              <button
                onClick={() => setActiveTab('api-docs')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'api-docs' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📚 API Docs
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Monthly Sales Bar Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Monthly Sales Data</h2>
              <p className="text-gray-600 mb-4">Bar chart showing monthly sales, expenses, and profit</p>
              <BarChart data={salesData} />
            </div>

            {/* Quarterly Sales Line Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Quarterly Trends</h2>
              <p className="text-gray-600 mb-4">Line chart tracking quarterly performance</p>
              <LineChart data={quarterlySales} />
            </div>

            {/* Product Performance Scatter */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Product Performance</h2>
              <p className="text-gray-600 mb-4">Sales vs Units Sold by Product</p>
              <ScatterPlot data={productData.map(d => ({age: d.units_sold, income: d.sales, satisfaction: d.profit_margin * 10}))} />
            </div>

            {/* Market Categories Pie Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🥧 Market Categories</h2>
              <p className="text-gray-600 mb-4">Distribution of market share by category</p>
              <PieChart data={categoryData} />
            </div>

            {/* User Demographics Scatter */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">👥 User Demographics</h2>
              <p className="text-gray-600 mb-4">Age vs Income with satisfaction scores</p>
              <ScatterPlot data={userData} />
            </div>

            {/* Time Series Area Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📉 Website Analytics</h2>
              <p className="text-gray-600 mb-4">Visitors, page views, and conversions over time</p>
              <AreaChart data={timeSeriesData} />
            </div>

          </div>
        )}

        {/* AI Tools Tab */}
        {activeTab === 'ai-tools' && (
          <div className="space-y-8">
            
            {/* Server Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Server Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{datasets.length}</div>
                  <div className="text-sm text-gray-600">Datasets</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">6</div>
                  <div className="text-sm text-gray-600">Chart Types</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">✓</div>
                  <div className="text-sm text-gray-600">AI Ready</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">🔗</div>
                  <div className="text-sm text-gray-600">API Active</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* AI Data Creator */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🤖 AI Data Creator</h2>
                <p className="text-gray-600 mb-4">Create datasets programmatically via API</p>
                <AIDataCreator onDataCreated={handleDataRefresh} />
              </div>

              {/* File Uploader */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📁 CSV File Uploader</h2>
                <p className="text-gray-600 mb-4">Upload CSV files for visualization</p>
                <FileUploader onUploadComplete={handleDataRefresh} />
              </div>

              {/* Chart Generator */}
              <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Chart Generator</h2>
                <p className="text-gray-600 mb-4">Generate charts programmatically</p>
                <ChartGenerator datasets={datasets} />
              </div>

            </div>
          </div>
        )}

        {/* API Documentation Tab */}
        {activeTab === 'api-docs' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <APIDocumentation />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              🛠️ Self-Hosted AI D3.js Tool Server
            </h3>
            <p className="text-gray-600 mb-4">
              Complete visualization toolkit with D3.js charts, AI-friendly APIs, and CSV data storage
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-semibold text-gray-800">Backend</div>
                <div className="text-gray-600">FastAPI + Pandas</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-semibold text-gray-800">Frontend</div>
                <div className="text-gray-600">React + D3.js</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-semibold text-gray-800">Data Storage</div>
                <div className="text-gray-600">CSV Files</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-semibold text-gray-800">AI Integration</div>
                <div className="text-gray-600">REST APIs</div>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Server URL: <code className="bg-gray-100 px-2 py-1 rounded">{BACKEND_URL}</code> | 
              Dashboard: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;