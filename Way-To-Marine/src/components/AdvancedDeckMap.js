import React, { useState, useEffect } from 'react';
import Map from 'react-map-gl/mapbox';
import DeckGL from '@deck.gl/react';
import { 
  ScatterplotLayer, 
  TextLayer,
  ArcLayer,
  BitmapLayer
} from '@deck.gl/layers';
import {
  HeatmapLayer,
  GridLayer
} from '@deck.gl/aggregation-layers';
import { TileLayer } from '@deck.gl/geo-layers';

// Advanced marine research data
const ADVANCED_MARINE_DATA = {
  biodiversityData: [
    { position: [-122.4, 37.8], species_count: 45, biodiversity_index: 0.85, depth: 50 },
    { position: [-122.5, 37.9], species_count: 32, biodiversity_index: 0.72, depth: 75 },
    { position: [-122.3, 37.7], species_count: 67, biodiversity_index: 0.91, depth: 35 },
    { position: [-122.6, 37.6], species_count: 23, biodiversity_index: 0.68, depth: 120 },
    { position: [-122.2, 37.5], species_count: 89, biodiversity_index: 0.95, depth: 25 },
    { position: [-122.7, 37.4], species_count: 41, biodiversity_index: 0.78, depth: 90 },
    { position: [-122.1, 37.3], species_count: 56, biodiversity_index: 0.82, depth: 60 },
    { position: [-122.8, 37.2], species_count: 38, biodiversity_index: 0.75, depth: 110 },
    { position: [-122.0, 37.1], species_count: 72, biodiversity_index: 0.88, depth: 40 },
  ],
  
  migrationPaths: [
    {
      source: [-122.5, 37.8],
      target: [-121.8, 38.2],
      species: 'Salmon',
      count: 1500,
      season: 'Spring'
    },
    {
      source: [-122.3, 37.6],
      target: [-121.9, 38.0],
      species: 'Tuna',
      count: 800,
      season: 'Summer'
    },
    {
      source: [-122.7, 37.4],
      target: [-122.1, 38.1],
      species: 'Whale',
      count: 45,
      season: 'Winter'
    },
    {
      source: [-122.2, 37.3],
      target: [-121.7, 37.9],
      species: 'Shark',
      count: 120,
      season: 'Fall'
    }
  ],
  
  waterQualityPoints: [
    { position: [-122.4, 37.8], temperature: 18.5, ph: 8.1, oxygen: 7.8, salinity: 35.2, turbidity: 1.2 },
    { position: [-122.5, 37.9], temperature: 19.2, ph: 8.0, oxygen: 7.5, salinity: 35.8, turbidity: 1.5 },
    { position: [-122.3, 37.7], temperature: 17.8, ph: 8.2, oxygen: 8.1, salinity: 34.9, turbidity: 0.8 },
    { position: [-122.6, 37.6], temperature: 18.9, ph: 7.9, oxygen: 7.2, salinity: 36.1, turbidity: 2.1 },
    { position: [-122.2, 37.5], temperature: 20.1, ph: 8.3, oxygen: 8.4, salinity: 34.5, turbidity: 0.9 },
    { position: [-122.7, 37.4], temperature: 19.7, ph: 8.0, oxygen: 7.9, salinity: 35.5, turbidity: 1.3 },
    { position: [-122.1, 37.3], temperature: 18.3, ph: 8.1, oxygen: 8.0, salinity: 35.0, turbidity: 1.1 },
  ],
  
  researchVessels: [
    { position: [-122.45, 37.85], name: 'R/V Oceanus', status: 'Sampling', mission: 'Biodiversity Survey' },
    { position: [-122.35, 37.65], name: 'R/V Atlantis', status: 'Transit', mission: 'Deep Sea Research' },
    { position: [-122.25, 37.45], name: 'R/V Discovery', status: 'Deployed', mission: 'Water Quality' },
  ],
  
  pollutionSources: [
    { position: [-122.3, 37.8], type: 'Urban Runoff', severity: 'Medium', pollutants: ['Nitrogen', 'Phosphorus'] },
    { position: [-122.6, 37.7], type: 'Industrial', severity: 'High', pollutants: ['Heavy Metals', 'Chemicals'] },
    { position: [-122.1, 37.4], type: 'Agricultural', severity: 'Low', pollutants: ['Pesticides', 'Fertilizers'] },
  ]
};


const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const USE_MAPBOX = MAPBOX_TOKEN && MAPBOX_TOKEN !== 'pk.your-mapbox-token' && MAPBOX_TOKEN !== 'pk.your-mapbox-token-here';

