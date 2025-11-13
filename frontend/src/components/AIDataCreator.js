import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AIDataCreator = ({ onDataCreated }) => {
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const [salesData, setSalesData] = useState([
    { month: 'Jan', sales: 10000, expenses: 6000 },
    { month: 'Feb', sales: 12000, expenses: 7000 },
    { month: 'Mar', sales: 15000, expenses: 8000 }
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const addDataPoint = () => {
    setSalesData([...salesData, { month: '', sales: 0, expenses: 0 }]);
  };

  const updateDataPoint = (index, field, value) => {
    const updated = [...salesData];
    updated[index] = { ...updated[index], [field]: value };
    setSalesData(updated);
  };

  const removeDataPoint = (index) => {
    setSalesData(salesData.filter((_, i) => i !== index));
  };

  const createDataset = async () => {
    if (!datasetName.trim()) {
      alert('Please enter a dataset name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/ai/create-sales-data`, {
        name: datasetName,
        description: description,
        data: salesData.filter(item => item.month.trim() && item.sales > 0)
      });

      setResult(response.data);
      if (onDataCreated) onDataCreated();
      
      // Reset form
      setDatasetName('');
      setDescription('');
      setSalesData([
        { month: 'Jan', sales: 10000, expenses: 6000 },
        { month: 'Feb', sales: 12000, expenses: 7000 },
        { month: 'Mar', sales: 15000, expenses: 8000 }
      ]);
    } catch (error) {
      console.error('Error creating dataset:', error);
      setResult({
        success: false,
        message: error.response?.data?.detail || 'Failed to create dataset'
      });
    }
    setLoading(false);
  };

  const generateSampleData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sampleData = months.map(month => ({
      month,
      sales: Math.floor(Math.random() * 50000) + 10000,
      expenses: Math.floor(Math.random() * 30000) + 5000
    }));
    setSalesData(sampleData);
  };

  return (
    <div className="space-y-4">
      
      {/* Dataset Info */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dataset Name *
          </label>
          <input
            type="text"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            placeholder="e.g., q4_sales_2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Data Points */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Sales Data Points
          </label>
          <div className="space-x-2">
            <button
              onClick={generateSampleData}
              className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
            >
              Generate Sample
            </button>
            <button
              onClick={addDataPoint}
              className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Add Point
            </button>
          </div>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {salesData.map((item, index) => (
            <div key={index} className="flex space-x-2 items-center">
              <input
                type="text"
                value={item.month}
                onChange={(e) => updateDataPoint(index, 'month', e.target.value)}
                placeholder="Month"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="number"
                value={item.sales}
                onChange={(e) => updateDataPoint(index, 'sales', Number(e.target.value))}
                placeholder="Sales"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="number"
                value={item.expenses}
                onChange={(e) => updateDataPoint(index, 'expenses', Number(e.target.value))}
                placeholder="Expenses"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => removeDataPoint(index)}
                className="text-red-500 hover:text-red-700 px-2 py-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={createDataset}
          disabled={loading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded"
        >
          {loading ? 'Creating...' : 'Create Dataset'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`p-3 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.success ? '✅ Success' : '❌ Error'}
          </div>
          <div className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
            {result.message}
          </div>
          {result.success && result.data && (
            <div className="mt-2 text-xs text-gray-600">
              <div>API Endpoint: <code className="bg-gray-100 px-1 rounded">{result.data.api_endpoint}</code></div>
              <div>Records: {result.data.records}</div>
            </div>
          )}
        </div>
      )}

      {/* API Example */}
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-xs font-medium text-gray-700 mb-2">AI API Example:</div>
        <code className="text-xs text-gray-600 block">
          {`curl -X POST "${BACKEND_URL}/api/ai/create-sales-data" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "my_sales", "data": [{"month": "Jan", "sales": 10000, "expenses": 5000}]}'`}
        </code>
      </div>
    </div>
  );
};

export default AIDataCreator;