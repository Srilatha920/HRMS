import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Unified app context — wraps the entire platform
import { AppProvider } from "./context/AppContext";

// Dashboard stylesheet
import "./styles/dashboard.css";

// Existing pages
import Dashboard           from "./pages/Dashboard";
import InternsList         from "./pages/InternsList";
import InternProgress      from "./pages/InternProgress";
import CompareInterns      from "./pages/CompareInterns";
import AssessmentForm      from "./pages/AssessmentForm";
import PerformanceReport   from "./pages/PerformanceReport";

// Employee Lifecycle pages
import LifecycleHub        from "./pages/LifecycleHub";
import Onboarding          from "./pages/Onboarding";
import PromotionsTransfers from "./pages/PromotionsTransfers";
import FeedbackLog         from "./pages/FeedbackLog";
import ExitInterview       from "./pages/ExitInterview";

// Integrated platform pages
import EventStream         from "./pages/EventStream";
import Attendance          from "./pages/Attendance";

function App() {
  return (
    // AppProvider gives every page access to:
    //  - unified intern profiles
    //  - cross-module event stream
    //  - notification fabric (rule-engine driven)
    //  - notification drawer state
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Core pages */}
          <Route path="/dashboard"      element={<Dashboard />} />
          <Route path="/interns"        element={<InternsList />} />
          <Route path="/progress/:id"   element={<InternProgress />} />
          <Route path="/compare"        element={<CompareInterns />} />
          <Route path="/assessment"     element={<AssessmentForm />} />
          <Route path="/report/:id"     element={<PerformanceReport />} />

          {/* Integrated platform pages */}
          <Route path="/events"         element={<EventStream />} />
          <Route path="/attendance"      element={<Attendance />} />

          {/* Employee Lifecycle routes */}
          <Route path="/lifecycle"                element={<LifecycleHub />} />
          <Route path="/lifecycle/onboarding"     element={<Onboarding />} />
          <Route path="/lifecycle/promotions"     element={<PromotionsTransfers />} />
          <Route path="/lifecycle/feedback"       element={<FeedbackLog />} />
          <Route path="/lifecycle/exit"           element={<ExitInterview />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
