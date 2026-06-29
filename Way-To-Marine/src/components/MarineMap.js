import React, { useState, useEffect } from 'react';
import Map from 'react-map-gl/mapbox';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, PathLayer, TextLayer, BitmapLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { TileLayer } from '@deck.gl/geo-layers';

// Sample marine data - replace with your actual data sources
const MARINE_DATA = {
  fishSightings: [
    { position: [-122.4, 37.8], species: 'Salmon', count: 45, temperature: 18.5 },
    { position: [-122.5, 37.9], species: 'Tuna', count: 23, temperature: 19.2 },
    { position: [-122.3, 37.7], species: 'Cod', count: 67, temperature: 17.8 },
    { position: [-122.6, 37.6], species: 'Mackerel', count: 34, temperature: 18.9 },
    { position: [-122.2, 37.5], species: 'Anchovy', count: 89, temperature: 20.1 },
    { position: [-122.7, 37.4], species: 'Sardine', count: 112, temperature: 19.7 },
    { position: [-122.1, 37.3], species: 'Herring', count: 78, temperature: 18.3 },
  ],
  
  oceanCurrents: [
    { path: [[-122.5, 37.8], [-122.4, 37.9], [-122.3, 38.0]], speed: 2.3, direction: 'NE' },
    { path: [[-122.6, 37.7], [-122.5, 37.8], [-122.4, 37.9]], speed: 1.8, direction: 'E' },
    { path: [[-122.4, 37.6], [-122.3, 37.7], [-122.2, 37.8]], speed: 3.1, direction: 'NW' },
    { path: [[-122.7, 37.5], [-122.6, 37.6], [-122.5, 37.7]], speed: 2.7, direction: 'N' },
  ],
  
  temperatureZones: [
    { position: [-122.4, 37.8], temperature: 18.5, intensity: 0.8 },
    { position: [-122.5, 37.9], temperature: 19.2, intensity: 0.9 },
    { position: [-122.3, 37.7], temperature: 17.8, intensity: 0.7 },
    { position: [-122.6, 37.6], temperature: 18.9, intensity: 0.85 },
    { position: [-122.2, 37.5], temperature: 20.1, intensity: 1.0 },
    { position: [-122.7, 37.4], temperature: 19.7, intensity: 0.95 },
    { position: [-122.1, 37.3], temperature: 18.3, intensity: 0.75 },
  ],
  
  researchStations: [
    { position: [-122.4, 37.8], name: 'Station Alpha', type: 'Main Hub', status: 'Active' },
    { position: [-122.6, 37.6], name: 'Station Beta', type: 'Monitoring', status: 'Active' },
    { position: [-122.2, 37.5], name: 'Station Gamma', type: 'Research', status: 'Maintenance' },
    { position: [-122.7, 37.4], name: 'Station Delta', type: 'Data Collection', status: 'Active' },
  ]
};

const INITIAL_VIEW_STATE = {
  longitude: -122.4,
  latitude: 37.7,
  zoom: 10,
  pitch: 0,
  bearing: 0
};

// You'll need a Mapbox access token - you can get a free one at https://mapbox.com
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const USE_MAPBOX = MAPBOX_TOKEN && MAPBOX_TOKEN !== 'pk.your-mapbox-token' && MAPBOX_TOKEN !== 'pk.your-mapbox-token-here';

// OpenStreetMap tiles component for fallback
const OpenStreetMapTiles = ({ viewState }) => {
  const tileLayer = new TileLayer({
    id: 'osm-tiles',
    data: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: props => {
      const {
        bbox: { west, south, east, north }
      } = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north]
      });
    }
  });

  return (
    <DeckGL
      viewState={viewState}
      layers={[tileLayer]}
      controller={false}
    >
      {/* Fallback notice */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#64ffda',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '11px',
        fontFamily: 'Inter, sans-serif',
        border: '1px solid rgba(100, 255, 218, 0.3)',
        maxWidth: '200px',
        zIndex: 1000
      }}>
        🌍 Using OpenStreetMap - Add Mapbox token for enhanced satellite imagery
      </div>
    </DeckGL>
  );
};

