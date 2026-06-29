import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

const Details = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get data passed from previous page or use default data
  const passed = location.state ?? {};
  const data = passed.data ?? [
    { name: "Jan", fishCaught: 120, species: 15, temperature: 22.5, biodiversityIndex: 0.75, planktonLevel: 45 },
    { name: "Feb", fishCaught: 150, species: 18, temperature: 23.1, biodiversityIndex: 0.82, planktonLevel: 52 },
    { name: "Mar", fishCaught: 180, species: 22, temperature: 24.2, biodiversityIndex: 0.89, planktonLevel: 58 },
    { name: "Apr", fishCaught: 210, species: 25, temperature: 25.8, biodiversityIndex: 0.95, planktonLevel: 65 },
    { name: "May", fishCaught: 190, species: 20, temperature: 26.5, biodiversityIndex: 0.88, planktonLevel: 60 },
    { name: "Jun", fishCaught: 165, species: 16, temperature: 27.2, biodiversityIndex: 0.78, planktonLevel: 48 }
  ];

  // Get detailed information based on the ID
  const getDetailedInfo = (detailId) => {
    const detailMappings = {
      'marine-overview': {
        title: '🌊 Marine Ecosystem Overview',
        description: 'Comprehensive analysis of marine biodiversity and ecosystem health',
        keyInsights: [
          'Seasonal fish migration patterns show optimal fishing periods',
          'Water temperature directly correlates with species diversity',
          'Biodiversity index indicates ecosystem stability',
          'Plankton levels serve as primary food source indicators'
        ]
      },
      'fish-population': {
        title: '🐟 Fish Population Analysis',
        description: 'Detailed analysis of fish population trends and catch data',
        keyInsights: [
          'Peak fishing season occurs during spring months',
          'Population shows cyclical patterns over the year',
          'Sustainable fishing practices maintain stable populations',
          'Climate change impacts on migration timing'
        ]
      },
      'biodiversity': {
        title: '🌿 Biodiversity Assessment',
        description: 'Marine biodiversity monitoring and species conservation status',
        keyInsights: [
          'Species diversity varies seasonally',
          'Endemic species require special protection',
          'Habitat preservation critical for biodiversity',
          'Climate impact on species distribution'
        ]
      },
      'temperature': {
        title: '🌡️ Ocean Temperature Analysis',
        description: 'Water temperature monitoring and climate change impacts',
        keyInsights: [
          'Rising temperatures affect marine ecosystems',
          'Seasonal temperature variations influence behavior',
          'Critical thresholds for species survival',
          'Long-term climate monitoring essential'
        ]
      }
    };

    return detailMappings[detailId] || detailMappings['marine-overview'];
  };

  const detailInfo = getDetailedInfo(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          ← Back to Dashboard
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
            {detailInfo.title}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {detailInfo.description}
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">🔍 Key Insights</h2>
          <ul className="space-y-3">
            {detailInfo.keyInsights.map((insight, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-gray-700">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-green-800">📊 Quick Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-semibold text-blue-800">Total Fish Monitored</span>
              <span className="text-blue-600 font-bold">
                {data.reduce((sum, item) => sum + item.fishCaught, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-semibold text-green-800">Species Diversity</span>
              <span className="text-green-600 font-bold">
                {Math.round(data.reduce((sum, item) => sum + item.species, 0) / data.length)} species
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="font-semibold text-orange-800">Avg Temperature</span>
              <span className="text-orange-600 font-bold">
                {(data.reduce((sum, item) => sum + item.temperature, 0) / data.length).toFixed(1)}°C
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-semibold text-purple-800">Biodiversity Index</span>
              <span className="text-purple-600 font-bold">
                {(data.reduce((sum, item) => sum + item.biodiversityIndex, 0) / data.length).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Temperature & Biodiversity Trend */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">🌡️ Temperature & Biodiversity Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ff6b6b" 
                  strokeWidth={3}
                  name="Temperature (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="biodiversityIndex" 
                  stroke="#4ecdc4" 
                  strokeWidth={3}
                  name="Biodiversity Index"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fish Population & Species Count */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">🐟 Fish Population & Species</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="fishCaught"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Fish Caught"
                />
                <Area
                  type="monotone"
                  dataKey="species"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Species Count"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Detailed Marine Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fish Caught
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Species Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temperature (°C)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biodiversity Index
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plankton Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={row.name} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.fishCaught.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.species}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.temperature}°C
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      row.biodiversityIndex > 0.8 
                        ? 'bg-green-100 text-green-800' 
                        : row.biodiversityIndex > 0.6 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {row.biodiversityIndex}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.planktonLevel}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">⚡ Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => navigate('/data-analysis', { state: { data } })}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            📊 View Analysis
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            🏠 Back to Dashboard
          </button>
          <button 
            onClick={() => navigate('/dashboard/scientist')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            🔬 Scientific View
          </button>
          <button 
            onClick={() => navigate('/dashboard/fisherman')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            🎣 Fisherman View
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;