from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import logging
from typing import List, Dict, Any
import uvicorn
from datetime import datetime, timedelta
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Fish Density Prediction API", version="1.0.0")

# Pydantic models for request/response
class PredictionRequest(BaseModel):
    species: str
    historical_data: List[Dict[str, Any]]  # [{"date": "2023-01-01", "count": 100}, ...]
    forecast_periods: int = 12

class PredictionResponse(BaseModel):
    species: str
    forecast: List[Dict[str, Any]]  # [{"date": "2024-01-01", "predicted_count": 150}, ...]
    confidence_intervals: List[Dict[str, Any]] = None
    model_info: Dict[str, Any] = None

class HealthResponse(BaseModel):
    status: str
    timestamp: str

class FishPredictor:
    def __init__(self):
        self.model = None
        self.species_data = {}
        
    def load_historical_data(self, file_path: str = "sample_fish_population_dataset.csv"):
        """Load historical fish data from CSV file"""
        try:
            df = pd.read_csv(file_path)
            df['date'] = pd.to_datetime(df['date'])
            df_grouped = df.groupby(['date', 'species'])['count'].sum().reset_index()
            
            # Store data by species
            for species in df_grouped['species'].unique():
                species_data = df_grouped[df_grouped['species'] == species].copy()
                species_data = species_data.set_index('date').sort_index()
                self.species_data[species] = species_data['count']
                
            logger.info(f"Loaded historical data for {len(self.species_data)} species")
            return True
        except Exception as e:
            logger.error(f"Error loading historical data: {str(e)}")
            return False
    
    def predict_species_density(self, species: str, historical_data: List[Dict] = None, 
                              forecast_periods: int = 12):
        """Predict fish density for a specific species"""
        try:
            # Use provided historical data or fallback to loaded data
            if historical_data:
                # Convert provided data to pandas series
                df = pd.DataFrame(historical_data)
                df['date'] = pd.to_datetime(df['date'])
                df = df.set_index('date').sort_index()
                ts = df['count'] if 'count' in df.columns else df[df.columns[0]]
            else:
                if species not in self.species_data:
                    raise ValueError(f"No historical data found for species: {species}")
                ts = self.species_data[species]
            
            # Train polynomial regression model
            logger.info(f"Training polynomial model for {species}")
            
            # Prepare data for regression
            X = np.arange(len(ts)).reshape(-1, 1)
            y = ts.values
            
            # Use polynomial features for trend modeling
            poly_features = PolynomialFeatures(degree=2)
            X_poly = poly_features.fit_transform(X)
            
            # Train the model
            model = LinearRegression()
            model.fit(X_poly, y)
            
            # Generate forecast
            future_X = np.arange(len(ts), len(ts) + forecast_periods).reshape(-1, 1)
            future_X_poly = poly_features.transform(future_X)
            forecast = model.predict(future_X_poly)
            
            # Create future dates
            last_date = ts.index[-1]
            if hasattr(last_date, 'to_period'):
                future_dates = pd.date_range(
                    last_date + pd.DateOffset(months=1), 
                    periods=forecast_periods, 
                    freq='MS'
                )
            else:
                future_dates = pd.date_range(
                    last_date + timedelta(days=30), 
                    periods=forecast_periods, 
                    freq='MS'
                )
            
            # Prepare response
            forecast_data = []
            for i, (date, value) in enumerate(zip(future_dates, forecast)):
                forecast_data.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "predicted_count": float(value),
                    "period": i + 1
                })
            
            # Calculate simple confidence intervals based on historical variance
            try:
                residuals = y - model.predict(X_poly)
                mse = np.mean(residuals ** 2)
                confidence_interval = 1.96 * np.sqrt(mse)  # 95% confidence interval
                
                confidence_data = []
                for i, (date, pred) in enumerate(zip(future_dates, forecast)):
                    confidence_data.append({
                        "date": date.strftime("%Y-%m-%d"),
                        "lower_bound": float(max(0, pred - confidence_interval)),
                        "upper_bound": float(pred + confidence_interval)
                    })
            except Exception as e:
                logger.warning(f"Could not calculate confidence intervals: {str(e)}")
                confidence_data = None
            
            # Model information
            try:
                # Calculate R-squared score
                r2_score = model.score(X_poly, y)
                model_info = {
                    "model_type": "Polynomial Regression",
                    "degree": 2,
                    "r2_score": float(r2_score),
                    "mse": float(mse) if 'mse' in locals() else None,
                    "training_samples": len(ts)
                }
            except Exception as e:
                logger.warning(f"Could not calculate model info: {str(e)}")
                model_info = {
                    "model_type": "Polynomial Regression",
                    "training_samples": len(ts)
                }
            
            return {
                "species": species,
                "forecast": forecast_data,
                "confidence_intervals": confidence_data,
                "model_info": model_info
            }
            
        except Exception as e:
            logger.error(f"Error predicting for species {species}: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

# Initialize predictor
predictor = FishPredictor()

# Load data on startup
predictor.load_historical_data()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat()
    )

@app.get("/species")
async def get_available_species():
    """Get list of available species"""
    return {
        "species": list(predictor.species_data.keys()),
        "count": len(predictor.species_data)
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_fish_density(request: PredictionRequest):
    """Predict fish density for specified species"""
    try:
        result = predictor.predict_species_density(
            species=request.species,
            historical_data=request.historical_data,
            forecast_periods=request.forecast_periods
        )
        return PredictionResponse(**result)
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/batch")
async def predict_multiple_species(species_list: List[str], forecast_periods: int = 12):
    """Predict fish density for multiple species"""
    results = {}
    errors = {}
    
    for species in species_list:
        try:
            result = predictor.predict_species_density(
                species=species,
                forecast_periods=forecast_periods
            )
            results[species] = result
        except Exception as e:
            errors[species] = str(e)
    
    return {
        "results": results,
        "errors": errors,
        "processed": len(results),
        "failed": len(errors)
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Fish Density Prediction API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "species": "/species", 
            "predict": "/predict",
            "batch_predict": "/predict/batch"
        },
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)