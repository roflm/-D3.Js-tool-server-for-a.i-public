import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FileUploader = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [datasetName, setDatasetName] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!datasetName.trim()) {
      alert('Please enter a dataset name first');
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dataset_name', datasetName);

      const response = await axios.post(`${API}/ai/upload-csv`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(response.data);
      if (onUploadComplete) onUploadComplete();
      setDatasetName(''); // Reset form
    } catch (error) {
      console.error('Upload error:', error);
      setResult({
        success: false,
        message: error.response?.data?.detail || 'Upload failed'
      });
    }
    setUploading(false);
  }, [datasetName, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div className="space-y-4">
      
      {/* Dataset Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dataset Name *
        </label>
        <input
          type="text"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          placeholder="e.g., customer_data"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={uploading}
        />
      </div>

      {/* File Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          {uploading ? (
            <div>
              <div className="text-lg font-medium text-gray-600">Uploading...</div>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mt-2"></div>
            </div>
          ) : isDragActive ? (
            <div>
              <div className="text-lg font-medium text-blue-600">Drop the CSV file here</div>
              <div className="text-sm text-blue-500">We'll process it automatically</div>
            </div>
          ) : (
            <div>
              <div className="text-lg font-medium text-gray-600">Drop CSV file here</div>
              <div className="text-sm text-gray-500">or click to select a file</div>
              <div className="text-xs text-gray-400 mt-2">Supports: .csv files only</div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Result */}
      {result && (
        <div className={`p-3 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.success ? '✅ Upload Successful' : '❌ Upload Failed'}
          </div>
          <div className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
            {result.message}
          </div>
          {result.success && result.data && (
            <div className="mt-2 space-y-1 text-xs text-gray-600">
              <div>Rows: {result.data.rows} | Columns: {result.data.columns.join(', ')}</div>
              <div>API Endpoint: <code className="bg-gray-100 px-1 rounded">{result.data.api_endpoint}</code></div>
              {result.data.sample && result.data.sample.length > 0 && (
                <div className="mt-2">
                  <div className="font-medium">Sample Data:</div>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(result.data.sample[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sample CSV Format */}
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-xs font-medium text-gray-700 mb-2">Sample CSV Format:</div>
        <pre className="text-xs text-gray-600 overflow-x-auto">
{`month,sales,expenses
Jan,10000,6000
Feb,12000,7000
Mar,15000,8000`}
        </pre>
      </div>

      {/* API Example */}
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-xs font-medium text-gray-700 mb-2">AI API Example:</div>
        <code className="text-xs text-gray-600 block">
          {`curl -X POST "${BACKEND_URL}/api/ai/upload-csv" \\
  -F "file=@data.csv" \\
  -F "dataset_name=my_dataset"`}
        </code>
      </div>
    </div>
  );
};

export default FileUploader;