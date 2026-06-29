// Simple Fish Prediction for n8n Code Node
// Copy and paste this entire code into your n8n Code node

const items = [];

// Helper function to generate sample data for species
function generateSampleData(species) {
  const baseCount = {
    'Sardine': 400, 'Snapper': 95, 'Tuna': 200, 'Salmon': 150,
    'Cod': 120, 'Mackerel': 180, 'Lutjanus argentimaculatus': 350
  }[species] || 100;
  
  const data = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date('2023-01-01');
    date.setMonth(date.getMonth() + i);
    const trend = i * 2;
    const seasonal = 30 * Math.sin((i * Math.PI * 2) / 12);
    const noise = (Math.random() - 0.5) * 40;
    const count = Math.max(10, baseCount + trend + seasonal + noise);
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.round(count)
    });
  }
  return data;
}

// Simple linear trend prediction
function predictLinearTrend(data, periods = 6) {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i].count;
    sumXY += i * data[i].count;
    sumXX += i * i;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const predictions = [];
  const lastDate = new Date(data[n-1].date);
  
  for (let i = 1; i <= periods; i++) {
    const futureValue = intercept + slope * (n + i - 1);
    const predictedCount = Math.max(10, Math.round(futureValue));
    
    const futureDate = new Date(lastDate);
    futureDate.setMonth(futureDate.getMonth() + i);
    
    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      predicted_count: predictedCount,
      period: i,
      confidence_lower: Math.max(5, predictedCount - 20),
      confidence_upper: predictedCount + 20
    });
  }
  
  return predictions;
}

// Process each input item
for (const item of $input.all()) {
  const inputData = item.json;
  
  try {
    const species = inputData.species || 'Unknown Species';
    let historicalData = inputData.historical_data || [];
    const forecastPeriods = inputData.forecast_periods || 6;
    
    // If no historical data, generate sample data
    if (!historicalData || historicalData.length === 0) {
      historicalData = generateSampleData(species);
      console.log(`Generated sample data for ${species}`);
    }
    
    // Ensure we have enough data
    if (historicalData.length < 3) {
      throw new Error(`Need at least 3 data points for ${species}`);
    }
    
    console.log(`Predicting for ${species} with ${historicalData.length} data points`);
    
    // Generate predictions
    const predictions = predictLinearTrend(historicalData, forecastPeriods);
    
    // Add each prediction as a separate output item
    predictions.forEach((forecast) => {
      items.push({
        json: {
          species: species,
          forecast_date: forecast.date,
          predicted_count: forecast.predicted_count,
          period: forecast.period,
          confidence_lower: forecast.confidence_lower,
          confidence_upper: forecast.confidence_upper,
          model_type: "Linear Trend",
          training_samples: historicalData.length,
          prediction_timestamp: new Date().toISOString()
        }
      });
    });
    
    console.log(`Generated ${predictions.length} predictions for ${species}`);
    
  } catch (error) {
    console.error(`Error processing ${inputData.species || 'unknown'}:`, error.message);
    
    // Add error item
    items.push({
      json: {
        species: inputData.species || 'Unknown',
        error: error.message,
        error_timestamp: new Date().toISOString()
      }
    });
  }
}

console.log(`Total output items: ${items.length}`);
return items;