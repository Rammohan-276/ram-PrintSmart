import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const DataAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Marine data analysis
  const passed = location.state ?? {};
  const data = passed.data ?? [
    { name: "Jan", fishCaught: 120, species: 15, temperature: 22.5 },
    { name: "Feb", fishCaught: 150, species: 18, temperature: 23.1 },
    { name: "Mar", fishCaught: 180, species: 22, temperature: 24.2 },
    { name: "Apr", fishCaught: 210, species: 25, temperature: 25.8 },
    { name: "May", fishCaught: 190, species: 20, temperature: 26.5 },
    { name: "Jun", fishCaught: 165, species: 16, temperature: 27.2 }
  ];
  const selectedMonth = passed.selectedMonth ?? "All";

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2 text-blue-800">🐟 Marine Data Analysis</h1>
        <p className="text-sm text-gray-600 mb-6">
          Analyzing marine life patterns and fishing data for: {selectedMonth === "All" ? "All Months" : selectedMonth}
        </p>

        {/* Fish Caught Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">Fish Caught Over Time</h2>
            <div className="h-64 bg-white/10 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="fishCaught" fill="#ffffff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">Species Diversity</h2>
            <div className="h-64 bg-white/10 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="species" stroke="#ffffff" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Temperature Trends */}
        <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-6 text-white mb-6">
          <h2 className="text-xl font-semibold mb-4">🌡️ Water Temperature Trends</h2>
          <div className="h-48 bg-white/10 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#ffffff" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Raw Data Table */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📊 Raw Marine Data</h2>
          <div className="overflow-auto max-h-64 border rounded-lg bg-white">
            <table className="min-w-full text-left">
              <thead className="sticky top-0 bg-blue-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-blue-800">Month</th>
                  <th className="px-4 py-3 font-semibold text-blue-800">Fish Caught</th>
                  <th className="px-4 py-3 font-semibold text-blue-800">Species Count</th>
                  <th className="px-4 py-3 font-semibold text-blue-800">Avg Temperature (°C)</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-gray-500 text-center">
                      No marine data available
                    </td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <tr key={row.name} className={index % 2 === 0 ? "bg-blue-25" : "bg-white"}>
                      <td className="px-4 py-3 font-medium">{row.name}</td>
                      <td className="px-4 py-3">{row.fishCaught}</td>
                      <td className="px-4 py-3">{row.species}</td>
                      <td className="px-4 py-3">{row.temperature}°C</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🐟 Fish Population</h3>
            <p className="text-blue-600">Total fish caught this period: {data.reduce((sum, item) => sum + item.fishCaught, 0)}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">🌊 Biodiversity</h3>
            <p className="text-green-600">Average species per month: {Math.round(data.reduce((sum, item) => sum + item.species, 0) / data.length)}</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">🌡️ Climate</h3>
            <p className="text-orange-600">Average temperature: {(data.reduce((sum, item) => sum + item.temperature, 0) / data.length).toFixed(1)}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysis;