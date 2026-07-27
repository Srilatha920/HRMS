// ============================================================
// THIS IS A REFERENCE FILE - NOT MEANT TO OVERWRITE YOUR APP.JS
// ============================================================
// Copy the pieces you need into YOUR existing src/App.js:
//   1. The import statements at the top
//   2. The <Route> lines inside your existing <Routes>
//
// If you don't already have BrowserRouter/Routes set up, this
// file shows the full minimal setup as reference.

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- NEW: import the dashboard stylesheet once, at the top level ---
import "./styles/dashboard.css";

// --- NEW: import the new pages ---
import Dashboard from "./pages/Dashboard";
import InternsList from "./pages/InternsList";
import InternProgress from "./pages/InternProgress";
import CompareInterns from "./pages/CompareInterns";
import AssessmentForm from "./pages/AssessmentForm";
import PerformanceReport from "./pages/PerformanceReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect the home page straight to the dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* --- NEW ROUTES: add these inside your existing <Routes> --- */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interns" element={<InternsList />} />
        <Route path="/progress/:id" element={<InternProgress />} />
        <Route path="/compare" element={<CompareInterns />} />
        <Route path="/assessment" element={<AssessmentForm />} />
        <Route path="/report/:id" element={<PerformanceReport />} />

        {/* keep any of your existing routes here too */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
