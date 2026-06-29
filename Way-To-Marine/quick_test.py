#!/usr/bin/env python3
"""
Quick test to verify the fish prediction functionality works
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fish_prediction_api import predictor
import pandas as pd
from datetime import datetime, timedelta

def test_predictor_directly():
    """Test the predictor without running the web server"""
    print("🧪 Testing Fish Prediction Engine Directly")
    print("=" * 50)
    
    # Check if data was loaded
    species_list = list(predictor.species_data.keys())
    print(f"📊 Available species ({len(species_list)}): {', '.join(species_list)}")
    
    if not species_list:
        print("❌ No species data available")
        return False
    
    # Test prediction for first species
    test_species = species_list[0]
    print(f"\n🔍 Testing prediction for {test_species}...")
    
    try:
        result = predictor.predict_species_density(
            species=test_species,
            forecast_periods=6
        )
        
        print(f"✅ Prediction successful!")
        print(f"📈 Generated {len(result['forecast'])} forecast periods")
        
        # Show some results
        for i, forecast_item in enumerate(result['forecast'][:3]):
            date = forecast_item['date']
            count = forecast_item['predicted_count']
            print(f"   Period {i+1}: {date} - {count:.1f} fish")
        
        # Show model info
        model_info = result.get('model_info', {})
        if model_info:
            print(f"🔧 Model: {model_info.get('model_type', 'Unknown')}")
            print(f"📊 R² Score: {model_info.get('r2_score', 'N/A'):.3f}")
            print(f"📦 Training samples: {model_info.get('training_samples', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Prediction failed: {str(e)}")
        return False

def test_with_custom_data():
    """Test with custom historical data"""
    print(f"\n🧪 Testing with custom data...")
    
    # Generate some sample data
    sample_data = []
    base_date = datetime(2023, 1, 1)
    base_count = 120
    
    for i in range(12):  # 12 months
        date = base_date + timedelta(days=30*i)
        count = base_count + (i * 3) + (5 * (1 if i % 2 == 0 else -1))
        sample_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "count": max(count, 10)
        })
    
    try:
        result = predictor.predict_species_density(
            species="TestSpecies",
            historical_data=sample_data,
            forecast_periods=3
        )
        
        print(f"✅ Custom data prediction successful!")
        print(f"📈 Generated {len(result['forecast'])} forecast periods")
        
        return True
        
    except Exception as e:
        print(f"❌ Custom data prediction failed: {str(e)}")
        return False

def main():
    """Run all direct tests"""
    print("🚀 Fish Prediction Engine Test (Direct)")
    print("=" * 60)
    
    tests_passed = 0
    total_tests = 2
    
    # Test 1: Built-in data prediction
    if test_predictor_directly():
        tests_passed += 1
    
    # Test 2: Custom data prediction
    if test_with_custom_data():
        tests_passed += 1
    
    # Summary
    print("\n" + "=" * 60)
    print(f"📊 Test Summary: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! The prediction engine works correctly.")
        print("💡 You can now start the API server with: python start_api.py")
        return 0
    else:
        print("⚠️  Some tests failed. Check the implementation.")
        return 1

if __name__ == "__main__":
    sys.exit(main())