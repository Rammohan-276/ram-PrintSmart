import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// If you have a Card component like before, keep this import.
// import { Card, CardContent } from "@/components/ui/card";
// Otherwise, we'll use a simple styled div as card.

const allData = [
  { name: "Jan", users: 30 },
  { name: "Feb", users: 45 },
  { name: "Mar", users: 60 },
  { name: "Apr", users: 20 },
  { name: "May", users: 75 },
  { name: "Jun", users: 50 },
  { name: "Jul", users: 90 },
  { name: "Aug", users: 40 },
  { name: "Sep", users: 65 },
  { name: "Oct", users: 55 },
  { name: "Nov", users: 80 },
  { name: "Dec", users: 100 },
];

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const navigate = useNavigate();

  const filteredData =
    selectedMonth === "All"
      ? allData
      : allData.filter((d) => d.name === selectedMonth);

  // onClick -> navigate to /analysis and pass the data via location.state
  const openAnalysisPage = (payload = {}) => {
    // payload can include data, selected filters, etc.
    navigate("/analysis", { state: { data: payload.data ?? filteredData, selectedMonth } });
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Data Analysis Card (clickable) */}
      <div
        className="shadow-lg rounded-2xl p-4 bg-white cursor-pointer hover:shadow-2xl"
        onClick={() => openAnalysisPage({ data: filteredData })}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") openAnalysisPage({ data: filteredData }); }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📊 Data Analysis</h2>

          <select
            className="border rounded-lg p-2 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            onClick={(e) => e.stopPropagation()} // prevent select click from triggering card click
          >
            <option value="All">All Months</option>
            {allData.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-3 text-sm text-gray-600">Click anywhere on this card to open detailed analysis.</p>
      </div>

      {/* Another Example Card */}
      <div className="shadow-lg rounded-2xl p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">📈 Growth Overview</h2>
        <p className="text-gray-600">This section gives insights into monthly growth patterns and active users.</p>
      </div>
    </div>
  );
};

export default Dashboard;
