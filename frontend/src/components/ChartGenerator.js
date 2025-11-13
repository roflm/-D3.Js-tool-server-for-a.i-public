import { useState } from 'react';
import axios from 'axios';
import ReactJsonView from 'react-json-view';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChartGenerator = ({ datasets }) => {
  const [config, setConfig] = useState({
    chart_type: 'bar',
    dataset_name: '',
    title: '',
    width: 500,
    height: 300
  });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const chartTypes = [
    { value: 'bar', label: '📊 Bar Chart', description: 'Compare categories' },
    { value: 'line', label: '📈 Line Chart', description: 'Show trends over time' },
    { value: 'scatter', label: '🔸 Scatter Plot', description: 'Show correlations' },
    { value: 'pie', label: '🥧 Pie Chart', description: 'Show proportions' },
    { value: 'area', label: '📉 Area Chart', description: 'Stacked time series' }
  ];

  const generateChart = async () => {
    if (!config.dataset_name) {
      alert('Please select a dataset');
      return;
    }

    setGenerating(true);
    setResult(null);

    try {
      const response = await axios.post(`${API}/ai/generate-chart`, config);
      setResult(response.data);
    } catch (error) {
      console.error('Chart generation error:', error);
      setResult({
        success: false,
        message: error.response?.data?.detail || 'Failed to generate chart'
      });
    }
    setGenerating(false);
  };

  const updateConfig = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const generateTitle = () => {
    if (config.dataset_name && config.chart_type) {
      const datasetLabel = config.dataset_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const chartLabel = chartTypes.find(t => t.value === config.chart_type)?.label.split(' ')[1] || config.chart_type;
      updateConfig('title', `${chartLabel} - ${datasetLabel}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Chart Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Chart Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
          <div className="space-y-2">
            {chartTypes.map(type => (
              <label key={type.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="chart_type"
                  value={type.value}
                  checked={config.chart_type === type.value}
                  onChange={(e) => updateConfig('chart_type', e.target.value)}
                  className="text-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-800">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Dataset and Settings */}
        <div className="space-y-4">
          
          {/* Dataset Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dataset *</label>
            <select
              value={config.dataset_name}
              onChange={(e) => updateConfig('dataset_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a dataset...</option>
              {datasets.map(dataset => (
                <option key={dataset.name} value={dataset.name}>
                  {dataset.name} ({dataset.rows} rows)
                </option>
              ))}
            </select>
          </div>

          {/* Chart Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chart Title
              <button
                onClick={generateTitle}
                className="ml-2 text-xs text-blue-500 hover:text-blue-700"
              >
                Auto-generate
              </button>
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => updateConfig('title', e.target.value)}
              placeholder="Enter chart title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
              <input
                type="number"
                value={config.width}
                onChange={(e) => updateConfig('width', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <input
                type="number"
                value={config.height}
                onChange={(e) => updateConfig('height', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={generateChart}
          disabled={generating || !config.dataset_name}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg"
        >
          {generating ? 'Generating...' : 'Generate Chart'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className={`p-3 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ Chart Generated Successfully' : '❌ Generation Failed'}
            </div>
            <div className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message}
            </div>
            {result.success && (
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                {result.chart_url && (
                  <div>Chart URL: <code className="bg-gray-100 px-1 rounded">{result.chart_url}</code></div>
                )}
                {result.export_url && (
                  <div>Export URL: <code className="bg-gray-100 px-1 rounded">{result.export_url}</code></div>
                )}
              </div>
            )}
          </div>

          {/* Chart Configuration JSON */}
          {result.success && result.data && (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm font-medium text-gray-700 mb-2">Generated Chart Configuration:</div>
              <div className="max-h-64 overflow-y-auto">
                <ReactJsonView
                  src={result.data}
                  theme="rjv-default"
                  collapsed={1}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  enableClipboard={true}
                  name={false}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* API Example */}
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-xs font-medium text-gray-700 mb-2">AI API Example:</div>
        <code className="text-xs text-gray-600 block whitespace-pre-wrap">
          {`curl -X POST "${BACKEND_URL}/api/ai/generate-chart" \\
  -H "Content-Type: application/json" \\
  -d '{
    "chart_type": "${config.chart_type}",
    "dataset_name": "${config.dataset_name || 'sales_data'}",
    "title": "${config.title || 'My Chart'}",
    "width": ${config.width},
    "height": ${config.height}
  }'`}
        </code>
      </div>
    </div>
  );
};

export default ChartGenerator;