import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import './OtolithMorphology.css';

const OtolithMorphology = () => {
  const navigate = useNavigate();
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState('morphometric');
  const [searchQuery, setSearchQuery] = useState('');

  // Otolith morphology database
  const otolithData = {
    tuna: {
      species: 'Yellowfin Tuna',
      scientificName: 'Thunnus albacares',
      samples: 245,
      avgLength: 12.5,
      avgWidth: 8.3,
      avgThickness: 3.2,
      shape: 'Elongated oval',
      texture: 'Smooth with fine ridges',
      growthRings: 8,
      ageRange: '2-15 years',
      habitat: 'Pelagic',
      measurements: [
        { age: 1, length: 5.2, width: 3.1, thickness: 1.2, weight: 0.15 },
        { age: 2, length: 7.8, width: 4.5, thickness: 1.8, weight: 0.32 },
        { age: 3, length: 9.5, width: 5.8, thickness: 2.1, weight: 0.58 },
        { age: 4, length: 11.2, width: 6.9, thickness: 2.5, weight: 0.89 },
        { age: 5, length: 12.8, width: 7.6, thickness: 2.9, weight: 1.25 },
        { age: 6, length: 14.1, width: 8.2, thickness: 3.2, weight: 1.68 },
        { age: 8, length: 16.5, width: 9.1, thickness: 3.6, weight: 2.45 }
      ]
    },
    salmon: {
      species: 'Atlantic Salmon',
      scientificName: 'Salmo salar',
      samples: 189,
      avgLength: 15.8,
      avgWidth: 9.6,
      avgThickness: 4.1,
      shape: 'Oval with pointed anterior',
      texture: 'Moderate sculpturing',
      growthRings: 6,
      ageRange: '1-12 years',
      habitat: 'Anadromous',
      measurements: [
        { age: 1, length: 6.8, width: 4.2, thickness: 1.5, weight: 0.22 },
        { age: 2, length: 9.1, width: 5.8, thickness: 2.3, weight: 0.48 },
        { age: 3, length: 12.4, width: 7.1, thickness: 3.0, weight: 0.89 },
        { age: 4, length: 14.9, width: 8.5, thickness: 3.6, weight: 1.42 },
        { age: 5, length: 17.2, width: 9.8, thickness: 4.2, weight: 2.15 },
        { age: 6, length: 19.1, width: 10.6, thickness: 4.6, weight: 2.89 }
      ]
    },
    cod: {
      species: 'Atlantic Cod',
      scientificName: 'Gadus morhua',
      samples: 167,
      avgLength: 11.2,
      avgWidth: 7.8,
      avgThickness: 2.9,
      shape: 'Rounded rectangular',
      texture: 'Heavily sculptured',
      growthRings: 7,
      ageRange: '1-10 years',
      habitat: 'Demersal',
      measurements: [
        { age: 1, length: 4.1, width: 2.8, thickness: 0.9, weight: 0.08 },
        { age: 2, length: 6.5, width: 4.2, thickness: 1.4, weight: 0.18 },
        { age: 3, length: 8.9, width: 5.8, thickness: 2.0, weight: 0.35 },
        { age: 4, length: 10.8, width: 7.1, thickness: 2.5, weight: 0.58 },
        { age: 5, length: 12.4, width: 8.2, thickness: 3.0, weight: 0.89 },
        { age: 6, length: 13.8, width: 9.0, thickness: 3.3, weight: 1.25 }
      ]
    },
    grouper: {
      species: 'Red Grouper',
      scientificName: 'Epinephelus morio',
      samples: 134,
      avgLength: 18.9,
      avgWidth: 12.4,
      avgThickness: 5.8,
      shape: 'Large oval',
      texture: 'Complex ridges',
      growthRings: 12,
      ageRange: '2-25 years',
      habitat: 'Reef-associated',
      measurements: [
        { age: 2, length: 8.9, width: 5.8, thickness: 2.1, weight: 0.35 },
        { age: 4, length: 13.2, width: 8.5, thickness: 3.2, weight: 0.89 },
        { age: 6, length: 16.8, width: 10.9, thickness: 4.1, weight: 1.78 },
        { age: 8, length: 19.5, width: 12.6, thickness: 4.9, weight: 2.85 },
        { age: 10, length: 21.8, width: 14.1, thickness: 5.5, weight: 4.12 },
        { age: 12, length: 23.6, width: 15.2, thickness: 6.0, weight: 5.68 }
      ]
    }
  };

  // Analysis types
  const analysisTypes = {
    morphometric: 'Morphometric Analysis',
    ageStructure: 'Age Structure Analysis',
    growthPattern: 'Growth Pattern Study',
    comparative: 'Comparative Morphology'
  };

  // Statistics for overview
  const overviewStats = {
    totalSamples: Object.values(otolithData).reduce((sum, species) => sum + species.samples, 0),
    speciesCount: Object.keys(otolithData).length,
    avgAccuracy: 94.7,
    ageRange: '1-25 years'
  };

  // Combined data for comparative analysis
  const combinedGrowthData = Object.entries(otolithData).flatMap(([key, species]) =>
    species.measurements.map(measurement => ({
      ...measurement,
      species: species.species,
      speciesKey: key
    }))
  );

  // Age distribution data
  const ageDistribution = [
    { ageGroup: '1-2 years', count: 145, percentage: 19.7 },
    { ageGroup: '3-5 years', count: 289, percentage: 39.2 },
    { ageGroup: '6-10 years', count: 198, percentage: 26.9 },
    { ageGroup: '11-15 years', count: 78, percentage: 10.6 },
    { ageGroup: '16+ years', count: 25, percentage: 3.6 }
  ];

  // Shape classification data
  const shapeClassification = [
    { shape: 'Oval', count: 312, color: '#3B82F6' },
    { shape: 'Elongated', count: 189, color: '#10B981' },
    { shape: 'Rectangular', count: 167, color: '#F59E0B' },
    { shape: 'Irregular', count: 67, color: '#EF4444' }
  ];

  const getSpeciesData = () => {
    if (selectedSpecies === 'all') {
      return combinedGrowthData;
    }
    return otolithData[selectedSpecies]?.measurements || [];
  };

  const getFilteredSpecies = () => {
    return Object.entries(otolithData).filter(([key, species]) =>
      species.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      species.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="otolith-morphology">
      {/* Header */}
      <div className="module-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Dashboard
        </button>
        <h1 className="module-title">🦴 Otolith Morphology Analysis Module</h1>
        <p className="module-description">
          Advanced otolith analysis for fish age determination, species identification, and growth pattern studies
        </p>
      </div>

      {/* Overview Statistics */}
      <div className="stats-overview">
        <div className="stat-card samples">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total Samples</h3>
            <p className="stat-number">{overviewStats.totalSamples.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card species">
          <div className="stat-icon">🐟</div>
          <div className="stat-info">
            <h3>Species Analyzed</h3>
            <p className="stat-number">{overviewStats.speciesCount}</p>
          </div>
        </div>
        <div className="stat-card accuracy">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <h3>Age Accuracy</h3>
            <p className="stat-number">{overviewStats.avgAccuracy}%</p>
          </div>
        </div>
        <div className="stat-card range">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Age Range</h3>
            <p className="stat-number">{overviewStats.ageRange}</p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="control-section">
          <h3>Analysis Type</h3>
          <div className="analysis-buttons">
            {Object.entries(analysisTypes).map(([key, label]) => (
              <button
                key={key}
                className={`analysis-btn ${selectedAnalysis === key ? 'active' : ''}`}
                onClick={() => setSelectedAnalysis(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="control-section">
          <h3>Species Filter</h3>
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="species-select"
          >
            <option value="all">All Species</option>
            {Object.entries(otolithData).map(([key, species]) => (
              <option key={key} value={key}>
                {species.species}
              </option>
            ))}
          </select>
        </div>

        <div className="control-section">
          <h3>Search</h3>
          <input
            type="text"
            placeholder="Search species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="otolith-grid">
        {/* Left Panel - Species Information */}
        <div className="left-panel">
          <div className="species-cards">
            <h3>Species Database</h3>
            <div className="species-list">
              {getFilteredSpecies().map(([key, species]) => (
                <div key={key} className="species-card">
                  <div className="species-header">
                    <h4>{species.species}</h4>
                    <span className="sample-count">{species.samples} samples</span>
                  </div>
                  <div className="species-details">
                    <p><strong>Scientific:</strong> <em>{species.scientificName}</em></p>
                    <p><strong>Avg Length:</strong> {species.avgLength} mm</p>
                    <p><strong>Shape:</strong> {species.shape}</p>
                    <p><strong>Habitat:</strong> {species.habitat}</p>
                    <p><strong>Age Range:</strong> {species.ageRange}</p>
                  </div>
                  <div className="species-actions">
                    <button
                      className="view-btn"
                      onClick={() => setSelectedSpecies(key)}
                    >
                      Analyze
                    </button>
                    <button 
                      className="detail-btn"
                      onClick={() => navigate(`/otolith-detail/${key}`, {
                        state: { species, speciesKey: key }
                      })}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Main Analysis */}
        <div className="center-panel">
          {selectedAnalysis === 'morphometric' && (
            <div className="analysis-section">
              <h3>Morphometric Analysis</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={getSpeciesData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="length" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Length (mm)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="width" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Width (mm)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="thickness" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      name="Thickness (mm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedAnalysis === 'ageStructure' && (
            <div className="analysis-section">
              <h3>Age Structure Distribution</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageGroup" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" name="Sample Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedAnalysis === 'growthPattern' && (
            <div className="analysis-section">
              <h3>Growth Pattern Analysis</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={getSpeciesData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#EF4444" 
                      strokeWidth={4}
                      name="Otolith Weight (g)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedAnalysis === 'comparative' && (
            <div className="analysis-section">
              <h3>Comparative Species Analysis</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={combinedGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="length" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Average Length"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Additional Charts */}
        <div className="right-panel">
          {/* Shape Classification */}
          <div className="chart-section">
            <h3>Shape Classification</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={shapeClassification}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ shape, percentage }) => `${shape}\n${((percentage || 0) * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {shapeClassification.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Tools */}
          <div className="tools-section">
            <h3>Analysis Tools</h3>
            <div className="tool-buttons">
              <button className="tool-btn primary">
                📸 Image Analysis
              </button>
              <button className="tool-btn secondary">
                📏 Measurement Tool
              </button>
              <button className="tool-btn tertiary">
                🔍 Age Validation
              </button>
              <button className="tool-btn quaternary">
                📊 Export Data
              </button>
            </div>
          </div>

          {/* Research Notes */}
          <div className="notes-section">
            <h3>Research Notes</h3>
            <div className="note-card">
              <h4>Key Findings</h4>
              <ul>
                <li>Strong correlation between otolith size and fish age</li>
                <li>Species-specific growth patterns identified</li>
                <li>Seasonal growth rings clearly visible</li>
                <li>Temperature effects on otolith formation</li>
              </ul>
            </div>
            <div className="note-card">
              <h4>Methodology</h4>
              <ul>
                <li>Digital image analysis system</li>
                <li>Semi-automatic measurements</li>
                <li>Cross-validation with known ages</li>
                <li>Statistical modeling approaches</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtolithMorphology;