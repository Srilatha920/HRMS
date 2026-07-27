import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

// ─── Rule engine (client-side, no API key needed) ─────────────
const generateInsights = (intern, fireEvent) => {
  const insights = [];
  const skillScores = { Basic: 1, Intermediate: 2, High: 3 };

  // 1. Learning nudge — any skill at Basic
  const basicSkills = Object.entries(intern.skills)
    .filter(([, v]) => v === "Basic")
    .map(([k]) => k);

  if (basicSkills.length > 0) {
    insights.push({
      id: "nudge",
      type: "nudge",
      icon: "🧠",
      label: "Learning Nudge",
      text: `${basicSkills.join(", ")} ${basicSkills.length > 1 ? "are" : "is"} at Basic level. Recommended resources: ${intern.learningNudges.slice(0, 2).join(" · ")}.`,
      action: "Send Learning Path",
      onAction: () =>
        fireEvent({
          type: "nudge",
          icon: "🧠",
          label: "Learning Nudge Sent",
          body: `AI sent a learning path to ${intern.name} for ${basicSkills.join(", ")}.`,
          internId: intern.id,
          internName: intern.name,
          link: `/progress/${intern.id}`,
        }, intern.id),
    });
  }

  // 2. Wellbeing alert — low engagement or flag
  if (intern.wellbeingFlag || intern.engagementScore < 55) {
    insights.push({
      id: "wellbeing",
      type: "wellbeing",
      icon: "💚",
      label: "Wellbeing Alert",
      text: `Engagement score is ${intern.engagementScore}/100. Last check-in: ${intern.lastCheckIn}. Consider scheduling a 1-on-1 this week.`,
      action: "Schedule Check-In",
      onAction: () =>
        fireEvent({
          type: "wellbeing",
          icon: "💚",
          label: "Check-In Scheduled",
          body: `AI scheduled a wellbeing check-in with ${intern.name}.`,
          internId: intern.id,
          internName: intern.name,
          link: `/lifecycle/feedback`,
        }, intern.id),
    });
  }

  // 3. Recognition — high recognition count or all High skills
  const highSkills = Object.values(intern.skills).filter((v) => v === "High").length;
  if (intern.recognitionCount >= 3 || highSkills >= 3) {
    insights.push({
      id: "recognition",
      type: "recognition",
      icon: "🏆",
      label: "Recognition Moment",
      text: `${intern.name} has ${intern.recognitionCount} recognitions and ${highSkills} skills at High level. This is promotion-review territory.`,
      action: "Log Recognition",
      onAction: () =>
        fireEvent({
          type: "recognition",
          icon: "🏆",
          label: "Recognition Logged",
          body: `AI recognition event logged for ${intern.name}.`,
          internId: intern.id,
          internName: intern.name,
          link: `/lifecycle/promotions`,
        }, intern.id),
    });
  }

  // 4. Pairing suggestion — if any skill is Basic, suggest a mentor
  if (basicSkills.length > 0) {
    insights.push({
      id: "pairing",
      type: "nudge",
      icon: "🤝",
      label: "Peer Pairing",
      text: `Pair ${intern.name} with a High-level peer for ${basicSkills[0]} to accelerate growth via mentorship.`,
      action: "Suggest Pairing",
      onAction: () =>
        fireEvent({
          type: "nudge",
          icon: "🤝",
          label: "Pairing Suggested",
          body: `AI suggested a peer pairing for ${intern.name} on ${basicSkills[0]}.`,
          internId: intern.id,
          internName: intern.name,
          link: `/interns`,
        }, intern.id),
    });
  }

  // 5. Trajectory — if improving, celebrate
  if (intern.trajectory === "improving" && highSkills >= 2) {
    insights.push({
      id: "trajectory",
      type: "recognition",
      icon: "📈",
      label: "Strong Trajectory",
      text: `${intern.name} is on an improving trajectory with ${highSkills} High-level skills. Consider an expanded project scope.`,
      action: "Expand Scope",
      onAction: () =>
        fireEvent({
          type: "recognition",
          icon: "📈",
          label: "Scope Expanded",
          body: `AI flagged ${intern.name} for expanded project responsibility.`,
          internId: intern.id,
          internName: intern.name,
          link: `/lifecycle/promotions`,
        }, intern.id),
    });
  }

  return insights;
};

// ─── Component ────────────────────────────────────────────────
const AIInsightPanel = ({ intern }) => {
  const { fireEvent } = useApp();
  const [open, setOpen] = useState(true);
  const [actioned, setActioned] = useState({});

  const insights = generateInsights(intern, fireEvent);

  const handleAction = (insight) => {
    insight.onAction();
    setActioned((prev) => ({ ...prev, [insight.id]: true }));
  };

  return (
    <div className="ai-panel">
      {/* Header */}
      <div className="ai-panel-header" onClick={() => setOpen((o) => !o)}>
        <div className="ai-panel-title">
          <span>✨</span>
          <span>AI Insights</span>
          <span className="ai-panel-badge">AGENT</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {insights.length} insight{insights.length !== 1 ? "s" : ""}
          </span>
          <span className="ai-panel-toggle">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Insights */}
      {open && (
        <div className="ai-insights">
          {insights.length === 0 ? (
            <div className="ai-no-insights">
              <span>✅</span>
              <span>No urgent insights — {intern.name} is on track!</span>
            </div>
          ) : (
            insights.map((insight) => (
              <div
                key={insight.id}
                className={`ai-insight-card ai-insight-${insight.type}`}
              >
                <div className="ai-insight-icon">{insight.icon}</div>
                <div className="ai-insight-content">
                  <div className="ai-insight-label">{insight.label}</div>
                  <div className="ai-insight-text">{insight.text}</div>
                  {!actioned[insight.id] ? (
                    <button
                      className="ai-insight-action"
                      onClick={() => handleAction(insight)}
                    >
                      {insight.action}
                    </button>
                  ) : (
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--color-success)",
                        marginTop: 8,
                        display: "inline-block",
                        fontWeight: 600,
                      }}
                    >
                      ✓ Action sent to event stream
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsightPanel;
