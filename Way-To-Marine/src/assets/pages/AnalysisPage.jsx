import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If no state passed, fallback to empty array (or you can fetch from API here)
  const passed = location.state ?? {};
  const data = passed.data ?? []; // array of objects like {name, users}
  const selectedMonth = passed.selectedMonth ?? "All";

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Detailed Data Analysis</h1>
        <p className="text-sm text-gray-600 mb-4">Showing: {selectedMonth === "All" ? "All Months" : selectedMonth}</p>

        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h2 className="text-lg font-semibold mb-2">Raw Data</h2>
        <div className="overflow-auto max-h-64 border rounded">
          <table className="min-w-full text-left">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="px-4 py-2">Month</th>
                <th className="px-4 py-2">Users</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="2" className="px-4 py-3 text-gray-500">No data available</td></tr>
              ) : (
                data.map((row) => (
                  <tr key={row.name} className="border-t">
                    <td className="px-4 py-2">{row.name}</td>
                    <td className="px-4 py-2">{row.users}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
