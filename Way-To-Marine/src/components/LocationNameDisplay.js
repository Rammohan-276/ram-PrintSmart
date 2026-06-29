import React, { useState, useEffect } from 'react';

const LocationNameDisplay = ({ location, isLoading }) => {
  const [displayName, setDisplayName] = useState('');
  const [detailedInfo, setDetailedInfo] = useState('');

  // Enhanced location name detection
  const getLocationName = (lat, lon) => {
    // More detailed location detection
    const locations = [
      // North America - West Coast
      { name: "San Francisco Bay", coords: [37.7749, -122.4194], region: "California, USA", bounds: { latMin: 37.4, latMax: 38.1, lonMin: -122.8, lonMax: -121.8 } },
      { name: "Los Angeles Coast", coords: [34.0522, -118.2437], region: "California, USA", bounds: { latMin: 33.5, latMax: 34.5, lonMin: -118.8, lonMax: -117.8 } },
      { name: "Seattle Puget Sound", coords: [47.6062, -122.3321], region: "Washington, USA", bounds: { latMin: 47.2, latMax: 48.0, lonMin: -122.8, lonMax: -121.8 } },
      
      // North America - East Coast
      { name: "New York Harbor", coords: [40.7128, -74.0060], region: "New York, USA", bounds: { latMin: 40.4, latMax: 41.0, lonMin: -74.5, lonMax: -73.5 } },
      { name: "Boston Harbor", coords: [42.3601, -71.0589], region: "Massachusetts, USA", bounds: { latMin: 42.0, latMax: 42.7, lonMin: -71.5, lonMax: -70.5 } },
      { name: "Miami Coast", coords: [25.7617, -80.1918], region: "Florida, USA", bounds: { latMin: 25.4, latMax: 26.1, lonMin: -80.5, lonMax: -79.8 } },
      
      // Gulf of Mexico
      { name: "Gulf of Mexico", coords: [27.5, -85], region: "Gulf Coast", bounds: { latMin: 24, latMax: 31, lonMin: -98, lonMax: -80 } },
      { name: "Houston Ship Channel", coords: [29.7604, -95.3698], region: "Texas, USA", bounds: { latMin: 29.4, latMax: 30.1, lonMin: -95.8, lonMax: -94.8 } },
      
      // North Atlantic
      { name: "North Atlantic Ocean", coords: [45, -30], region: "Atlantic Ocean", bounds: { latMin: 35, latMax: 55, lonMin: -80, lonMax: 20 } },
      { name: "Newfoundland Banks", coords: [47, -50], region: "Canada", bounds: { latMin: 44, latMax: 50, lonMin: -55, lonMax: -45 } },
      
      // Mediterranean
      { name: "Mediterranean Sea", coords: [35, 18], region: "Mediterranean", bounds: { latMin: 30, latMax: 47, lonMin: -6, lonMax: 37 } },
      { name: "Adriatic Sea", coords: [43, 15], region: "Mediterranean", bounds: { latMin: 40, latMax: 46, lonMin: 12, lonMax: 20 } },
      
      // Pacific
      { name: "North Pacific Ocean", coords: [35, -150], region: "Pacific Ocean", bounds: { latMin: 20, latMax: 50, lonMin: -180, lonMax: -120 } },
      { name: "Hawaii Waters", coords: [21.3099, -157.8581], region: "Hawaii, USA", bounds: { latMin: 18, latMax: 24, lonMin: -162, lonMax: -154 } },
      
      // Asia Pacific
      { name: "South China Sea", coords: [15, 115], region: "Southeast Asia", bounds: { latMin: 5, latMax: 25, lonMin: 105, lonMax: 125 } },
      { name: "Sea of Japan", coords: [40, 135], region: "East Asia", bounds: { latMin: 33, latMax: 47, lonMin: 128, lonMax: 142 } },
      { name: "Tokyo Bay", coords: [35.6762, 139.6503], region: "Japan", bounds: { latMin: 35.2, latMax: 35.8, lonMin: 139.4, lonMax: 140.1 } },
      
      // Australia/Oceania
      { name: "Great Barrier Reef", coords: [-18, 147], region: "Australia", bounds: { latMin: -25, latMax: -10, lonMin: 142, lonMax: 154 } },
      { name: "Sydney Harbor", coords: [-33.8688, 151.2093], region: "Australia", bounds: { latMin: -34.2, latMax: -33.5, lonMin: 150.8, lonMax: 151.8 } },
      
      // Europe
      { name: "English Channel", coords: [50.5, 0], region: "UK/France", bounds: { latMin: 49, latMax: 52, lonMin: -5, lonMax: 3 } },
      { name: "Baltic Sea", coords: [57, 20], region: "Northern Europe", bounds: { latMin: 53, latMax: 61, lonMin: 10, lonMax: 30 } },
      { name: "Norwegian Fjords", coords: [62, 7], region: "Norway", bounds: { latMin: 58, latMax: 71, lonMin: 4, lonMax: 15 } },
      
      // Indian Ocean
      { name: "Arabian Sea", coords: [18, 65], region: "Indian Ocean", bounds: { latMin: 10, latMax: 25, lonMin: 50, lonMax: 80 } },
      { name: "Bay of Bengal", coords: [15, 88], region: "Indian Ocean", bounds: { latMin: 5, latMax: 25, lonMin: 80, lonMax: 95 } },
      
      // Southern Ocean
      { name: "Southern Ocean", coords: [-55, 0], region: "Antarctica", bounds: { latMin: -70, latMax: -40, lonMin: -180, lonMax: 180 } },
      
      // Arctic
      { name: "Arctic Ocean", coords: [80, 0], region: "Arctic", bounds: { latMin: 66, latMax: 90, lonMin: -180, lonMax: 180 } },
      { name: "Bering Sea", coords: [60, -175], region: "Alaska/Russia", bounds: { latMin: 54, latMax: 66, lonMin: -180, lonMax: -155 } }
    ];

    // Find closest matching location
    for (const loc of locations) {
      if (lat >= loc.bounds.latMin && lat <= loc.bounds.latMax && 
          lon >= loc.bounds.lonMin && lon <= loc.bounds.lonMax) {
        return {
          name: loc.name,
          region: loc.region,
          type: 'specific'
        };
      }
    }

    // Fallback to general oceanic regions
    if (Math.abs(lat) > 66.5) {
      return {
        name: lat > 0 ? "Arctic Ocean" : "Southern Ocean",
        region: lat > 0 ? "Arctic Region" : "Antarctic Region",
        type: 'polar'
      };
    }

    if (Math.abs(lat) < 23.5) {
      return {
        name: "Tropical Waters",
        region: "Equatorial Zone",
        type: 'tropical'
      };
    }

    // Default ocean basins
    if (lon >= -30 && lon <= 45) {
      return {
        name: lat > 35 ? "North Atlantic Ocean" : "South Atlantic Ocean",
        region: "Atlantic Basin",
        type: 'ocean'
      };
    } else if (lon >= 45 && lon <= 150) {
      return {
        name: lat > 0 ? "North Pacific Ocean" : "South Pacific Ocean", 
        region: "Pacific Basin",
        type: 'ocean'
      };
    } else {
      return {
        name: "Open Ocean",
        region: `${lat > 0 ? 'Northern' : 'Southern'} Hemisphere`,
        type: 'open'
      };
    }
  };

  useEffect(() => {
    if (location && location.lat && location.lon) {
      const locationInfo = getLocationName(location.lat, location.lon);
      setDisplayName(locationInfo.name);
      setDetailedInfo(`${locationInfo.region} • ${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`);
    }
  }, [location]);

  const getLocationIcon = (type) => {
    switch (type) {
      case 'specific': return '🏖️';
      case 'tropical': return '🏝️';
      case 'polar': return '🧊';
      case 'ocean': return '🌊';
      default: return '🗺️';
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#ffffff',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        zIndex: 1002,
        border: '1px solid rgba(100, 255, 218, 0.3)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        minWidth: '200px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        opacity: isLoading ? 0.7 : 1
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>
          {isLoading ? '⏳' : getLocationIcon(getLocationName(location?.lat || 0, location?.lon || 0).type)}
        </span>
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            color: isLoading ? '#9ca3af' : '#64ffda',
            fontSize: '15px'
          }}>
            {isLoading ? 'Loading location...' : displayName}
          </div>
          {!isLoading && (
            <div style={{ 
              fontSize: '11px', 
              color: '#9ca3af', 
              marginTop: '2px'
            }}>
              {detailedInfo}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationNameDisplay;