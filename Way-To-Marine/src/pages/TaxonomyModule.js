import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './TaxonomyModule.css';

const TaxonomyModule = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('fish');
  const [searchQuery, setSearchQuery] = useState('');

  // Marine species taxonomy data
  const taxonomyData = {
    fish: [
      { name: 'Tuna', scientificName: 'Thunnus albacares', family: 'Scombridae', count: 847, status: 'Sustainable', habitat: 'Pelagic' },
      { name: 'Salmon', scientificName: 'Salmo salar', family: 'Salmonidae', count: 623, status: 'Protected', habitat: 'Anadromous' },
      { name: 'Cod', scientificName: 'Gadus morhua', family: 'Gadidae', count: 421, status: 'Vulnerable', habitat: 'Demersal' },
      { name: 'Sardine', scientificName: 'Sardina pilchardus', family: 'Clupeidae', count: 1203, status: 'Abundant', habitat: 'Pelagic' },
      { name: 'Mackerel', scientificName: 'Scomber scombrus', family: 'Scombridae', count: 789, status: 'Sustainable', habitat: 'Pelagic' },
      { name: 'Grouper', scientificName: 'Epinephelus marginatus', family: 'Serranidae', count: 234, status: 'Endangered', habitat: 'Reef' }
    ],
    crustaceans: [
      { name: 'Blue Crab', scientificName: 'Callinectes sapidus', family: 'Portunidae', count: 567, status: 'Sustainable', habitat: 'Coastal' },
      { name: 'Lobster', scientificName: 'Homarus americanus', family: 'Nephropidae', count: 189, status: 'Regulated', habitat: 'Benthic' },
      { name: 'Shrimp', scientificName: 'Penaeus vannamei', family: 'Penaeidae', count: 892, status: 'Farmed', habitat: 'Coastal' },
      { name: 'Krill', scientificName: 'Euphausia superba', family: 'Euphausiidae', count: 2341, status: 'Abundant', habitat: 'Planktonic' }
    ],
    mollusks: [
      { name: 'Octopus', scientificName: 'Octopus vulgaris', family: 'Octopodidae', count: 156, status: 'Sustainable', habitat: 'Benthic' },
      { name: 'Squid', scientificName: 'Loligo vulgaris', family: 'Loliginidae', count: 423, status: 'Abundant', habitat: 'Pelagic' },
      { name: 'Mussel', scientificName: 'Mytilus edulis', family: 'Mytilidae', count: 1876, status: 'Farmed', habitat: 'Attached' },
      { name: 'Oyster', scientificName: 'Crassostrea virginica', family: 'Ostreidae', count: 734, status: 'Farmed', habitat: 'Attached' }
    ],
    coral: [
      { name: 'Brain Coral', scientificName: 'Diploria labyrinthiformis', family: 'Mussidae', count: 89, status: 'Protected', habitat: 'Reef' },
      { name: 'Staghorn Coral', scientificName: 'Acropora cervicornis', family: 'Acroporidae', count: 67, status: 'Endangered', habitat: 'Reef' },
      { name: 'Table Coral', scientificName: 'Acropora hyacinthus', family: 'Acroporidae', count: 123, status: 'Vulnerable', habitat: 'Reef' },
      { name: 'Soft Coral', scientificName: 'Alcyonium digitatum', family: 'Alcyoniidae', count: 234, status: 'Stable', habitat: 'Reef' }
    ]
  };

  // Distribution data for charts
  const distributionData = [
    { name: 'Fish', value: 3117, color: '#0088FE' },
    { name: 'Crustaceans', value: 3989, color: '#00C49F' },
    { name: 'Mollusks', value: 3189, color: '#FFBB28' },
    { name: 'Coral', value: 513, color: '#FF8042' }
  ];

  // Status distribution
  const statusData = [
    { name: 'Sustainable', count: 2456, color: '#10B981' },
    { name: 'Protected', count: 890, color: '#3B82F6' },
    { name: 'Vulnerable', count: 544, color: '#F59E0B' },
    { name: 'Endangered', count: 301, color: '#EF4444' },
    { name: 'Abundant', count: 3767, color: '#8B5CF6' },
    { name: 'Farmed', count: 2502, color: '#06B6D4' }
  ];

  // Family distribution for TreeMap
  const familyData = [
    { name: 'Scombridae', size: 1636, species: 8 },
    { name: 'Salmonidae', size: 623, species: 3 },
    { name: 'Clupeidae', size: 1203, species: 12 },
    { name: 'Portunidae', size: 567, species: 4 },
    { name: 'Penaeidae', size: 892, species: 6 },
    { name: 'Octopodidae', size: 156, species: 2 },
    { name: 'Mytilidae', size: 1876, species: 7 },
    { name: 'Acroporidae', size: 190, species: 15 }
  ];

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

  const filteredData = taxonomyData[selectedCategory]?.filter(species =>
    species.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    species.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="taxonomy-module">
      {/* Header */}
      <div className="module-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Dashboard
        </button>
        <h1 className="module-title">🐠 Marine Taxonomy Classification Module</h1>
        <p className="module-description">
          Comprehensive database of marine species with scientific classification and conservation status
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="stats-overview">
        <div className="stat-card total">
          <div className="stat-icon">🌊</div>
          <div className="stat-info">
            <h3>Total Species</h3>
            <p className="stat-number">10,808</p>
          </div>
        </div>
        <div className="stat-card families">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Families</h3>
            <p className="stat-number">247</p>
          </div>
        </div>
        <div className="stat-card endangered">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Endangered</h3>
            <p className="stat-number">301</p>
          </div>
        </div>
        <div className="stat-card protected">
          <div className="stat-icon">🛡️</div>
          <div className="stat-info">
            <h3>Protected</h3>
            <p className="stat-number">890</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="taxonomy-grid">
        {/* Left Panel - Controls and Filters */}
        <div className="left-panel">
          <div className="filter-section">
            <h3>Category Selection</h3>
            <div className="category-buttons">
              {Object.keys(taxonomyData).map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'fish' && '🐟'} 
                  {category === 'crustaceans' && '🦐'} 
                  {category === 'mollusks' && '🐙'} 
                  {category === 'coral' && '🪸'}
                  <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="search-section">
            <h3>Search Species</h3>
            <input
              type="text"
              placeholder="Search by name or scientific name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Species Distribution Chart */}
          <div className="chart-section">
            <h3>Species Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Center Panel - Species List */}
        <div className="center-panel">
          <div className="species-list-header">
            <h3>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Species ({filteredData.length})</h3>
          </div>
          
          <div className="species-list">
            {filteredData.map((species, index) => (
              <div key={index} className="species-card">
                <div className="species-header">
                  <h4 className="species-name">{species.name}</h4>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(species.status) }}
                  >
                    {species.status}
                  </span>
                </div>
                <div className="species-details">
                  <p><strong>Scientific Name:</strong> <em>{species.scientificName}</em></p>
                  <p><strong>Family:</strong> {species.family}</p>
                  <p><strong>Population Count:</strong> {species.count.toLocaleString()}</p>
                  <p><strong>Habitat:</strong> {species.habitat}</p>
                </div>
                <div className="species-actions">
                  <button 
                    className="detail-btn"
                    onClick={() => navigate(`/species-detail/${selectedCategory}/${index}`, {
                      state: { species, category: selectedCategory }
                    })}
                  >
                    View Details
                  </button>
                  <button className="research-btn">
                    Add to Research
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Charts and Analysis */}
        <div className="right-panel">
          {/* Conservation Status Chart */}
          <div className="chart-section">
            <h3>Conservation Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Family Distribution Chart */}
          <div className="chart-section">
            <h3>Family Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={familyData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="size" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="actions-section">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button 
                className="action-btn primary"
                onClick={() => navigate('/species-comparison')}
              >
                📊 Compare Species
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => navigate('/taxonomy-report')}
              >
                📄 Generate Report
              </button>
              <button 
                className="action-btn tertiary"
                onClick={() => navigate('/conservation-status')}
              >
                🛡️ Conservation Hub
              </button>
            </div>
          </div>

          {/* Research Notes */}
          <div className="notes-section">
            <h3>Research Notes</h3>
            <div className="note-card">
              <h4>Recent Findings</h4>
              <ul>
                <li>Tuna population showing recovery signs</li>
                <li>Coral bleaching events increasing</li>
                <li>New shrimp species discovered</li>
                <li>Seasonal migration patterns shifting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxonomyModule;