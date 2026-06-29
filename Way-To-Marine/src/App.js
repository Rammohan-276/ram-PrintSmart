import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Aapke existing components/pages
import Intro from "./components/Intro";
import FormPage from "./pages/FormPage";
import ScientistDashboard from "./pages/ScientistDashboard";
import FishermanDashboard from "./pages/FishermanDashboard";
import DataAnalysis from "./pages/DataAnalysis";
import TaxonomyModule from "./pages/TaxonomyModule";
import SpeciesDetail from "./pages/SpeciesDetail";
import OtolithMorphology from "./pages/OtolithMorphology";
import EnvironmentalDNA from "./pages/EnvironmentalDNA";
import Loading from "./pages/Loading";

// Dusre wale dashboard pages
import Dashboard from "./pages/Dashboard";   // ✅ dhyaan rahe path sahi ho
import Details from "./pages/Details";       // ✅ dhyaan rahe path sahi ho

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loading for 3 seconds
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div style={{ padding: 20 }}>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/dashboard/scientist" element={<ScientistDashboard />} />
          <Route path="/dashboard/fisherman" element={<FishermanDashboard />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
          <Route path="/taxonomy-module" element={<TaxonomyModule />} />
          <Route path="/species-detail/:category/:index" element={<SpeciesDetail />} />
            <Route path="/otolith-morphology" element={<OtolithMorphology />} />
            <Route path="/environmental-dna" element={<EnvironmentalDNA />} />

          {/* Extra dashboard with details page */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
