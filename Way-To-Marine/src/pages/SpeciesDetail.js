import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './SpeciesDetail.css';

const SpeciesDetail = () => {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get species data from location state or create default
  const { species, category: speciesCategory } = location.state || {
    species: {
      name: 'Unknown Species',
      scientificName: 'Species unknown',
      family: 'Unknown',
      count: 0,
      status: 'Unknown',
      habitat: 'Unknown'
    },
    category: category
  };

  // Mock detailed data for the species
  const detailedData = {
    description: `${species.name} (${species.scientificName}) is a marine species belonging to the ${species.family} family. This species is commonly found in ${species.habitat.toLowerCase()} environments and plays a crucial role in the marine ecosystem.`,
    
    characteristics: {
      averageLength: category === 'fish' ? '45-65 cm' : category === 'crustaceans' ? '8-12 cm' : '15-25 cm',
      averageWeight: category === 'fish' ? '2-4 kg' : category === 'crustaceans' ? '100-300 g' : '200-500 g',
      lifespan: category === 'fish' ? '8-15 years' : category === 'crustaceans' ? '3-5 years' : '5-8 years',
      diet: category === 'fish' ? 'Carnivorous - small fish, crustaceans' : category === 'crustaceans' ? 'Omnivorous - algae, small organisms' : 'Filter feeder - plankton',
      reproductionAge: category === 'fish' ? '2-3 years' : '1-2 years',
      eggCount: category === 'fish' ? '50,000-100,000' : category === 'crustaceans' ? '1,000-10,000' : '10,000-50,000'
    },

    populationTrend: [
      { year: '2018', population: species.count * 0.8, temperature: 22.1, fishing: 85 },
      { year: '2019', population: species.count * 0.85, temperature: 22.3, fishing: 88 },
      { year: '2020', population: species.count * 0.9, temperature: 22.8, fishing: 75 },
      { year: '2021', population: species.count * 0.95, temperature: 23.2, fishing: 82 },
      { year: '2022', population: species.count, temperature: 23.5, fishing: 90 },
      { year: '2023', population: species.count * 1.05, temperature: 23.8, fishing: 87 }
    ],

    seasonalDistribution: [
      { month: 'Jan', abundance: 65, temperature: 20.5, depth: 45 },
      { month: 'Feb', abundance: 70, temperature: 21.0, depth: 42 },
      { month: 'Mar', abundance: 85, temperature: 22.5, depth: 38 },
      { month: 'Apr', abundance: 95, temperature: 24.0, depth: 35 },
      { month: 'May', abundance: 100, temperature: 25.5, depth: 32 },
      { month: 'Jun', abundance: 90, temperature: 26.8, depth: 30 },
      { month: 'Jul', abundance: 80, temperature: 27.2, depth: 28 },
      { month: 'Aug', abundance: 75, temperature: 27.0, depth: 30 },
      { month: 'Sep', abundance: 85, temperature: 25.8, depth: 33 },
      { month: 'Oct', abundance: 90, temperature: 24.2, depth: 36 },
      { month: 'Nov', abundance: 80, temperature: 22.8, depth: 40 },
      { month: 'Dec', abundance: 70, temperature: 21.5, depth: 43 }
    ],

    threats: [
      'Overfishing pressure',
      'Climate change impacts',
      'Ocean acidification',
      'Plastic pollution',
      'Habitat degradation'
    ],

    conservation: [
      'Marine protected areas establishment',
      'Fishing quota regulations',
      'Habitat restoration programs',
      'Research monitoring initiatives',
      'Public awareness campaigns'
    ],

    radarData: [
      { subject: 'Population Health', A: species.status === 'Abundant' ? 90 : species.status === 'Sustainable' ? 75 : species.status === 'Protected' ? 60 : 40, fullMark: 100 },
      { subject: 'Habitat Quality', A: 85, fullMark: 100 },
      { subject: 'Genetic Diversity', A: 78, fullMark: 100 },
      { subject: 'Reproduction Rate', A: species.status === 'Abundant' ? 85 : 70, fullMark: 100 },
      { subject: 'Food Availability', A: 80, fullMark: 100 },
      { subject: 'Climate Resilience', A: 65, fullMark: 100 }
    ]
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'sustainable': return '#10B981';
      case 'protected': return '#3B82F6';
      case 'vulnerable': return '#F59E0B';
      case 'endangered': return '#EF4444';
      case 'abundant': return '#8B5CF6';
      case 'farmed': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'fish': return '🐟';
      case 'crustaceans': return '🦐';
      case 'mollusks': return '🐙';
      case 'coral': return '🪸';
      default: return '🌊';
    }
  };

  return (
    <div className="species-detail">
      {/* Header */}
      <div className="species-header-section">
        <div className="header-controls">
          <button onClick={() => navigate('/taxonomy-module')} className="back-btn">
            ← Back to Taxonomy
          </button>
          <button onClick={() => navigate('/dashboard/scientist')} className="dashboard-btn">
            🔬 Dashboard
          </button>
        </div>
        
        <div className="species-hero">
          <div className="species-hero-content">
            <div className="species-icon">{getCategoryIcon(speciesCategory)}</div>
            <div className="species-hero-text">
              <h1 className="species-title">{species.name}</h1>
              <p className="species-scientific"><em>{species.scientificName}</em></p>
              <div className="species-meta">
                <span className="family-badge">Family: {species.family}</span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(species.status) }}
                >
                  {species.status}
                </span>
              </div>
            </div>
          </div>
          <div className="population-stat">
            <div className="stat-number">{species.count.toLocaleString()}</div>
            <div className="stat-label">Population Count</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item">
          <div className="stat-icon">📏</div>
          <div className="stat-info">
            <div className="stat-value">{detailedData.characteristics.averageLength}</div>
            <div className="stat-name">Average Length</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">⚖️</div>
          <div className="stat-info">
            <div className="stat-value">{detailedData.characteristics.averageWeight}</div>
            <div className="stat-name">Average Weight</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <div className="stat-value">{detailedData.characteristics.lifespan}</div>
            <div className="stat-name">Lifespan</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🏠</div>
          <div className="stat-info">
            <div className="stat-value">{species.habitat}</div>
            <div className="stat-name">Habitat</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="detail-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* Description */}
          <div className="detail-section">
            <h3>Species Description</h3>
            <p>{detailedData.description}</p>
          </div>

          {/* Characteristics */}
          <div className="detail-section">
            <h3>Key Characteristics</h3>
            <div className="characteristics-grid">
              <div className="char-item">
                <strong>Diet:</strong> {detailedData.characteristics.diet}
              </div>
              <div className="char-item">
                <strong>Reproduction Age:</strong> {detailedData.characteristics.reproductionAge}
              </div>
              <div className="char-item">
                <strong>Egg Count:</strong> {detailedData.characteristics.eggCount}
              </div>
            </div>
          </div>

          {/* Population Trend Chart */}
          <div className="detail-section">
            <h3>Population Trend (2018-2023)</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={detailedData.populationTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="population"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                    name="Population"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Health Radar Chart */}
          <div className="detail-section">
            <h3>Species Health Assessment</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={detailedData.radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Health Score"
                    dataKey="A"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Threats & Conservation */}
          <div className="detail-section">
            <h3>Conservation Status</h3>
            <div className="conservation-content">
              <div className="threats-section">
                <h4>🚨 Primary Threats</h4>
                <ul>
                  {detailedData.threats.map((threat, index) => (
                    <li key={index}>{threat}</li>
                  ))}
                </ul>
              </div>
              <div className="conservation-section">
                <h4>🛡️ Conservation Efforts</h4>
                <ul>
                  {detailedData.conservation.map((effort, index) => (
                    <li key={index}>{effort}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="detail-section">
            <h3>Research Actions</h3>
            <div className="action-buttons">
              <button className="action-btn primary">
                📊 Generate Report
              </button>
              <button className="action-btn secondary">
                🔬 Add to Study
              </button>
              <button className="action-btn tertiary">
                📷 View Gallery
              </button>
              <button className="action-btn quaternary">
                🗺️ Distribution Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Distribution Chart */}
      <div className="full-width-section">
        <div className="detail-section">
          <h3>Seasonal Distribution & Environmental Factors</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={detailedData.seasonalDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="abundance"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Abundance %"
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Water Temperature (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="depth"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Average Depth (m)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeciesDetail;