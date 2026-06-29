import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./Dashboard.css";

// Marine data for the dashboard
const marineData = [
  { name: "Jan", fishCaught: 120, species: 15, temperature: 22.5, biodiversityIndex: 0.75 },
  { name: "Feb", fishCaught: 150, species: 18, temperature: 23.1, biodiversityIndex: 0.82 },
  { name: "Mar", fishCaught: 180, species: 22, temperature: 24.2, biodiversityIndex: 0.89 },
  { name: "Apr", fishCaught: 210, species: 25, temperature: 25.8, biodiversityIndex: 0.95 },
  { name: "May", fishCaught: 190, species: 20, temperature: 26.5, biodiversityIndex: 0.88 },
  { name: "Jun", fishCaught: 165, species: 16, temperature: 27.2, biodiversityIndex: 0.78 },
  { name: "Jul", fishCaught: 145, species: 14, temperature: 28.1, biodiversityIndex: 0.72 },
  { name: "Aug", fishCaught: 135, species: 13, temperature: 28.5, biodiversityIndex: 0.68 },
  { name: "Sep", fishCaught: 155, species: 17, temperature: 27.8, biodiversityIndex: 0.79 },
  { name: "Oct", fishCaught: 175, species: 19, temperature: 26.9, biodiversityIndex: 0.85 },
  { name: "Nov", fishCaught: 195, species: 21, temperature: 25.3, biodiversityIndex: 0.91 },
  { name: "Dec", fishCaught: 140, species: 16, temperature: 23.7, biodiversityIndex: 0.76 }
];

const speciesData = [
  { name: "Fish", value: 65, color: "#0088FE" },
  { name: "Mollusks", value: 20, color: "#00C49F" },
  { name: "Crustaceans", value: 10, color: "#FFBB28" },
  { name: "Others", value: 5, color: "#FF8042" }
];

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const navigate = useNavigate();

  const filteredData =
    selectedMonth === "All"
      ? marineData
      : marineData.filter((d) => d.name === selectedMonth);

  // Navigate to data analysis page
  const openAnalysisPage = (payload = {}) => {
    navigate("/data-analysis", { 
      state: { 
        data: payload.data ?? filteredData, 
        selectedMonth 
      } 
    });
  };

  // Navigate to details page
  const openDetailsPage = (itemId) => {
    navigate(`/details/${itemId}`, {
      state: {
        data: filteredData,
        selectedMonth
      }
    });
  };

  const totalFishCaught = filteredData.reduce((sum, item) => sum + item.fishCaught, 0);
  const avgBiodiversity = (filteredData.reduce((sum, item) => sum + item.biodiversityIndex, 0) / filteredData.length).toFixed(2);
  const avgTemperature = (filteredData.reduce((sum, item) => sum + item.temperature, 0) / filteredData.length).toFixed(1);

  return (
    <div className="marine-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">🌊 Marine Life Dashboard</h1>
        <p className="dashboard-subtitle">
          Comprehensive overview of marine biodiversity and fishing patterns
        </p>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Statistics Cards */}
        <div className="stats-section">
          <div className="stat-card fish-card">
            <div className="stat-icon">🐟</div>
            <div className="stat-content">
              <h3>Total Fish Caught</h3>
              <p className="stat-number">{totalFishCaught.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card biodiversity-card">
            <div className="stat-icon">🌊</div>
            <div className="stat-content">
              <h3>Biodiversity Index</h3>
              <p className="stat-number">{avgBiodiversity}</p>
            </div>
          </div>

          <div className="stat-card temperature-card">
            <div className="stat-icon">🌡️</div>
            <div className="stat-content">
              <h3>Avg Temperature</h3>
              <p className="stat-number">{avgTemperature}°C</p>
            </div>
          </div>
        </div>

        {/* Main Analysis Card */}
        <div 
          className="analysis-card clickable-card"
          onClick={() => openAnalysisPage({ data: filteredData })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") openAnalysisPage({ data: filteredData }); }}
        >
          <div className="card-header">
            <h2>📊 Marine Data Analysis</h2>
            <select
              className="month-filter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="All">All Months</option>
              {marineData.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="fishCaught" fill="#0088FE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="card-footer">
            Click anywhere on this card to open detailed marine analysis
          </p>
        </div>

        {/* Species Distribution */}
        <div className="species-card">
          <h2>🐠 Species Distribution</h2>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {speciesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <h2>⚡ Quick Actions</h2>
          <div className="action-buttons">
            <button 
              className="action-btn primary-btn"
              onClick={() => openAnalysisPage()}
            >
              View Analysis
            </button>
            <button 
              className="action-btn secondary-btn"
              onClick={() => openDetailsPage('marine-overview')}
            >
              View Details
            </button>
            <button 
              className="action-btn tertiary-btn"
              onClick={() => navigate('/dashboard/scientist')}
            >
              Scientific View
            </button>
            <button 
              className="action-btn tertiary-btn"
              onClick={() => navigate('/dashboard/fisherman')}
            >
              Fisherman View
            </button>
          </div>
        </div>

        {/* Environmental Insights */}
        <div className="insights-card">
          <h2>🌊 Environmental Insights</h2>
          <div className="insights-content">
            <div className="insight-item">
              <span className="insight-icon">📈</span>
              <div>
                <h4>Population Trend</h4>
                <p>Fish population shows seasonal variations with peaks in spring</p>
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🌡️</span>
              <div>
                <h4>Climate Impact</h4>
                <p>Water temperature affects species diversity and migration patterns</p>
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-icon">⚠️</span>
              <div>
                <h4>Conservation Alert</h4>
                <p>Monitor biodiversity index - current average: {avgBiodiversity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;