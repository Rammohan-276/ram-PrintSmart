// Fish Prediction Logic for n8n Code Node
// This replaces the external API call with direct JavaScript calculation

function predictFishDensity(species, historicalData, forecastPeriods = 12) {
  try {
    // If no historical data provided, use sample data for the species
    if (!historicalData || historicalData.length === 0) {
      historicalData = generateSampleData(species);
    }
    
    // Convert dates and extract counts
    const processedData = historicalData.map((item, index) => ({
      index: index,
      count: parseFloat(item.count) || 0,
      date: new Date(item.date)
    })).sort((a, b) => a.date - b.date);
    
    if (processedData.length < 3) {
      throw new Error(`Not enough historical data for ${species}. Need at least 3 data points.`);
    }
    
    // Simple polynomial trend calculation
    const X = processedData.map(d => d.index);
    const Y = processedData.map(d => d.count);
    
    // Calculate polynomial regression coefficients (degree 2)
    const regression = polynomialRegression(X, Y, 2);
    
    // Generate future predictions
    const lastIndex = processedData.length - 1;
    const lastDate = processedData[lastIndex].date;
    
    const predictions = [];
    const confidence = calculateConfidenceInterval(Y, regression.predict(X));
    
    for (let i = 1; i <= forecastPeriods; i++) {
      const futureIndex = lastIndex + i;
      const predictedCount = Math.max(0, regression.predict([futureIndex])[0]);
      
      // Calculate future date (assuming monthly intervals)
      const futureDate = new Date(lastDate);
      futureDate.setMonth(futureDate.getMonth() + i);
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        predicted_count: Math.round(predictedCount * 100) / 100,
        period: i,
        confidence_lower: Math.max(0, Math.round((predictedCount - confidence) * 100) / 100),
        confidence_upper: Math.round((predictedCount + confidence) * 100) / 100
      });
    }
    
    // Calculate model metrics
    const predictions_historical = regression.predict(X);
    const r2 = calculateR2(Y, predictions_historical);
    const mse = calculateMSE(Y, predictions_historical);
    
    return {
      species: species,
      forecast: predictions,
      model_info: {
        model_type: "Polynomial Regression",
        degree: 2,
        r2_score: Math.round(r2 * 1000) / 1000,
        mse: Math.round(mse * 100) / 100,
        training_samples: processedData.length
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    throw new Error(`Prediction failed for ${species}: ${error.message}`);
  }
}

// Polynomial regression implementation
function polynomialRegression(x, y, degree) {
  const n = x.length;
  const matrix = [];
  const results = [];
  
  // Build the matrix for least squares
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j <= degree; j++) {
      row.push(Math.pow(x[i], j));
    }
    matrix.push(row);
    results.push(y[i]);
  }
  
  // Solve using normal equations (simplified for degree 2)
  if (degree === 2) {
    const a = solveLinearSystem(matrix, results);
    return {
      coefficients: a,
      predict: function(xValues) {
        return xValues.map(xi => a[0] + a[1] * xi + a[2] * xi * xi);
      }
    };
  } else {
    // Fallback to linear regression
    const slope = calculateSlope(x, y);
    const intercept = calculateIntercept(x, y, slope);
    return {
      coefficients: [intercept, slope],
      predict: function(xValues) {
        return xValues.map(xi => intercept + slope * xi);
      }
    };
  }
}

