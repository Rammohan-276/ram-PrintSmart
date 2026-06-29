#!/usr/bin/env python3
"""
Test script for the Fish Prediction API
Run this to verify the API is working correctly before setting up n8n integration
"""

import requests
import json
import time
import sys
from datetime import datetime, timedelta

# API Configuration
API_BASE_URL = "http://localhost:8000"
TIMEOUT = 30

def test_health_check():
    """Test the health endpoint"""
    print("🔍 Testing API health check...")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['status']}")
            return True
        else:
            print(f"❌ Health check failed: Status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        return False

def test_species_list():
    """Test the species list endpoint"""
    print("\n🔍 Testing species list...")
    try:
        response = requests.get(f"{API_BASE_URL}/species", timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            species_list = data.get('species', [])
            print(f"✅ Available species ({data.get('count', 0)}): {', '.join(species_list)}")
            return species_list
        else:
            print(f"❌ Species list failed: Status {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Species list error: {str(e)}")
        return []

def test_single_prediction(species="Sardine"):
    """Test prediction for a single species"""
    print(f"\n🔍 Testing prediction for {species}...")
    
    # Create sample historical data
    sample_data = []
    base_date = datetime(2023, 1, 1)
    base_count = 150
    
    for i in range(24):  # 24 months of data
        date = base_date + timedelta(days=30*i)
        # Add some variation to the count
        count = base_count + (i * 2) + (10 * (1 if i % 2 == 0 else -1))
        sample_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "count": max(count, 10)  # Ensure positive count
        })
    
    payload = {
        "species": species,
        "historical_data": sample_data,
        "forecast_periods": 6
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/predict",
            json=payload,
            timeout=TIMEOUT,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Prediction successful for {species}")
            
            # Display forecast results
            forecast = data.get('forecast', [])
            print(f"📊 Forecast for next {len(forecast)} periods:")
            for item in forecast[:3]:  # Show first 3 predictions
                print(f"   - {item['date']}: {item['predicted_count']:.1f} fish")
            if len(forecast) > 3:
                print(f"   ... and {len(forecast) - 3} more periods")
            
            # Show model info
            model_info = data.get('model_info', {})
            if model_info:
                print(f"🔧 Model info: AIC={model_info.get('aic', 'N/A'):.2f}, Training samples={model_info.get('training_samples', 'N/A')}")
            
            return True
        else:
            print(f"❌ Prediction failed: Status {response.status_code}")
            if response.text:
                print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        return False

def test_prediction_without_data(species="Sardine"):
    """Test prediction using built-in historical data"""
    print(f"\n🔍 Testing prediction for {species} (using built-in data)...")
    
    payload = {
        "species": species,
        "historical_data": [],  # Empty - use built-in data
        "forecast_periods": 6
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/predict",
            json=payload,
            timeout=TIMEOUT,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Built-in data prediction successful for {species}")
            
            forecast = data.get('forecast', [])
            print(f"📊 Forecast for next {len(forecast)} periods:")
            for item in forecast[:3]:
                print(f"   - {item['date']}: {item['predicted_count']:.1f} fish")
            
            return True
        else:
            print(f"❌ Built-in data prediction failed: Status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Built-in data prediction error: {str(e)}")
        return False

def test_batch_prediction():
    """Test batch prediction for multiple species"""
    print(f"\n🔍 Testing batch prediction...")
    
    payload = {
        "species_list": ["Sardine", "Snapper", "Tuna"],
        "forecast_periods": 3
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/predict/batch",
            json=payload,
            timeout=TIMEOUT,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            processed = data.get('processed', 0)
            failed = data.get('failed', 0)
            print(f"✅ Batch prediction completed: {processed} successful, {failed} failed")
            
            if failed > 0:
                errors = data.get('errors', {})
                print(f"❌ Errors: {errors}")
            
            return True
        else:
            print(f"❌ Batch prediction failed: Status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Batch prediction error: {str(e)}")
        return False

def main():
    """Run all API tests"""
    print("🚀 Starting Fish Prediction API Tests")
    print("=" * 50)
    
    # Wait a bit for API to be ready
    print("⏳ Waiting for API to be ready...")
    time.sleep(2)
    
    tests_passed = 0
    total_tests = 5
    
    # Run tests
    if test_health_check():
        tests_passed += 1
    
    species_list = test_species_list()
    if species_list:
        tests_passed += 1
        
        # Use first available species or fallback to Sardine
        test_species = species_list[0] if species_list else "Sardine"
        
        if test_single_prediction(test_species):
            tests_passed += 1
            
        if test_prediction_without_data(test_species):
            tests_passed += 1
    else:
        print("⚠️  Skipping species-specific tests due to species list failure")
    
    if test_batch_prediction():
        tests_passed += 1
    
    # Summary
    print("\n" + "=" * 50)
    print(f"📊 Test Summary: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Your API is ready for n8n integration.")
        return 0
    elif tests_passed > 0:
        print("⚠️  Some tests failed. Check the API setup and try again.")
        return 1
    else:
        print("❌ All tests failed. Make sure the API is running on localhost:8000")
        return 1

if __name__ == "__main__":
    sys.exit(main())