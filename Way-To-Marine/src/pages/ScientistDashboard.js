import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import EnhancedMarineMap from "../components/EnhancedMarineMap";
import marineDataService from "../services/marineDataService";

const ScientistDashboard = () => {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Welcome to the Scientific AI Assistant! How can I help you with your marine research today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);
  
  // Location-based state management
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 37.7749,
    lon: -122.4194,
    name: "San Francisco Bay",
    area: "California Coast"
  });
  const [locationData, setLocationData] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch location-specific marine data
  const fetchLocationData = useCallback(async (location) => {
    setIsLoadingLocation(true);
    try {
      // Simulate location-specific data fetch
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = await marineDataService.getAllMarineData();
      
      // Modify data based on location
      const locationSpecificData = {
        ...data,
        location: {
          ...location,
          coordinates: `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`
        },
        // Simulate location-based variations
        marine: {
          ...data.marine,
          waterTemperature: getLocationTemperature(location.lat),
          salinity: getLocationSalinity(location.lat, location.lon),
          visibility: getLocationVisibility(location),
        },
        biodiversity: getLocationBiodiversity(location),
        researchMetrics: getLocationResearchMetrics(location)
      };
      
      setLocationData(locationSpecificData);
      console.log(`Updated data for location: ${location.name} (${location.lat}, ${location.lon})`);
      
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  // Location-based data calculations
  const getLocationTemperature = (lat) => {
    // Simulate temperature based on latitude
    const baseTemp = 15;
    const latEffect = (40 - Math.abs(lat)) * 0.3; // Warmer near equator
    return Math.round((baseTemp + latEffect + Math.random() * 4) * 10) / 10;
  };

  const getLocationSalinity = (lat, lon) => {
    // Simulate salinity variations
    const baseSalinity = 34.7;
    const variation = (Math.sin(lat * 0.1) + Math.cos(lon * 0.1)) * 1.5;
    return Math.round((baseSalinity + variation) * 10) / 10;
  };

  const getLocationVisibility = (location) => {
    // Random visibility with location-based factors
    return Math.round((10 + Math.random() * 15) * 10) / 10;
  };

  const getLocationBiodiversity = (location) => {
    const baseCounts = {
      fishSpecies: 180,
      cephalopods: 35,
      coralTypes: 12,
      crustaceans: 75
    };
    
    // Vary counts based on location
    const latFactor = Math.abs(location.lat) < 30 ? 1.3 : 0.8; // More species near equator
    
    return {
      fishSpecies: Math.round(baseCounts.fishSpecies * latFactor * (0.8 + Math.random() * 0.4)),
      cephalopods: Math.round(baseCounts.cephalopods * latFactor * (0.7 + Math.random() * 0.6)),
      coralTypes: Math.round(baseCounts.coralTypes * latFactor * (0.6 + Math.random() * 0.8)),
      crustaceans: Math.round(baseCounts.crustaceans * latFactor * (0.9 + Math.random() * 0.2))
    };
  };

  const getLocationResearchMetrics = (location) => {
    return {
      dataPoints: Math.round(8000 + Math.random() * 10000),
      researchPapers: Math.round(20 + Math.random() * 30),
      activeStudies: Math.round(3 + Math.random() * 8),
      accuracyRate: Math.round((92 + Math.random() * 6) * 10) / 10
    };
  };

  // Handle location change from map
  const handleLocationChange = useCallback((newLocation) => {
    console.log('Location changed to:', newLocation);
    
    // Update location name based on coordinates (simplified)
    const locationName = getLocationName(newLocation.lat, newLocation.lon);
    const locationArea = getLocationArea(newLocation.lat, newLocation.lon);
    
    const updatedLocation = {
      ...newLocation,
      name: locationName,
      area: locationArea
    };
    
    setSelectedLocation(updatedLocation);
    fetchLocationData(updatedLocation);
    
    // Add chat message about location change
    setChatMessages(prev => [...prev, {
      type: 'bot',
      message: `📍 Location updated to ${locationName} (${newLocation.lat.toFixed(4)}, ${newLocation.lon.toFixed(4)}). Fetching marine data for this area...`
    }]);
  }, [fetchLocationData]);

  // Helper functions for location naming
  const getLocationName = (lat, lon) => {
    // Simplified location naming based on coordinates
    if (lat > 35 && lat < 40 && lon > -125 && lon < -120) return "California Coast";
    if (lat > 25 && lat < 30 && lon > -90 && lon < -80) return "Gulf of Mexico";
    if (lat > 40 && lat < 50 && lon > -75 && lon < -65) return "North Atlantic";
    if (lat > -10 && lat < 10) return "Equatorial Waters";
    if (Math.abs(lat) > 60) return "Polar Region";
    return "Open Ocean";
  };

  const getLocationArea = (lat, lon) => {
    if (Math.abs(lat) < 23.5) return "Tropical Zone";
    if (Math.abs(lat) < 66.5) return "Temperate Zone";
    return "Arctic/Antarctic Zone";
  };

  // Initialize data on mount
  useEffect(() => {
    fetchLocationData(selectedLocation);
  }, [fetchLocationData, selectedLocation.lat, selectedLocation.lon]);

  const handleSendMessage = async () => {
  if (chatInput.trim()) {
    // 1. Add user message immediately to chat
    setChatMessages(prev => [...prev, { type: 'user', message: chatInput }]);

    try {
      // 2. Call your n8n webhook (replace with your actual URL)
      const response = await fetch("http://localhost:5678/webhook/397adead-30de-48d6-8755-068f66de5464", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: chatInput }),
      });

      const data = await response.json();

      // 3. Add Gemini’s reply to chat
      setChatMessages(prev => [...prev, { type: 'bot', message: data.reply }]);
    } catch (error) {
      // Handle errors
      setChatMessages(prev => [...prev, { type: 'bot', message: "⚠️ Error connecting to AI service." }]);
    }

    // 4. Clear input
    setChatInput('');
  }
};



  const handleActionClick = (action) => {
    if (action === 'data-analysis') {
      navigate('/data-analysis');
    } else if (action === 'taxonomy-module') {
      navigate('/taxonomy-module');
    } else if (action === 'otolith-morphology') {
      navigate('/otolith-morphology');
    } else if (action === 'environment-dna') {
      navigate('/environmental-dna');
    } else {
      setSelectedAction(action);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-title-container">
        <h1 className="dashboard-title">Scientific Dashboard</h1>
      </div>
      <div className="scientific-dashboard-grid">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          {/* Action Buttons */}
          <div className="action-buttons-section">
            <h3 className="section-title">Marine Operations</h3>
            <div className="action-buttons">
              <button 
                className={`action-btn ${selectedAction === 'data-analysis' ? 'active' : ''}`}
                onClick={() => handleActionClick('data-analysis')}
              >
                <span className="btn-icon">📊</span>
                <span className="btn-text">Data Analysis</span>
              </button>
              <button 
                className={`action-btn ${selectedAction === 'taxonomy-module' ? 'active' : ''}`}
                onClick={() => handleActionClick('taxonomy-module')}
              >
                <span className="btn-icon">🐠</span>
                <span className="btn-text">Taxonomy Module</span>
              </button>
              <button 
                className={`action-btn ${selectedAction === 'otolith-morphology' ? 'active' : ''}`}
                onClick={() => handleActionClick('otolith-morphology')}
              >
                <span className="btn-icon">🦴</span>
                <span className="btn-text">Otolith Morphology Module</span>
              </button>
              <button 
                className={`action-btn ${selectedAction === 'environment-dna' ? 'active' : ''}`}
                onClick={() => handleActionClick('environment-dna')}
              >
                <span className="btn-icon">🧬</span>
                <span className="btn-text">Environment DNA Module</span>
              </button>
            </div>
          </div>

          {/* ML Model Prediction Section */}
          <div className="ml-prediction-section">
            <h3 className="section-title">ML Predictions & Creativity</h3>
            <div className="prediction-panel">
              <div className="prediction-item">
                <div className="prediction-label">Fish Population Forecast</div>
                <div className="prediction-value high">87% Increase</div>
                <div className="prediction-confidence">Confidence: 94%</div>
              </div>
              <div className="prediction-item">
                <div className="prediction-label">Ocean Temperature Trend</div>
                <div className="prediction-value moderate">+0.3°C Next Month</div>
                <div className="prediction-confidence">Confidence: 89%</div>
              </div>
              <div className="prediction-item">
                <div className="prediction-label">Optimal Fishing Zones</div>
                <div className="prediction-value excellent">5 New Areas Identified</div>
                <div className="prediction-confidence">Confidence: 91%</div>
              </div>
              <div className="creativity-section">
                <h4>AI-Generated Insights</h4>
                <p>Based on current data patterns, the AI suggests exploring coral reef restoration in zones 12-A and 15-C for enhanced biodiversity.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center World Map */}
        <div className="center-map">
          <div className="map-container">
            <div className="map-header">
              <h3 className="map-title">🔬 Advanced Marine Data Visualization</h3>
              <div className="location-info">
                <div className="current-location">
                  <span className="location-icon">📍</span>
                  <div className="location-details">
                    <div className="location-name">{selectedLocation.name}</div>
                    <div className="location-coords">
                      {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
                    </div>
                  </div>
                  {isLoadingLocation && (
                    <div className="loading-indicator">
                      <span className="loading-spinner">⏳</span>
                      <span>Loading...</span>
                    </div>
                  )}
                </div>
                <div className="drag-instruction">
                  <span className="drag-icon">🖱️</span>
                  <span>Drag the map marker to explore different locations</span>
                </div>
              </div>
            </div>
            <div className="marine-map-wrapper" style={{ height: '600px' }}>
              <EnhancedMarineMap 
                defaultProvider="advanced_deck"
                height="100%"
                allowProviderSwitch={true}
                center={[selectedLocation.lat, selectedLocation.lon]}
                onLocationChange={handleLocationChange}
                isDragging={isDragging}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          {/* Upper Half - Three Panels */}
          <div className="upper-panels">
            <div className={`info-panel panel-1 ${isLoadingLocation ? 'loading' : ''}`}>
              <h4>Ocean Conditions</h4>
              <div className="panel-content">
                <div className="data-item">
                  <span className="label">Temperature:</span>
                  <span className="value">
                    {isLoadingLocation ? '...' : `${locationData?.marine?.waterTemperature || '--'}°C`}
                  </span>
                </div>
                <div className="data-item">
                  <span className="label">Salinity:</span>
                  <span className="value">
                    {isLoadingLocation ? '...' : `${locationData?.marine?.salinity || '--'} PSU`}
                  </span>
                </div>
                <div className="data-item">
                  <span className="label">Visibility:</span>
                  <span className="value">
                    {isLoadingLocation ? '...' : `${locationData?.marine?.visibility || '--'} m`}
                  </span>
                </div>
                <div className="data-item">
                  <span className="label">Current:</span>
                  <span className="value">
                    {isLoadingLocation ? '...' : `${locationData?.marine?.currentSpeed || '--'} ${locationData?.marine?.currentDirection || ''}`}
                  </span>
                </div>
              </div>
              {isLoadingLocation && <div className="panel-overlay">⏳ Updating...</div>}
            </div>

            <div className={`info-panel panel-2 ${isLoadingLocation ? 'loading' : ''}`}>
              <h4>Marine Biodiversity - {selectedLocation.area}</h4>
              <div className="panel-content">
                <div className="biodiversity-item">
                  <span className="species">🐟 Fish Species</span>
                  <span className="count">
                    {isLoadingLocation ? '...' : (locationData?.biodiversity?.fishSpecies || '--')}
                  </span>
                </div>
                <div className="biodiversity-item">
                  <span className="species">🦑 Cephalopods</span>
                  <span className="count">
                    {isLoadingLocation ? '...' : (locationData?.biodiversity?.cephalopods || '--')}
                  </span>
                </div>
                <div className="biodiversity-item">
                  <span className="species">🪸 Coral Types</span>
                  <span className="count">
                    {isLoadingLocation ? '...' : (locationData?.biodiversity?.coralTypes || '--')}
                  </span>
                </div>
                <div className="biodiversity-item">
                  <span className="species">🦐 Crustaceans</span>
                  <span className="count">
                    {isLoadingLocation ? '...' : (locationData?.biodiversity?.crustaceans || '--')}
                  </span>
                </div>
              </div>
              {isLoadingLocation && <div className="panel-overlay">⏳ Updating...</div>}
            </div>

            <div className={`info-panel panel-3 ${isLoadingLocation ? 'loading' : ''}`}>
              <h4>Research Metrics</h4>
              <div className="panel-content">
                <div className="metric-item">
                  <span className="metric-label">Data Points Collected</span>
                  <span className="metric-value">
                    {isLoadingLocation ? '...' : (locationData?.researchMetrics?.dataPoints?.toLocaleString() || '--')}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Research Papers</span>
                  <span className="metric-value">
                    {isLoadingLocation ? '...' : (locationData?.researchMetrics?.researchPapers || '--')}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Active Studies</span>
                  <span className="metric-value">
                    {isLoadingLocation ? '...' : (locationData?.researchMetrics?.activeStudies || '--')}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Accuracy Rate</span>
                  <span className="metric-value">
                    {isLoadingLocation ? '...' : `${locationData?.researchMetrics?.accuracyRate || '--'}%`}
                  </span>
                </div>
              </div>
              {isLoadingLocation && <div className="panel-overlay">⏳ Updating...</div>}
            </div>
          </div>

          {/* Lower Half - AI Chatbot */}
          <div className="chatbot-section">
            <h3 className="section-title">AI Research Assistant</h3>
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    <div className="message-content">
                      {msg.type === 'bot' && <span className="bot-icon">🤖</span>}
                      <span className="message-text">{msg.message}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input-container">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask me about marine data, research insights, or analysis..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="send-btn" onClick={handleSendMessage}>
                  <span>📤</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientistDashboard;