// Simplified linear system solver for 2nd degree polynomial
function solveLinearSystem(matrix, results) {
  const n = matrix.length;
  const m = matrix[0].length;
  
  // Calculate sums for normal equations
  let sum_x0 = n;
  let sum_x1 = 0, sum_x2 = 0, sum_x3 = 0, sum_x4 = 0;
  let sum_y = 0, sum_xy = 0, sum_x2y = 0;
  
  for (let i = 0; i < n; i++) {
    const xi = i;
    const yi = results[i];
    sum_x1 += xi;
    sum_x2 += xi * xi;
    sum_x3 += xi * xi * xi;
    sum_x4 += xi * xi * xi * xi;
    sum_y += yi;
    sum_xy += xi * yi;
    sum_x2y += xi * xi * yi;
  }
  
  // Solve 3x3 system for ax^2 + bx + c
  const det = sum_x0 * (sum_x2 * sum_x4 - sum_x3 * sum_x3) - 
              sum_x1 * (sum_x1 * sum_x4 - sum_x2 * sum_x3) + 
              sum_x2 * (sum_x1 * sum_x3 - sum_x2 * sum_x2);
  
  if (Math.abs(det) < 1e-10) {
    // Fallback to linear regression
    const slope = calculateSlope(matrix.map((_, i) => i), results);
    const intercept = calculateIntercept(matrix.map((_, i) => i), results, slope);
    return [intercept, slope, 0];
  }
  
  const a = ((sum_y * (sum_x2 * sum_x4 - sum_x3 * sum_x3) - 
             sum_xy * (sum_x1 * sum_x4 - sum_x2 * sum_x3) + 
             sum_x2y * (sum_x1 * sum_x3 - sum_x2 * sum_x2)) / det);
  
  const b = ((sum_x0 * (sum_xy * sum_x4 - sum_x2y * sum_x3) - 
             sum_y * (sum_x1 * sum_x4 - sum_x2 * sum_x3) + 
             sum_x2y * (sum_x1 * sum_x2 - sum_x0 * sum_x3)) / det);
  
  const c = ((sum_x0 * (sum_x2 * sum_x2y - sum_x3 * sum_xy) - 
             sum_x1 * (sum_x1 * sum_x2y - sum_x2 * sum_xy) + 
             sum_y * (sum_x1 * sum_x3 - sum_x2 * sum_x2)) / det);
  
  return [a, b, c];
}

// Helper functions
function calculateSlope(x, y) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
}

function calculateIntercept(x, y, slope) {
  const meanX = x.reduce((a, b) => a + b, 0) / x.length;
  const meanY = y.reduce((a, b) => a + b, 0) / y.length;
  return meanY - slope * meanX;
}

function calculateR2(actual, predicted) {
  const meanActual = actual.reduce((a, b) => a + b, 0) / actual.length;
  const totalSumSquares = actual.reduce((sum, val) => sum + Math.pow(val - meanActual, 2), 0);
  const residualSumSquares = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0);
  return 1 - (residualSumSquares / totalSumSquares);
}

function calculateMSE(actual, predicted) {
  const squaredErrors = actual.map((val, i) => Math.pow(val - predicted[i], 2));
  return squaredErrors.reduce((a, b) => a + b, 0) / actual.length;
}

function calculateConfidenceInterval(actual, predicted) {
  const residuals = actual.map((val, i) => val - predicted[i]);
  const mse = residuals.reduce((sum, r) => sum + r * r, 0) / actual.length;
  return 1.96 * Math.sqrt(mse); // 95% confidence interval
}

function generateSampleData(species) {
  // Generate sample historical data based on species type
  const baseCount = {
    'Sardine': 400,
    'Snapper': 95,
    'Tuna': 200,
    'Salmon': 150,
    'Cod': 120,
    'Mackerel': 180
  }[species] || 100;
  
  const data = [];
  const startDate = new Date('2023-01-01');
  
  for (let i = 0; i < 24; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    
    // Add some trend and seasonal variation
    const trend = i * 0.5;
    const seasonal = 20 * Math.sin((i * Math.PI * 2) / 12);
    const noise = (Math.random() - 0.5) * 30;
    const count = Math.max(10, baseCount + trend + seasonal + noise);
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.round(count)
    });
  }
  
  return data;
}

// Main function for n8n Code node
const items = [];

for (const item of $input.all()) {
  const inputData = item.json;
  
  try {
    const species = inputData.species || 'Unknown Species';
    const historicalData = inputData.historical_data || [];
    const forecastPeriods = inputData.forecast_periods || 12;
    
    console.log(`Processing prediction for species: ${species}`);
    
    const prediction = predictFishDensity(species, historicalData, forecastPeriods);
    
    // Add each forecast period as a separate item
    prediction.forecast.forEach((forecast, index) => {
      items.push({
        json: {
          species: prediction.species,
          forecast_date: forecast.date,
          predicted_count: forecast.predicted_count,
          period: forecast.period,
          confidence_lower: forecast.confidence_lower,
          confidence_upper: forecast.confidence_upper,
          model_type: prediction.model_info.model_type,
          r2_score: prediction.model_info.r2_score,
          mse: prediction.model_info.mse,
          training_samples: prediction.model_info.training_samples,
          prediction_timestamp: prediction.timestamp
        }
      });
    });
    
  } catch (error) {
    console.error(`Error processing ${inputData.species || 'unknown species'}:`, error.message);
    
    // Add error item
    items.push({
      json: {
        species: inputData.species || 'Unknown',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}

return items;