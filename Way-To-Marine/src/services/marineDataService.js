// Mock Marine Data Service
const marineDataService = {
  // Mock marine data
  mockMarineData: {
    location: {
      name: "San Francisco Bay",
      lat: 37.7749,
      lon: -122.4194,
      area: "California Coast"
    },
    marine: {
      waterTemperature: 18.5,
      swellHeight: 1.2,
      visibility: 15,
      currentSpeed: 0.8,
      currentDirection: "NW",
      tideHeight: 2.3,
      salinity: 34.2
    },
    weather: {
      temperature: 22,
      windSpeed: 12,
      windDirection: "NW",
      pressure: 1013.25,
      humidity: 78,
      conditions: "Partly Cloudy"
    },
    fishActivity: {
      activity: "High",
      score: 85,
      bestTimes: ["Dawn (5:30-7:00 AM)", "Dusk (6:00-8:00 PM)", "Night (9:00-11:00 PM)"],
      recommendations: [
        "Use live bait for better results",
        "Try deeper waters during midday",
        "Focus on rocky structures and drop-offs",
        "Monitor tide changes for optimal timing"
      ]
    },
    tides: {
      station: "Golden Gate Bridge",
      tides: [
        { type: "High", time: "6:15 AM", height: "5.2" },
        { type: "Low", time: "12:30 PM", height: "0.8" },
        { type: "High", time: "7:45 PM", height: "4.8" },
        { type: "Low", time: "1:15 AM", height: "1.2" }
      ]
    },
    alerts: [
      {
        type: "weather",
        level: "advisory",
        message: "Small craft advisory in effect until 8:00 PM"
      },
      {
        type: "fishing",
        level: "info", 
        message: "Salmon season opens next week - prepare your gear"
      }
    ],
    lastUpdated: new Date().toISOString()
  },

  // Simulate API delay
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Get all marine data
  getAllMarineData: async function() {
    try {
      // Simulate network delay - reduced for stability
      await this.delay(400 + Math.random() * 600); // Random delay 0.4-1s
      
      // Simulate occasional network errors (reduced to 2% chance)
      if (Math.random() < 0.02) {
        throw new Error('Network timeout - please try again');
      }

      // Add some realistic but subtle variation to the data
      const data = { ...this.mockMarineData };
      
      // Only add variation every few calls to reduce fluctuation
      const shouldVary = Math.random() < 0.3; // Only 30% chance of variation
      
      if (shouldVary) {
        // Much smaller variations for more stable display
        data.marine.waterTemperature = this.addRandomVariation(data.marine.waterTemperature, 0.2);
        data.marine.swellHeight = this.addRandomVariation(data.marine.swellHeight, 0.1);
        data.weather.windSpeed = Math.max(0, this.addRandomVariation(data.weather.windSpeed, 1));
        data.fishActivity.score = Math.min(100, Math.max(0, this.addRandomVariation(data.fishActivity.score, 5)));
      
        // Update activity level based on score only if we varied it
        if (data.fishActivity.score >= 80) {
          data.fishActivity.activity = "High";
        } else if (data.fishActivity.score >= 60) {
          data.fishActivity.activity = "Medium";
        } else {
          data.fishActivity.activity = "Low";
        }
      }

      data.lastUpdated = new Date().toISOString();
      
      return data;
    } catch (error) {
      console.error('Marine data service error:', error);
      throw error;
    }
  },

  // Helper function to add random variation
  addRandomVariation: function(value, maxVariation) {
    const variation = (Math.random() - 0.5) * 2 * maxVariation;
    return Math.round((value + variation) * 10) / 10; // Round to 1 decimal place
  },

  // Get historical data (mock)
  getHistoricalData: async function(days = 7) {
    await this.delay(1000);
    
    const historicalData = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      historicalData.push({
        date: date.toISOString().split('T')[0],
        waterTemp: this.addRandomVariation(18.5, 2),
        swellHeight: Math.max(0, this.addRandomVariation(1.2, 0.5)),
        windSpeed: Math.max(0, this.addRandomVariation(12, 5)),
        fishActivity: Math.floor(Math.random() * 100)
      });
    }
    
    return historicalData;
  }
};

export default marineDataService;
