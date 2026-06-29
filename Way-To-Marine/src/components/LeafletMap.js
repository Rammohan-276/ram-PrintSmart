import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons for marine data
const createCustomIcon = (color, symbol) => {
  return L.divIcon({
    html: `<div style="
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: ${color};
      color: white;
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${symbol}</div>`,
    className: 'custom-div-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Sample marine data - replace with your actual data sources
const MARINE_DATA = {
  fishSightings: [
    { 
      id: 1, 
      position: [37.8, -122.4], 
      species: 'Salmon', 
      count: 45, 
      temperature: 18.5,
      timestamp: '2024-01-15 10:30'
    },
    { 
      id: 2, 
      position: [37.9, -122.5], 
      species: 'Tuna', 
      count: 23, 
      temperature: 19.2,
      timestamp: '2024-01-15 11:15'
    },
    { 
      id: 3, 
      position: [37.7, -122.3], 
      species: 'Cod', 
      count: 67, 
      temperature: 17.8,
      timestamp: '2024-01-15 09:45'
    },
    { 
      id: 4, 
      position: [37.6, -122.6], 
      species: 'Mackerel', 
      count: 34, 
      temperature: 18.9,
      timestamp: '2024-01-15 12:00'
    },
  ],
  
  researchStations: [
    { 
      id: 1, 
      position: [37.8, -122.4], 
      name: 'Station Alpha', 
      type: 'Main Hub', 
      status: 'Active',
      equipment: ['CTD Sensor', 'ADCP', 'Weather Station']
    },
    { 
      id: 2, 
      position: [37.6, -122.6], 
      name: 'Station Beta', 
      type: 'Monitoring', 
      status: 'Active',
      equipment: ['Temperature Logger', 'pH Sensor']
    },
    { 
      id: 3, 
      position: [37.5, -122.2], 
      name: 'Station Gamma', 
      type: 'Research', 
      status: 'Maintenance',
      equipment: ['Sediment Trap', 'Current Meter']
    },
  ],
  
  oceanCurrents: [
    {
      id: 1,
      path: [[37.8, -122.5], [37.9, -122.4], [38.0, -122.3]],
      speed: 2.3,
      direction: 'NE',
      name: 'California Current'
    },
    {
      id: 2,
      path: [[37.7, -122.6], [37.8, -122.5], [37.9, -122.4]],
      speed: 1.8,
      direction: 'E',
      name: 'Coastal Upwelling'
    },
  ],
  
  temperatureZones: [
    { id: 1, position: [37.8, -122.4], temperature: 18.5, radius: 2000 },
    { id: 2, position: [37.9, -122.5], temperature: 19.2, radius: 1800 },
    { id: 3, position: [37.7, -122.3], temperature: 17.8, radius: 2200 },
    { id: 4, position: [37.6, -122.6], temperature: 18.9, radius: 1900 },
    { id: 5, position: [37.5, -122.2], temperature: 20.1, radius: 2100 },
  ]
};

const LeafletMap = ({ center = [37.7749, -122.4194], zoom = 10 }) => {

  // Get color based on temperature for fish sightings and temperature zones
  const getTemperatureColor = (temp) => {
    if (temp > 19) return '#ff6464'; // Warm - Red
    if (temp > 18) return '#ffd700'; // Medium - Yellow
    return '#64b5ff'; // Cold - Blue
  };

  // Get station status color
  const getStationColor = (status) => {
    return status === 'Active' ? '#00ff00' : '#ffa500';
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <LayersControl position="topright">
          {/* Base Layers */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.arcgis.com/">ArcGIS</a>'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>'
            />
          </LayersControl.BaseLayer>

          {/* Overlay Layers */}
          
          {/* Fish Sightings Layer */}
          <LayersControl.Overlay checked name="Fish Sightings 🐟">
            <>
              {MARINE_DATA.fishSightings.map(fish => (
                <Marker
                  key={fish.id}
                  position={fish.position}
                  icon={createCustomIcon(getTemperatureColor(fish.temperature), '🐟')}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#2563eb' }}>Fish Sighting</h4>
                      <div><strong>Species:</strong> {fish.species}</div>
                      <div><strong>Count:</strong> {fish.count}</div>
                      <div><strong>Water Temperature:</strong> {fish.temperature}°C</div>
                      <div><strong>Timestamp:</strong> {fish.timestamp}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </>
          </LayersControl.Overlay>

          {/* Research Stations Layer */}
          <LayersControl.Overlay checked name="Research Stations 🔬">
            <>
              {MARINE_DATA.researchStations.map(station => (
                <Marker
                  key={station.id}
                  position={station.position}
                  icon={createCustomIcon(getStationColor(station.status), '🔬')}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#059669' }}>Research Station</h4>
                      <div><strong>Name:</strong> {station.name}</div>
                      <div><strong>Type:</strong> {station.type}</div>
                      <div><strong>Status:</strong> 
                        <span style={{ 
                          color: station.status === 'Active' ? '#059669' : '#d97706',
                          fontWeight: 'bold'
                        }}> {station.status}</span>
                      </div>
                      <div><strong>Equipment:</strong></div>
                      <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                        {station.equipment.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </>
          </LayersControl.Overlay>

          {/* Ocean Currents Layer */}
          <LayersControl.Overlay checked name="Ocean Currents 🌊">
            <>
              {MARINE_DATA.oceanCurrents.map(current => (
                <Polyline
                  key={current.id}
                  positions={current.path}
                  color={current.speed > 2.5 ? '#ef4444' : current.speed > 2 ? '#f59e0b' : '#10b981'}
                  weight={Math.max(2, current.speed * 2)}
                  opacity={0.8}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#0891b2' }}>Ocean Current</h4>
                      <div><strong>Name:</strong> {current.name}</div>
                      <div><strong>Speed:</strong> {current.speed} m/s</div>
                      <div><strong>Direction:</strong> {current.direction}</div>
                    </div>
                  </Popup>
                </Polyline>
              ))}
            </>
          </LayersControl.Overlay>

          {/* Temperature Zones Layer */}
          <LayersControl.Overlay checked name="Temperature Zones 🌡️">
            <>
              {MARINE_DATA.temperatureZones.map(zone => (
                <Circle
                  key={zone.id}
                  center={zone.position}
                  radius={zone.radius}
                  fillColor={getTemperatureColor(zone.temperature)}
                  fillOpacity={0.3}
                  color={getTemperatureColor(zone.temperature)}
                  weight={2}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#dc2626' }}>Temperature Zone</h4>
                      <div><strong>Temperature:</strong> {zone.temperature}°C</div>
                      <div><strong>Coverage Radius:</strong> {zone.radius}m</div>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </>
          </LayersControl.Overlay>
        </LayersControl>

        {/* Custom Legend */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          zIndex: 1000,
          minWidth: '200px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>Marine Data Legend</h4>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#ff6464' }}>●</span> Warm Water (&gt;19°C)
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#ffd700' }}>●</span> Medium Water (18-19°C)
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#64b5ff' }}>●</span> Cool Water (&lt;18°C)
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#00ff00' }}>●</span> Active Stations
          </div>
          <div>
            <span style={{ color: '#ffa500' }}>●</span> Maintenance Stations
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;