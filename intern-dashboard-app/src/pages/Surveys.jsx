import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import Button from "../components/common/Button";
import SurveyBuilder from "../components/surveys/SurveyBuilder";
import Scheduling from "../components/surveys/Scheduling";
import LiveResults from "../components/surveys/LiveResults";
import SurveyPreview from "../components/surveys/SurveyPreview";
import SentimentAnalysis from "../components/surveys/SentimentAnalysis";

const TABS = [
  { key: "builder",    label: "Survey Builder",    icon: "🛠️" },
  { key: "scheduling", label: "Scheduling & Rules",icon: "📅" },
  { key: "results",    label: "Live Results",     icon: "📊" },
  { key: "preview",    label: "Recipient Experience",icon: "📱" },
  { key: "sentiment",  label: "Sentiment intelligence",icon: "💬" },
];

const Surveys = () => {
  const [targetGroup, setTargetGroup] = useState("employees"); // "employees" | "interns"
  const [activeTab, setActiveTab] = useState("builder");
  const [builderQuestions, setBuilderQuestions] = useState([]);
  const [notificationMsg, setNotificationMsg] = useState("");

  // Update default questions based on cohort
  useEffect(() => {
    if (targetGroup === "employees") {
      setBuilderQuestions([
        { id: 1, type: "rating", label: "How manageable is your current workload this week?" },
        { id: 2, type: "text", label: "What's one thing that would make work easier this week?" },
      ]);
    } else {
      setBuilderQuestions([
        { id: 1, type: "rating", label: "How satisfied are you with the mentorship support?" },
        { id: 2, type: "text", label: "What technical skill do you feel you want more hands-on training with?" },
      ]);
    }
  }, [targetGroup]);

  const handleSaveSurvey = (surveyData) => {
    setBuilderQuestions(surveyData.questions);
    setNotificationMsg(`Survey "${surveyData.title}" saved successfully for ${targetGroup === "employees" ? "Employees" : "Interns"}!`);
    setTimeout(() => setNotificationMsg(""), 4000);
  };

  return (
    <Layout title="Surveys & Employee Listening">
      {/* Toast Notification */}
      {notificationMsg && (
        <div 
          className="card" 
          style={{ 
            position: "fixed", 
            top: 24, 
            right: 24, 
            zIndex: 1000, 
            background: "rgba(16, 185, 129, 0.9)", 
            color: "#fff",
            border: "1px solid rgba(16, 185, 129, 0.5)",
            borderRadius: "var(--radius-md)",
            padding: "12px 24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)"
          }}
        >
          <span>✓ {notificationMsg}</span>
        </div>
      )}

      {/* Cohort Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>
            Listening & Pulse Survey Cadence
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            Configure questions, triggers, analytics and feedback loops.
          </p>
        </div>

        <div className="survey-cohort-selector">
          <Button
            variant={targetGroup === "employees" ? "primary" : "ghost"}
            className="survey-cohort-btn"
            style={{ borderRadius: "var(--radius-md)" }}
            onClick={() => setTargetGroup("employees")}
          >
            👥 Employees
          </Button>
          <Button
            variant={targetGroup === "interns" ? "primary" : "ghost"}
            className="survey-cohort-btn"
            style={{ borderRadius: "var(--radius-md)" }}
            onClick={() => setTargetGroup("interns")}
          >
            🎓 Interns
          </Button>
        </div>
      </div>

      {/* Sub navigation Tabs */}
      <div 
        className="card" 
        style={{ 
          padding: 8, 
          display: "flex", 
          gap: 8, 
          overflowX: "auto", 
          marginBottom: 24,
          borderRadius: "var(--radius-md)" 
        }}
      >
        {TABS.map((t) => (
          <Button
            key={t.key}
            variant={activeTab === t.key ? "primary" : "ghost"}
            className="survey-cohort-btn"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              padding: "10px 16px",
              flexShrink: 0,
              borderRadius: "var(--radius-md)"
            }}
            onClick={() => setActiveTab(t.key)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </Button>
        ))}
      </div>

      {/* Dynamic Module Content */}
      <div>
        {activeTab === "builder" && (
          <SurveyBuilder 
            targetGroup={targetGroup} 
            onSave={handleSaveSurvey} 
          />
        )}
        {activeTab === "scheduling" && (
          <Scheduling targetGroup={targetGroup} />
        )}
        {activeTab === "results" && (
          <LiveResults targetGroup={targetGroup} />
        )}
        {activeTab === "preview" && (
          <SurveyPreview targetGroup={targetGroup} questions={builderQuestions} />
        )}
        {activeTab === "sentiment" && (
          <SentimentAnalysis targetGroup={targetGroup} />
        )}
      </div>
    </Layout>
  );
};

export default Surveys;
