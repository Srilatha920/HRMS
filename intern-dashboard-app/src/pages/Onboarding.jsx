import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { interns } from "../data/internsData";
import { onboardingProgress as initialProgress, ONBOARDING_STEPS } from "../data/lifecycleData";

const Onboarding = () => {
  const [expandedId, setExpandedId] = useState(null);
  // Local state so checkboxes are interactive in the session
  const [progress, setProgress] = useState({ ...initialProgress });

  const toggleStep = (internId, stepIdx) => {
    setProgress((prev) => {
      const current = prev[internId] || [];
      const has = current.includes(stepIdx);
      return {
        ...prev,
        [internId]: has ? current.filter((s) => s !== stepIdx) : [...current, stepIdx],
      };
    });
  };

  return (
    <Layout title="Onboarding">
      <div className="card">
        <h3 className="card-title">Onboarding Checklists</h3>
        <p style={{ color: "#64748b", marginTop: 0, marginBottom: 20, fontSize: 14 }}>
          Click an employee row to view and manage their onboarding checklist steps.
        </p>

        {interns.map((intern) => {
          const done     = (progress[intern.id] || []).length;
          const total    = ONBOARDING_STEPS.length;
          const pct      = Math.round((done / total) * 100);
          const isExpanded = expandedId === intern.id;

          return (
            <div key={intern.id} className="ob-row">
              {/* Clickable header row */}
              <div
                className="ob-row-header"
                onClick={() => setExpandedId(isExpanded ? null : intern.id)}
                role="button"
                aria-expanded={isExpanded}
              >
                <div className="ob-row-name">
                  <strong>{intern.name}</strong>
                  <span className="ob-row-role">{intern.role}</span>
                </div>
                <div className="ob-row-right">
                  <div className="lc-progress-track" style={{ width: 140 }}>
                    <div
                      className="lc-progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: pct === 100 ? "#10b981" : "#3b82f6",
                      }}
                    />
                  </div>
                  <span className="ob-pct-label" style={{ color: pct === 100 ? "#10b981" : "#1e293b" }}>
                    {done}/{total}
                  </span>
                  <span className={`lc-badge lc-badge-${pct === 100 ? "complete" : "inprogress"}`}>
                    {pct === 100 ? "Complete" : "In Progress"}
                  </span>
                  <span className="ob-chevron">{isExpanded ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expandable checklist */}
              {isExpanded && (
                <div className="ob-checklist">
                  {ONBOARDING_STEPS.map((step, idx) => {
                    const checked = (progress[intern.id] || []).includes(idx);
                    return (
                      <label key={idx} className="ob-checklist-item">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleStep(intern.id, idx)}
                        />
                        <span className={checked ? "ob-step-done" : ""}>{step}</span>
                        {checked && <span className="ob-step-tick">✓ Done</span>}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Onboarding;
