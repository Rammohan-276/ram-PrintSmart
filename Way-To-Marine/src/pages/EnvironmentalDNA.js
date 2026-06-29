import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import './EnvironmentalDNA.css';

const EnvironmentalDNA = () => {
  const navigate = useNavigate();
  const [selectedSample, setSelectedSample] = useState('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState('biodiversity');
  const [searchQuery, setSearchQuery] = useState('');

  // eDNA Sample Database
  const eDNAData = {
    coastal_reef: {
      location: 'Coastal Reef Zone',
      coordinates: '25.7617° N, 80.1918° W',
      depth: '5-15 meters',
      sampleDate: '2024-01-15',
      waterTemp: 24.5,
      salinity: 35.2,
      pH: 8.1,
      totalSequences: 45678,
      uniqueSpecies: 89,
      dominantPhyla: ['Chordata', 'Arthropoda', 'Mollusca'],
      species: [
        { name: 'Yellowfin Tuna', scientificName: 'Thunnus albacares', reads: 2847, abundance: 6.2, status: 'Detected' },
        { name: 'Parrotfish', scientificName: 'Scarus vetula', reads: 1956, abundance: 4.3, status: 'Abundant' },
        { name: 'Grouper', scientificName: 'Epinephelus marginatus', reads: 1234, abundance: 2.7, status: 'Present' },
        { name: 'Sea Turtle', scientificName: 'Chelonia mydas', reads: 892, abundance: 2.0, status: 'Rare' },
        { name: 'Barracuda', scientificName: 'Sphyraena barracuda', reads: 678, abundance: 1.5, status: 'Present' }
      ]
    },
    deep_ocean: {
      location: 'Deep Ocean Zone',
      coordinates: '26.0112° N, 81.8123° W',
      depth: '200-500 meters',
      sampleDate: '2024-01-20',
      waterTemp: 18.2,
      salinity: 34.8,
      pH: 7.9,
      totalSequences: 38492,
      uniqueSpecies: 67,
      dominantPhyla: ['Chordata', 'Cnidaria', 'Echinodermata'],
      species: [
        { name: 'Lanternfish', scientificName: 'Myctophum punctatum', reads: 3421, abundance: 8.9, status: 'Abundant' },
        { name: 'Deep Sea Anglerfish', scientificName: 'Melanocetus johnsonii', reads: 1876, abundance: 4.9, status: 'Present' },
        { name: 'Vampire Squid', scientificName: 'Vampyroteuthis infernalis', reads: 1245, abundance: 3.2, status: 'Detected' },
        { name: 'Gulper Eel', scientificName: 'Eurypharynx pelecanoides', reads: 789, abundance: 2.1, status: 'Rare' },
        { name: 'Giant Isopod', scientificName: 'Bathynomus giganteus', reads: 567, abundance: 1.5, status: 'Present' }
      ]
    },
    mangrove: {
      location: 'Mangrove Ecosystem',
      coordinates: '25.4012° N, 80.5634° W',
      depth: '1-5 meters',
      sampleDate: '2024-01-25',
      waterTemp: 26.8,
      salinity: 28.5,
      pH: 8.0,
      totalSequences: 52341,
      uniqueSpecies: 112,
      dominantPhyla: ['Chordata', 'Arthropoda', 'Annelida'],
      species: [
        { name: 'Snook', scientificName: 'Centropomus undecimalis', reads: 4123, abundance: 7.9, status: 'Abundant' },
        { name: 'Tarpon', scientificName: 'Megalops atlanticus', reads: 2456, abundance: 4.7, status: 'Present' },
        { name: 'Manatee', scientificName: 'Trichechus manatus', reads: 1876, abundance: 3.6, status: 'Protected' },
        { name: 'Bull Shark', scientificName: 'Carcharhinus leucas', reads: 1234, abundance: 2.4, status: 'Present' },
        { name: 'Juvenile Fish Mix', scientificName: 'Multiple species', reads: 892, abundance: 1.7, status: 'Nursery' }
      ]
    },
    open_ocean: {
      location: 'Open Ocean Pelagic',
      coordinates: '27.2145° N, 82.1234° W',
      depth: '50-100 meters',
      sampleDate: '2024-02-01',
      waterTemp: 22.1,
      salinity: 36.0,
      pH: 8.2,
      totalSequences: 41789,
      uniqueSpecies: 76,
      dominantPhyla: ['Chordata', 'Mollusca', 'Cnidaria'],
      species: [
        { name: 'Mahi-mahi', scientificName: 'Coryphaena hippurus', reads: 3567, abundance: 8.5, status: 'Abundant' },
        { name: 'Sailfish', scientificName: 'Istiophorus platypterus', reads: 2134, abundance: 5.1, status: 'Present' },
        { name: 'Flying Fish', scientificName: 'Exocoetus volitans', reads: 1678, abundance: 4.0, status: 'Present' },
        { name: 'Portuguese Man o War', scientificName: 'Physalia physalis', reads: 1245, abundance: 3.0, status: 'Detected' },
        { name: 'Bluefin Tuna', scientificName: 'Thunnus thynnus', reads: 892, abundance: 2.1, status: 'Migrating' }
      ]
    }
  };

  // Analysis types
  const analysisTypes = {
    biodiversity: 'Biodiversity Assessment',
    temporal: 'Temporal Analysis',
    comparative: 'Comparative Study',
    conservation: 'Conservation Status'
  };

  // Overview statistics
  const overviewStats = {
    totalSamples: Object.keys(eDNAData).length,
    totalSequences: Object.values(eDNAData).reduce((sum, sample) => sum + sample.totalSequences, 0),
    uniqueSpecies: Object.values(eDNAData).reduce((sum, sample) => sum + sample.uniqueSpecies, 0),
    avgAccuracy: 96.8
  };

  // Biodiversity comparison data
  const biodiversityData = Object.entries(eDNAData).map(([key, sample]) => ({
    location: sample.location.split(' ')[0],
    species: sample.uniqueSpecies,
    sequences: sample.totalSequences,
    depth: parseInt(sample.depth.split('-')[0])
  }));

  // Phyla distribution data
  const phylaDistribution = [
    { phylum: 'Chordata', percentage: 45.2, count: 156, color: '#3B82F6' },
    { phylum: 'Arthropoda', percentage: 23.1, count: 89, color: '#10B981' },
    { phylum: 'Mollusca', percentage: 18.5, count: 67, color: '#F59E0B' },
    { phylum: 'Cnidaria', percentage: 8.9, count: 34, color: '#EF4444' },
    { phylum: 'Echinodermata', percentage: 4.3, count: 12, color: '#8B5CF6' }
  ];

  // Temporal analysis data
  const temporalData = [
    { month: 'Jan', species: 89, biomass: 245.6, diversity: 3.2 },
    { month: 'Feb', species: 92, biomass: 267.8, diversity: 3.4 },
    { month: 'Mar', species: 98, biomass: 298.5, diversity: 3.6 },
    { month: 'Apr', species: 104, biomass: 321.2, diversity: 3.8 },
    { month: 'May', species: 112, biomass: 356.7, diversity: 4.1 },
    { month: 'Jun', species: 108, biomass: 334.9, diversity: 3.9 }
  ];

  // Detection sensitivity data
  const sensitivityData = [
    { category: 'Large Fish', detection: 98.5, reliability: 95.2 },
    { category: 'Small Fish', detection: 89.3, reliability: 87.6 },
    { category: 'Crustaceans', detection: 76.8, reliability: 82.1 },
    { category: 'Mollusks', detection: 82.4, reliability: 79.3 },
    { category: 'Marine Mammals', detection: 94.7, reliability: 91.8 }
  ];

  const getSampleData = () => {
    if (selectedSample === 'all') {
      return Object.values(eDNAData);
    }
    return eDNAData[selectedSample] ? [eDNAData[selectedSample]] : [];
  };

  const getFilteredSamples = () => {
    return Object.entries(eDNAData).filter(([key, sample]) =>
      sample.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.species.some(species => 
        species.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'abundant': return '#10B981';
      case 'present': return '#3B82F6';
      case 'detected': return '#F59E0B';
      case 'rare': return '#EF4444';
      case 'protected': return '#8B5CF6';
      case 'migrating': return '#06B6D4';
      case 'nursery': return '#84CC16';
      default: return '#6B7280';
    }
  };

  return (
    <div className="environmental-dna">
      {/* Header */}
      <div className="module-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Dashboard
        </button>
        <h1 className="module-title">🧬 Environmental DNA Analysis Module</h1>
        <p className="module-description">
          Advanced marine biodiversity monitoring using environmental DNA metabarcoding techniques
        </p>
      </div>

      {/* Overview Statistics */}
      <div className="stats-overview">
        <div className="stat-card samples">
          <div className="stat-icon">🧪</div>
          <div className="stat-info">
            <h3>Water Samples</h3>
            <p className="stat-number">{overviewStats.totalSamples}</p>
          </div>
        </div>
        <div className="stat-card sequences">
          <div className="stat-icon">🔬</div>
          <div className="stat-info">
            <h3>DNA Sequences</h3>
            <p className="stat-number">{overviewStats.totalSequences.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card species">
          <div className="stat-icon">🐟</div>
          <div className="stat-info">
            <h3>Species Detected</h3>
            <p className="stat-number">{overviewStats.uniqueSpecies}</p>
          </div>
        </div>
        <div className="stat-card accuracy">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <h3>Accuracy Rate</h3>
            <p className="stat-number">{overviewStats.avgAccuracy}%</p>
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
          <h3>Sample Location</h3>
          <select
            value={selectedSample}
            onChange={(e) => setSelectedSample(e.target.value)}
            className="sample-select"
          >
            <option value="all">All Locations</option>
            {Object.entries(eDNAData).map(([key, sample]) => (
              <option key={key} value={key}>
                {sample.location}
              </option>
            ))}
          </select>
        </div>

        <div className="control-section">
          <h3>Search</h3>
          <input
            type="text"
            placeholder="Search locations or species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="edna-grid">
        {/* Left Panel - Sample Information */}
        <div className="left-panel">
          <div className="sample-cards">
            <h3>Sample Locations</h3>
            <div className="sample-list">
              {getFilteredSamples().map(([key, sample]) => (
                <div key={key} className="sample-card">
                  <div className="sample-header">
                    <h4>{sample.location}</h4>
                    <span className="species-count">{sample.uniqueSpecies} species</span>
                  </div>
                  <div className="sample-details">
                    <p><strong>Coordinates:</strong> {sample.coordinates}</p>
                    <p><strong>Depth:</strong> {sample.depth}</p>
                    <p><strong>Temperature:</strong> {sample.waterTemp}°C</p>
                    <p><strong>Salinity:</strong> {sample.salinity} PSU</p>
                    <p><strong>pH:</strong> {sample.pH}</p>
                    <p><strong>Sequences:</strong> {sample.totalSequences.toLocaleString()}</p>
                  </div>
                  <div className="sample-actions">
                    <button
                      className="analyze-btn"
                      onClick={() => setSelectedSample(key)}
                    >
                      Analyze
                    </button>
                    <button 
                      className="detail-btn"
                      onClick={() => navigate(`/edna-detail/${key}`, {
                        state: { sample, sampleKey: key }
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
          {selectedAnalysis === 'biodiversity' && (
            <div className="analysis-section">
              <h3>Biodiversity Assessment</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={biodiversityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="species" fill="#10B981" name="Unique Species" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedAnalysis === 'temporal' && (
            <div className="analysis-section">
              <h3>Temporal Diversity Trends</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={temporalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="species"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      name="Species Count"
                    />
                    <Area
                      type="monotone"
                      dataKey="diversity"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name="Shannon Diversity"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedAnalysis === 'comparative' && (
            <div className="analysis-section">
              <h3>Detection Sensitivity Analysis</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="detection" 
                      stroke="#6366F1" 
                      strokeWidth={3}
                      name="Detection Rate (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="reliability" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      name="Reliability Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedAnalysis === 'conservation' && (
            <div className="analysis-section">
              <h3>Conservation Status Overview</h3>
              <div className="conservation-grid">
                {getSampleData().map((sample, index) => (
                  <div key={index} className="conservation-card">
                    <h4>{sample.location}</h4>
                    <div className="species-status">
                      {sample.species.slice(0, 3).map((species, idx) => (
                        <div key={idx} className="status-item">
                          <span className="species-name">{species.name}</span>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(species.status) }}
                          >
                            {species.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Additional Information */}
        <div className="right-panel">
          {/* Phyla Distribution */}
          <div className="chart-section">
            <h3>Taxonomic Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={phylaDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ phylum, percentage }) => `${phylum}\n${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {phylaDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Protocol Information */}
          <div className="protocol-section">
            <h3>eDNA Protocol</h3>
            <div className="protocol-steps">
              <div className="step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h4>Water Sampling</h4>
                  <p>Collect 1L seawater samples using sterile containers</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h4>Filtration</h4>
                  <p>Filter through 0.22μm membrane filters</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h4>DNA Extraction</h4>
                  <p>Extract environmental DNA using commercial kits</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <div className="step-content">
                  <h4>PCR Amplification</h4>
                  <p>Amplify target gene regions (COI, 16S, 18S)</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">5</span>
                <div className="step-content">
                  <h4>Sequencing</h4>
                  <p>High-throughput sequencing on Illumina platform</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Tools */}
          <div className="tools-section">
            <h3>Analysis Tools</h3>
            <div className="tool-buttons">
              <button className="tool-btn primary">
                🔬 Sequence Analysis
              </button>
              <button className="tool-btn secondary">
                📊 Statistical Report
              </button>
              <button className="tool-btn tertiary">
                🗺️ Biogeography Map
              </button>
              <button className="tool-btn quaternary">
                💾 Export Results
              </button>
            </div>
          </div>

          {/* Research Notes */}
          <div className="notes-section">
            <h3>Key Findings</h3>
            <div className="note-card">
              <h4>Methodological Advantages</h4>
              <ul>
                <li>Non-invasive biodiversity assessment</li>
                <li>Detection of cryptic and rare species</li>
                <li>Rapid ecosystem monitoring</li>
                <li>Cost-effective large-scale surveys</li>
              </ul>
            </div>
            <div className="note-card">
              <h4>Current Limitations</h4>
              <ul>
                <li>Species abundance estimation challenges</li>
                <li>Primer bias in amplification</li>
                <li>Database completeness issues</li>
                <li>DNA degradation in tropical waters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalDNA;