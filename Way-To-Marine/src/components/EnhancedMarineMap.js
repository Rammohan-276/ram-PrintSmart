import React, { useState, useEffect, useRef } from 'react';
import MarineMap from './MarineMap';
import LeafletMap from './LeafletMap';
import AdvancedDeckMap from './AdvancedDeckMap';
import DraggableMapPin from './DraggableMapPin';
import LocationNameDisplay from './LocationNameDisplay';

const MAP_PROVIDERS = {
  MAPBOX_DECK: 'mapbox_deck',
  LEAFLET_OSM: 'leaflet_osm',
  ADVANCED_DECK: 'advanced_deck'
};

const EnhancedMarineMap = ({ 
  defaultProvider = MAP_PROVIDERS.ADVANCED_DECK,
  height = '600px',
  allowProviderSwitch = true,
  center = [37.7749, -122.4194],
  zoom = 10,
  onLocationChange,
  isDragging = false,
  onDragStart,
  onDragEnd
}) => {
  const [selectedProvider, setSelectedProvider] = useState(defaultProvider);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [currentViewState, setCurrentViewState] = useState({
    latitude: center[0],
    longitude: center[1], 
    zoom: zoom || 10
  });
  const [currentLocation, setCurrentLocation] = useState({
    lat: center[0],
    lon: center[1]
  });
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Handle pin drop on map
  const handlePinDrop = async (dropInfo) => {
    console.log('📍 EnhancedMarineMap - Pin dropped at:', dropInfo);
    console.log('📋 Current view state:', currentViewState);
    
    setIsLocationLoading(true);
    
    try {
      // Convert relative coordinates to lat/lng based on current map view
      const { x, y } = dropInfo;
      
      // Improved coordinate conversion using Web Mercator projection approximation
      const zoomFactor = Math.pow(2, currentViewState.zoom);
      const latRange = 180 / zoomFactor; // Degrees latitude per zoom level
      const lonRange = 360 / zoomFactor; // Degrees longitude per zoom level
      
      // Calculate bounds more accurately
      const viewBounds = {
        north: Math.min(85, currentViewState.latitude + (latRange / 2)),
        south: Math.max(-85, currentViewState.latitude - (latRange / 2)),
        east: currentViewState.longitude + (lonRange / 2),
        west: currentViewState.longitude - (lonRange / 2)
      };
      
      console.log('🗺️ View bounds calculated:', viewBounds);
      console.log('📎 Relative position:', { x, y });
      
      // Convert relative position to geographic coordinates
      const lat = viewBounds.north - (y * (viewBounds.north - viewBounds.south));
      const lon = viewBounds.west + (x * (viewBounds.east - viewBounds.west));
      
      console.log('🌍 Raw coordinates:', { lat, lon });
      
      // Constrain coordinates to valid ranges
      const constrainedLat = Math.max(-90, Math.min(90, lat));
      const constrainedLon = ((lon + 180) % 360) - 180; // Wrap longitude to -180 to 180
      
      console.log('📍 Constrained coordinates:', { lat: constrainedLat, lon: constrainedLon });
      
      // Update current location immediately
      const newLocation = { lat: constrainedLat, lon: constrainedLon };
      setCurrentLocation(newLocation);
      
      console.log(`✅ Final location set: ${newLocation.lat.toFixed(4)}, ${newLocation.lon.toFixed(4)}`);
      
      // Simulate brief loading delay for user feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trigger location change callback
      if (onLocationChange) {
        onLocationChange(newLocation);
      }
      
    } catch (error) {
      console.error('Error processing pin drop:', error);
    } finally {
      setIsLocationLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update current location when center prop changes
  useEffect(() => {
    if (center && center.length >= 2) {
      setCurrentLocation({
        lat: center[0],
        lon: center[1]
      });
    }
  }, [center]);

  // Initialize and debug view state
  useEffect(() => {
    console.log('📋 View state updated:', currentViewState);
  }, [currentViewState]);

  // Initialize current view state with center
  useEffect(() => {
    if (center && center.length >= 2) {
      setCurrentViewState({
        latitude: center[0],
        longitude: center[1],
        zoom: zoom || 10
      });
      console.log('🎯 Initialized view state with center:', { lat: center[0], lon: center[1], zoom });
    }
  }, [center, zoom]);

  const handleProviderChange = async (newProvider) => {
    if (newProvider === selectedProvider) return;
    
    setIsLoading(true);
    // Small delay to show loading state
    setTimeout(() => {
      setSelectedProvider(newProvider);
      setIsLoading(false);
    }, 300);
  };

  const renderMap = () => {
    if (isLoading) {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a202c',
          color: '#64ffda',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(100, 255, 218, 0.3)',
            borderTop: '3px solid #64ffda',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <div>Loading advanced marine visualization...</div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      );
    }

    switch (selectedProvider) {
      case MAP_PROVIDERS.MAPBOX_DECK:
        return (
          <MarineMap 
            center={center} 
            zoom={zoom} 
            onLocationChange={onLocationChange}
            isDragging={isDragging}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        );
      case MAP_PROVIDERS.LEAFLET_OSM:
        return (
          <LeafletMap 
            center={center} 
            zoom={zoom}
            onLocationChange={onLocationChange}
            isDragging={isDragging}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        );
      case MAP_PROVIDERS.ADVANCED_DECK:
        return (
          <AdvancedDeckMap 
            center={center} 
            zoom={zoom}
            onLocationChange={onLocationChange}
            isDragging={isDragging}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onViewStateChange={(viewState) => setCurrentViewState(viewState)}
          />
        );
      default:
        return (
          <AdvancedDeckMap 
            center={center} 
            zoom={zoom}
            onLocationChange={onLocationChange}
            isDragging={isDragging}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onViewStateChange={(viewState) => setCurrentViewState(viewState)}
          />
        );
    }
  };

  const getProviderInfo = (provider) => {
    switch (provider) {
      case MAP_PROVIDERS.MAPBOX_DECK:
        return {
          name: 'Mapbox + deck.gl',
          description: 'High-performance GPU visualization with Mapbox base maps',
          icon: '🗺️',
          features: ['GPU Acceleration', 'Mapbox Styling', 'Interactive Layers'],
          recommended: 'General Use'
        };
      case MAP_PROVIDERS.LEAFLET_OSM:
        return {
          name: 'Leaflet + OpenStreetMap',
          description: 'Lightweight, open-source mapping with multiple base layers',
          icon: '🌍',
          features: ['Open Source', 'Multiple Base Maps', 'Lightweight'],
          recommended: 'Open Data'
        };
      case MAP_PROVIDERS.ADVANCED_DECK:
        return {
          name: 'Advanced deck.gl',
          description: 'Scientific-grade visualization with advanced analytics',
          icon: '🔬',
          features: ['Scientific Analysis', 'Advanced Layers', 'Research Tools'],
          recommended: 'Scientific Research'
        };
      default:
        return { name: 'Unknown', description: '', icon: '❓', features: [], recommended: '' };
    }
  };

  return (
    <div style={{ width: '100%', height: height, position: 'relative' }}>
      {/* Map Provider Dropdown */}
      {allowProviderSwitch && (
        <div 
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            zIndex: 1000,
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px'
          }}>
          {/* Dropdown Toggle Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '1px solid rgba(100, 255, 218, 0.3)',
              borderRadius: '8px',
              color: '#64ffda',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <span>🎯</span>
            <span>{getProviderInfo(selectedProvider).name}</span>
            <span style={{ 
              transition: 'transform 0.2s ease',
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>▼</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              marginTop: '4px',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '1px solid rgba(100, 255, 218, 0.3)',
              borderRadius: '8px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
              minWidth: '320px',
              maxWidth: '380px',
              animation: 'dropdownFade 0.2s ease-out'
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(100, 255, 218, 0.2)',
                color: '#64ffda',
                fontWeight: 'bold',
                fontSize: '13px'
              }}>
                Select Map Engine
              </div>
              
              {Object.values(MAP_PROVIDERS).map(provider => {
                const info = getProviderInfo(provider);
                const isSelected = selectedProvider === provider;
                
                return (
                  <div
                    key={provider}
                    onClick={() => {
                      handleProviderChange(provider);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      backgroundColor: isSelected 
                        ? 'rgba(100, 255, 218, 0.1)' 
                        : 'transparent',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '16px' }}>{info.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          color: isSelected ? '#64ffda' : '#e5e7eb',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          fontSize: '13px'
                        }}>
                          {info.name}
                          {isSelected && <span style={{ color: '#22c55e', fontSize: '10px', marginLeft: '8px' }}>● ACTIVE</span>}
                        </div>
                        <div style={{ 
                          color: '#9ca3af', 
                          fontSize: '10px',
                          lineHeight: '1.3',
                          marginTop: '2px'
                        }}>
                          {info.description}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '4px',
                      marginBottom: '4px'
                    }}>
                      {info.features.map((feature, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '8px',
                            padding: '2px 5px',
                            backgroundColor: isSelected 
                              ? 'rgba(100, 255, 218, 0.2)' 
                              : 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: isSelected ? '#64ffda' : '#d1d5db'
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {info.recommended && (
                      <div style={{ 
                        fontSize: '9px', 
                        color: isSelected ? '#fbbf24' : '#6b7280',
                        fontStyle: 'italic'
                      }}>
                        Best for: {info.recommended}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* CSS for dropdown animation */}
          <style>
            {`
              @keyframes dropdownFade {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {renderMap()}
        
        {/* Location Name Display */}
        <LocationNameDisplay 
          location={currentLocation}
          isLoading={isLocationLoading}
        />
        
        {/* Draggable Pin */}
        <DraggableMapPin 
          onDrop={handlePinDrop}
          mapContainerRef={mapContainerRef}
        />
        
        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: '#64ffda',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '10px',
            zIndex: 1003
          }}>
            Map Ref: {mapContainerRef.current ? '✅' : '❌'} | 
            Location: {currentLocation.lat.toFixed(2)}, {currentLocation.lon.toFixed(2)} |
            Loading: {isLocationLoading ? '⏳' : '✅'}
          </div>
        )}
      </div>

      {/* Performance Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '6px',
        padding: '6px 10px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '10px',
        color: '#64ffda',
        border: '1px solid rgba(100, 255, 218, 0.2)'
      }}>
        🚀 {getProviderInfo(selectedProvider).name} Engine
      </div>
    </div>
  );
};

export default EnhancedMarineMap;