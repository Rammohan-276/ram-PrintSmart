import uvicorn
from fish_prediction_api import app

if __name__ == "__main__":
    print("🐟 Starting Fish Prediction API...")
    print("📡 API will be available at: http://localhost:8000")
    print("📚 Documentation at: http://localhost:8000/docs")
    print("🛑 Press Ctrl+C to stop the server")
    
    uvicorn.run(
        "fish_prediction_api:app", 
        host="127.0.0.1", 
        port=8000, 
        reload=False,
        log_level="info"
    )