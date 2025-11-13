
import requests
import unittest
import json
import sys
from datetime import datetime

class D3jsAPITester(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(D3jsAPITester, self).__init__(*args, **kwargs)
        # Use the public endpoint from the frontend .env file
        self.base_url = "https://54a9ea38-851a-4269-9dc2-2d7fca61956b.preview.emergentagent.com/api"
        self.tests_run = 0
        self.tests_passed = 0

    def setUp(self):
        self.tests_run += 1
        print(f"\n🔍 Running test: {self._testMethodName}")

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        response = requests.get(f"{self.base_url}/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("message", data)
        self.assertIn("available_endpoints", data)
        self.assertEqual(len(data["available_endpoints"]), 7)
        print("✅ Root endpoint returns correct data structure")

    def test_datasets_endpoint(self):
        """Test the datasets endpoint"""
        response = requests.get(f"{self.base_url}/datasets")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("datasets", data)
        self.assertIsInstance(data["datasets"], list)
        self.assertGreaterEqual(len(data["datasets"]), 5)  # At least 5 datasets
        
        # Check dataset structure
        for dataset in data["datasets"]:
            self.assertIn("name", dataset)
            self.assertIn("filename", dataset)
            self.assertIn("rows", dataset)
            self.assertIn("columns", dataset)
            self.assertIn("sample", dataset)
        
        print(f"✅ Datasets endpoint returns {len(data['datasets'])} datasets with correct structure")

    def test_sales_data_endpoint(self):
        """Test the sales data endpoint"""
        response = requests.get(f"{self.base_url}/data/sales")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("data", data)
        self.assertIsInstance(data["data"], list)
        self.assertEqual(len(data["data"]), 12)  # 12 months
        
        # Check data structure
        for item in data["data"]:
            self.assertIn("month", item)
            self.assertIn("sales", item)
            self.assertIn("expenses", item)
        
        print(f"✅ Sales data endpoint returns {len(data['data'])} records with correct structure")

    def test_user_data_endpoint(self):
        """Test the user data endpoint"""
        response = requests.get(f"{self.base_url}/data/users")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("data", data)
        self.assertIsInstance(data["data"], list)
        self.assertEqual(len(data["data"]), 20)  # 20 users
        
        # Check data structure
        for item in data["data"]:
            self.assertIn("age", item)
            self.assertIn("income", item)
            self.assertIn("satisfaction", item)
        
        print(f"✅ User data endpoint returns {len(data['data'])} records with correct structure")

    def test_category_data_endpoint(self):
        """Test the category data endpoint"""
        response = requests.get(f"{self.base_url}/data/categories")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("data", data)
        self.assertIsInstance(data["data"], list)
        self.assertEqual(len(data["data"]), 6)  # 6 categories
        
        # Check data structure
        for item in data["data"]:
            self.assertIn("category", item)
            self.assertIn("value", item)
            self.assertIn("color", item)
        
        print(f"✅ Category data endpoint returns {len(data['data'])} records with correct structure")

    def test_timeseries_data_endpoint(self):
        """Test the timeseries data endpoint"""
        response = requests.get(f"{self.base_url}/data/timeseries")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("data", data)
        self.assertIsInstance(data["data"], list)
        self.assertEqual(len(data["data"]), 50)  # 50 time points
        
        # Check data structure
        for item in data["data"]:
            self.assertIn("date", item)
            self.assertIn("visitors", item)
            self.assertIn("page_views", item)
            self.assertIn("conversions", item)
        
        print(f"✅ Timeseries data endpoint returns {len(data['data'])} records with correct structure")

    def test_network_nodes_endpoint(self):
        """Test the network nodes endpoint"""
        response = requests.get(f"{self.base_url}/data/network-nodes")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("data", data)
        self.assertIsInstance(data["data"], list)
        self.assertEqual(len(data["data"]), 8)  # 8 nodes
        
        # Check data structure
        for item in data["data"]:
            self.assertIn("id", item)
            self.assertIn("group", item)
            self.assertIn("size", item)
        
        print(f"✅ Network nodes endpoint returns {len(data['data'])} records with correct structure")

    def test_network_links_endpoint(self):
        """Test the network links endpoint"""
        response = requests.get(f"{self.base_url}/data/network-links")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("data", data)
        self.assertIsInstance(data["data"], list)
        self.assertEqual(len(data["data"]), 9)  # 9 links
        
        # Check data structure
        for item in data["data"]:
            self.assertIn("source", item)
            self.assertIn("target", item)
            self.assertIn("value", item)
        
        print(f"✅ Network links endpoint returns {len(data['data'])} records with correct structure")

    def test_custom_dataset_endpoint(self):
        """Test the custom dataset endpoint with an existing dataset"""
        response = requests.get(f"{self.base_url}/data/sales_data")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("data", data)
        self.assertIsInstance(data["data"], list)
        
        print(f"✅ Custom dataset endpoint returns data for existing dataset")

    def test_nonexistent_dataset_endpoint(self):
        """Test the custom dataset endpoint with a non-existent dataset"""
        response = requests.get(f"{self.base_url}/data/nonexistent_dataset")
        self.assertEqual(response.status_code, 404)
        
        print(f"✅ Custom dataset endpoint returns 404 for non-existent dataset")

if __name__ == "__main__":
    print("🧪 Starting D3.js API Tests...")
    unittest.main(argv=['first-arg-is-ignored'], exit=False)
    print("\n🏁 All API tests completed!")