// OpenStreetMap tiles component for advanced mode fallback
const AdvancedOpenStreetMapTiles = ({ viewState }) => {
  const tileLayer = new TileLayer({
    id: 'osm-tiles-advanced',
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
        bounds: [west, south, east, north],
        // Darken the tiles for scientific mode
        opacity: 0.7
      });
    }
  });

  return (
    <DeckGL
      viewState={viewState}
      layers={[tileLayer]}
      controller={false}
    >
      {/* Scientific mode overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 20, 25, 0.3)',
        pointerEvents: 'none'
      }} />
      
      {/* Advanced grid overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.08,
        backgroundImage: `
          linear-gradient(rgba(100, 255, 218, 0.4) 1px, transparent 1px),
          linear-gradient(90deg, rgba(100, 255, 218, 0.4) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px',
        pointerEvents: 'none'
      }} />
      
      {/* Fallback notice for advanced mode */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#64ffda',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '11px',
        fontFamily: 'Inter, sans-serif',
        border: '1px solid rgba(100, 255, 218, 0.3)',
        maxWidth: '220px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 1000
      }}>
        🔬 <strong>Scientific Mode</strong><br/>
        OpenStreetMap + Advanced Grid - Add Mapbox token for satellite base maps
      </div>
    </DeckGL>
  );
};