const MarineMap = () => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [hoveredObject, setHoveredObject] = useState(null);

  useEffect(() => {
    const newLayers = [];

    // Fish Sightings Layer (Scatterplot)
    if (selectedLayer === 'all' || selectedLayer === 'fish') {
      newLayers.push(
        new ScatterplotLayer({
          id: 'fish-sightings',
          data: MARINE_DATA.fishSightings,
          getPosition: d => d.position,
          getRadius: d => d.count * 10,
          getFillColor: d => {
            const temp = d.temperature;
            if (temp > 19) return [255, 100, 100, 200]; // Warm - Red
            if (temp > 18) return [255, 255, 100, 200]; // Medium - Yellow  
            return [100, 200, 255, 200]; // Cold - Blue
          },
          radiusMinPixels: 5,
          radiusMaxPixels: 50,
          pickable: true,
          onHover: info => setHoveredObject(info.object ? {
            ...info.object,
            x: info.x,
            y: info.y,
            type: 'Fish Sighting'
          } : null)
        })
      );
    }

    // Ocean Temperature Heatmap
    if (selectedLayer === 'all' || selectedLayer === 'temperature') {
      newLayers.push(
        new HeatmapLayer({
          id: 'temperature-heatmap',
          data: MARINE_DATA.temperatureZones,
          getPosition: d => d.position,
          getWeight: d => d.intensity,
          radiusPixels: 100,
          colorRange: [
            [0, 0, 255, 100],    // Blue (cold)
            [0, 255, 255, 150],  // Cyan
            [0, 255, 0, 180],    // Green
            [255, 255, 0, 200],  // Yellow
            [255, 165, 0, 220],  // Orange
            [255, 0, 0, 255]     // Red (hot)
          ]
        })
      );
    }

    // Ocean Currents Layer (Path)
    if (selectedLayer === 'all' || selectedLayer === 'currents') {
      newLayers.push(
        new PathLayer({
          id: 'ocean-currents',
          data: MARINE_DATA.oceanCurrents,
          getPath: d => d.path,
          getColor: d => {
            const speed = d.speed;
            if (speed > 2.5) return [255, 0, 0, 200];   // Fast - Red
            if (speed > 2) return [255, 165, 0, 200];   // Medium - Orange
            return [0, 255, 0, 200];                    // Slow - Green
          },
          getWidth: d => d.speed * 3,
          widthMinPixels: 2,
          pickable: true,
          onHover: info => setHoveredObject(info.object ? {
            ...info.object,
            x: info.x,
            y: info.y,
            type: 'Ocean Current'
          } : null)
        })
      );
    }

    // Research Stations Layer
    if (selectedLayer === 'all' || selectedLayer === 'stations') {
      newLayers.push(
        new ScatterplotLayer({
          id: 'research-stations',
          data: MARINE_DATA.researchStations,
          getPosition: d => d.position,
          getRadius: 200,
          getFillColor: d => d.status === 'Active' ? [0, 255, 0, 180] : [255, 165, 0, 180],
          getLineColor: [255, 255, 255, 200],
          getLineWidth: 3,
          stroked: true,
          filled: true,
          pickable: true,
          onHover: info => setHoveredObject(info.object ? {
            ...info.object,
            x: info.x,
            y: info.y,
            type: 'Research Station'
          } : null)
        })
      );

      // Station Labels
      newLayers.push(
        new TextLayer({
          id: 'station-labels',
          data: MARINE_DATA.researchStations,
          getPosition: d => d.position,
          getText: d => d.name,
          getSize: 12,
          getColor: [255, 255, 255, 255],
          getAngle: 0,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'center',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold'
        })
      );
    }

    setLayers(newLayers);
  }, [selectedLayer]);

  const renderTooltip = () => {
    if (!hoveredObject) return null;

    return (
      <div
        style={{
          position: 'absolute',
          left: hoveredObject.x,
          top: hoveredObject.y,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          maxWidth: '200px',
          zIndex: 1000,
          transform: 'translate(-50%, -100%)',
          marginTop: '-10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(100, 255, 218, 0.3)'
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#64ffda', marginBottom: '5px' }}>
          {hoveredObject.type}
        </div>
        {hoveredObject.species && (
          <div>Species: {hoveredObject.species}</div>
        )}
        {hoveredObject.count && (
          <div>Count: {hoveredObject.count}</div>
        )}
        {hoveredObject.temperature && (
          <div>Temperature: {hoveredObject.temperature}°C</div>
        )}
        {hoveredObject.speed && (
          <div>Current Speed: {hoveredObject.speed} m/s</div>
        )}
        {hoveredObject.direction && (
          <div>Direction: {hoveredObject.direction}</div>
        )}
        {hoveredObject.name && (
          <div>Name: {hoveredObject.name}</div>
        )}
        {hoveredObject.status && (
          <div>Status: {hoveredObject.status}</div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Layer Controls */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '8px',
          padding: '10px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px'
        }}
      >
        <div style={{ color: '#64ffda', marginBottom: '8px', fontWeight: 'bold' }}>
          Marine Data Layers
        </div>
        {[
          { value: 'all', label: 'Show All' },
          { value: 'fish', label: 'Fish Sightings' },
          { value: 'temperature', label: 'Temperature Zones' },
          { value: 'currents', label: 'Ocean Currents' },
          { value: 'stations', label: 'Research Stations' }
        ].map(option => (
          <label key={option.value} style={{ display: 'block', color: 'white', cursor: 'pointer', margin: '4px 0' }}>
            <input
              type="radio"
              value={option.value}
              checked={selectedLayer === option.value}
              onChange={(e) => setSelectedLayer(e.target.value)}
              style={{ marginRight: '6px' }}
            />
            {option.label}
          </label>
        ))}
      </div>

      {/* Map */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        layers={layers}
        controller={true}
      >
        {USE_MAPBOX ? (
          <Map
            mapStyle="mapbox://styles/mapbox/dark-v10"
            mapboxAccessToken={MAPBOX_TOKEN}
          />
        ) : (
          <OpenStreetMapTiles viewState={viewState} />
        )}
      </DeckGL>

      {/* Tooltip */}
      {renderTooltip()}
    </div>
  );
};

export default MarineMap;