const AdvancedDeckMap = ({ 
  center = [-122.4, 37.7], 
  zoom = 10, 
  onLocationChange,
  isDragging = false,
  onDragStart,
  onDragEnd,
  onViewStateChange
}) => {
  const [viewState, setViewState] = useState({
    longitude: center[1],
    latitude: center[0],
    zoom: zoom,
    pitch: 0,
    bearing: 0
  });
  const [layers, setLayers] = useState([]);
  const [selectedVisualization, setSelectedVisualization] = useState('biodiversity');
  const [hoveredObject, setHoveredObject] = useState(null);

  useEffect(() => {
    const newLayers = [];

    // Biodiversity Visualization
    if (selectedVisualization === 'biodiversity' || selectedVisualization === 'all') {
      // Biodiversity Heatmap
      newLayers.push(
        new HeatmapLayer({
          id: 'biodiversity-heatmap',
          data: ADVANCED_MARINE_DATA.biodiversityData,
          getPosition: d => d.position,
          getWeight: d => d.biodiversity_index,
          radiusPixels: 80,
          intensity: 1,
          threshold: 0.03,
          colorRange: [
            [255, 255, 204, 100],  // Light yellow
            [255, 237, 160, 150],  // Yellow
            [254, 217, 118, 200],  // Orange
            [254, 178, 76, 220],   // Dark orange
            [253, 141, 60, 240],   // Red-orange
            [240, 59, 32, 255]     // Red
          ]
        })
      );

      // Biodiversity Points
      newLayers.push(
        new ScatterplotLayer({
          id: 'biodiversity-points',
          data: ADVANCED_MARINE_DATA.biodiversityData,
          getPosition: d => d.position,
          getRadius: d => d.species_count * 8,
          getFillColor: d => {
            const index = d.biodiversity_index;
            if (index > 0.8) return [34, 197, 94, 180]; // High - Green
            if (index > 0.6) return [251, 191, 36, 180]; // Medium - Yellow
            return [239, 68, 68, 180]; // Low - Red
          },
          radiusMinPixels: 8,
          radiusMaxPixels: 40,
          pickable: true,
          onHover: info => setHoveredObject(info.object ? {
            ...info.object,
            x: info.x,
            y: info.y,
            type: 'Biodiversity Data'
          } : null)
        })
      );
    }

    // Migration Patterns
    if (selectedVisualization === 'migration' || selectedVisualization === 'all') {
      newLayers.push(
        new ArcLayer({
          id: 'migration-arcs',
          data: ADVANCED_MARINE_DATA.migrationPaths,
          getSourcePosition: d => d.source,
          getTargetPosition: d => d.target,
          getSourceColor: d => {
            const colors = {
              'Salmon': [255, 99, 132],
              'Tuna': [54, 162, 235],
              'Whale': [255, 206, 86],
              'Shark': [75, 192, 192]
            };
            return colors[d.species] || [128, 128, 128];
          },
          getTargetColor: d => {
            const colors = {
              'Salmon': [255, 99, 132],
              'Tuna': [54, 162, 235],
              'Whale': [255, 206, 86],
              'Shark': [75, 192, 192]
            };
            return colors[d.species] || [128, 128, 128];
          },
          getWidth: d => Math.log(d.count) * 2,
          pickable: true,
          onHover: info => setHoveredObject(info.object ? {
            ...info.object,
            x: info.x,
            y: info.y,
            type: 'Migration Path'
          } : null)
        })
      );
    }

    // Water Quality Grid
    if (selectedVisualization === 'water_quality' || selectedVisualization === 'all') {
      newLayers.push(
        new GridLayer({
          id: 'water-quality-grid',
          data: ADVANCED_MARINE_DATA.waterQualityPoints,
          getPosition: d => d.position,
          getColorWeight: d => d.temperature,
          getElevationWeight: d => d.ph,
          cellSize: 1000,
          elevationScale: 100,
          extruded: true,
          pickable: true,
          onHover: info => setHoveredObject(info.object ? {
            ...info.object,
            x: info.x,
            y: info.y,
            type: 'Water Quality Grid'
          } : null)
        })
      );

      // Water Quality Points
      newLayers.push(
        new ScatterplotLayer({
          id: 'water-quality-points',
          data: ADVANCED_MARINE_DATA.waterQualityPoints,
          getPosition: d => d.position,
          getRadius: 150,
          getFillColor: d => {
            // Color based on overall water quality score
            const temp_score = (d.temperature - 15) / 10; // normalize 15-25°C
            const ph_score = (d.ph - 7) / 2; // normalize 7-9 pH
            const oxygen_score = d.oxygen / 10; // normalize 0-10 mg/L
            const quality = (temp_score + ph_score + oxygen_score) / 3;
            
            if (quality > 0.7) return [34, 197, 94, 200]; // Good - Green
            if (quality > 0.4) return [251, 191, 36, 200]; // Fair - Yellow
            return [239, 68, 68, 200]; // Poor - Red
          },
          pickable: true,
          onHover: info => setHoveredObject(info.object ? {
            ...info.object,
            x: info.x,
            y: info.y,
            type: 'Water Quality Station'
          } : null)
        })
      );
    }

    // Research Vessels
    if (selectedVisualization === 'vessels' || selectedVisualization === 'all') {
      newLayers.push(
        new ScatterplotLayer({
          id: 'research-vessels',
          data: ADVANCED_MARINE_DATA.researchVessels,
          getPosition: d => d.position,
          getRadius: 200,
          getFillColor: d => {
            const colors = {
              'Sampling': [34, 197, 94],   // Green
              'Transit': [59, 130, 246],   // Blue
              'Deployed': [251, 191, 36]   // Yellow
            };
            return colors[d.status] || [128, 128, 128];
          },
          stroked: true,
          getLineColor: [255, 255, 255],
          getLineWidth: 3,
          pickable: true,
          onHover: info => setHoveredObject(info.object ? {
            ...info.object,
            x: info.x,
            y: info.y,
            type: 'Research Vessel'
          } : null)
        })
      );

      // Vessel Labels
      newLayers.push(
        new TextLayer({
          id: 'vessel-labels',
          data: ADVANCED_MARINE_DATA.researchVessels,
          getPosition: d => d.position,
          getText: d => d.name,
          getSize: 14,
          getColor: [255, 255, 255],
          getAngle: 0,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'center',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          outlineWidth: 2,
          outlineColor: [0, 0, 0]
        })
      );
    }

    // Pollution Sources
    if (selectedVisualization === 'pollution' || selectedVisualization === 'all') {
      newLayers.push(
        new ScatterplotLayer({
          id: 'pollution-sources',
          data: ADVANCED_MARINE_DATA.pollutionSources,
          getPosition: d => d.position,
          getRadius: d => {
            const severityScale = { 'Low': 100, 'Medium': 150, 'High': 200 };
            return severityScale[d.severity] || 100;
          },
          getFillColor: d => {
            const severityColors = {
              'Low': [252, 211, 77, 180],      // Yellow
              'Medium': [251, 146, 60, 180],   // Orange
              'High': [239, 68, 68, 180]       // Red
            };
            return severityColors[d.severity] || [128, 128, 128, 180];
          },
          stroked: true,
          getLineColor: [255, 255, 255],
          getLineWidth: 2,
          pickable: true,
          onHover: info => setHoveredObject(info.object ? {
            ...info.object,
            x: info.x,
            y: info.y,
            type: 'Pollution Source'
          } : null)
        })
      );
    }

    setLayers(newLayers);
  }, [selectedVisualization]);

  // Handle view state changes
  const handleViewStateChange = ({ viewState: newViewState }) => {
    setViewState(newViewState);
    if (onViewStateChange) {
      onViewStateChange(newViewState);
    }
  };

  const renderTooltip = () => {
    if (!hoveredObject) return null;

    return (
      <div
        style={{
          position: 'absolute',
          left: hoveredObject.x,
          top: hoveredObject.y,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          maxWidth: '280px',
          zIndex: 1000,
          transform: 'translate(-50%, -100%)',
          marginTop: '-10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(100, 255, 218, 0.3)'
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#64ffda', marginBottom: '8px' }}>
          {hoveredObject.type}
        </div>
        
        {/* Biodiversity Data */}
        {hoveredObject.species_count && (
          <>
            <div>Species Count: {hoveredObject.species_count}</div>
            <div>Biodiversity Index: {hoveredObject.biodiversity_index.toFixed(2)}</div>
            <div>Depth: {hoveredObject.depth}m</div>
          </>
        )}
        
        {/* Migration Path */}
        {hoveredObject.species && (
          <>
            <div>Species: {hoveredObject.species}</div>
            <div>Count: {hoveredObject.count.toLocaleString()}</div>
            <div>Season: {hoveredObject.season}</div>
          </>
        )}
        
        {/* Water Quality */}
        {hoveredObject.temperature && (
          <>
            <div>Temperature: {hoveredObject.temperature}°C</div>
            <div>pH: {hoveredObject.ph}</div>
            <div>Oxygen: {hoveredObject.oxygen} mg/L</div>
            <div>Salinity: {hoveredObject.salinity} PSU</div>
            <div>Turbidity: {hoveredObject.turbidity} NTU</div>
          </>
        )}
        
        {/* Research Vessel */}
        {hoveredObject.name && (
          <>
            <div>Name: {hoveredObject.name}</div>
            <div>Status: {hoveredObject.status}</div>
            <div>Mission: {hoveredObject.mission}</div>
          </>
        )}
        
        {/* Pollution Source */}
        {hoveredObject.pollutants && (
          <>
            <div>Type: {hoveredObject.type}</div>
            <div>Severity: {hoveredObject.severity}</div>
            <div>Pollutants: {hoveredObject.pollutants.join(', ')}</div>
          </>
        )}
        
        {/* Location Marker */}
        {hoveredObject.message && (
          <div style={{ color: '#fbbf24' }}>
            {hoveredObject.message}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Advanced Controls */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '12px',
          padding: '16px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          minWidth: '250px',
          border: '1px solid rgba(100, 255, 218, 0.3)'
        }}
      >
        <div style={{ color: '#64ffda', marginBottom: '12px', fontWeight: 'bold', fontSize: '14px' }}>
          🔬 Advanced Marine Analytics
        </div>
        
        <div style={{ marginBottom: '8px', color: '#e5e7eb' }}>Visualization Mode:</div>
        <select
          value={selectedVisualization}
          onChange={(e) => setSelectedVisualization(e.target.value)}
          style={{
            width: '100%',
            padding: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(100, 255, 218, 0.3)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px',
            marginBottom: '12px'
          }}
        >
          <option value="all">🌊 Complete Overview</option>
          <option value="biodiversity">🐠 Biodiversity Analysis</option>
          <option value="migration">🐟 Migration Patterns</option>
          <option value="water_quality">💧 Water Quality</option>
          <option value="vessels">🚢 Research Vessels</option>
          <option value="pollution">⚠️ Pollution Sources</option>
        </select>

        {/* Legend */}
        <div style={{ borderTop: '1px solid rgba(100, 255, 218, 0.2)', paddingTop: '8px' }}>
          <div style={{ color: '#e5e7eb', marginBottom: '6px', fontSize: '11px' }}>Legend:</div>
          {selectedVisualization === 'biodiversity' && (
            <>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#22c55e' }}>●</span> High Biodiversity (&gt;0.8)</div>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#fbbf24' }}>●</span> Medium Biodiversity (0.6-0.8)</div>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#ef4444' }}>●</span> Low Biodiversity (&lt;0.6)</div>
            </>
          )}
          {selectedVisualization === 'migration' && (
            <>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#ff6384' }}>―</span> Salmon Migration</div>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#36a2eb' }}>―</span> Tuna Migration</div>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#ffcd56' }}>―</span> Whale Migration</div>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#4bc0c0' }}>―</span> Shark Migration</div>
            </>
          )}
          {selectedVisualization === 'vessels' && (
            <>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#22c55e' }}>●</span> Sampling</div>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#3b82f6' }}>●</span> Transit</div>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#fbbf24' }}>●</span> Deployed</div>
            </>
          )}
          {selectedVisualization === 'pollution' && (
            <>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#fcd34d' }}>●</span> Low Severity</div>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#fb923c' }}>●</span> Medium Severity</div>
              <div style={{ marginBottom: '2px' }}><span style={{ color: '#ef4444' }}>●</span> High Severity</div>
            </>
          )}
        </div>
      </div>

      {/* Map */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        layers={layers}
        controller={true}
      >
        {USE_MAPBOX ? (
          <Map
            mapStyle="mapbox://styles/mapbox/dark-v10"
            mapboxAccessToken={MAPBOX_TOKEN}
          />
        ) : (
          <AdvancedOpenStreetMapTiles viewState={viewState} />
        )}
      </DeckGL>

      {/* Tooltip */}
      {renderTooltip()}
    </div>
  );
};

export default AdvancedDeckMap;