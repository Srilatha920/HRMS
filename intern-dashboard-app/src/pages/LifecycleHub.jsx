import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SummaryCard from "../components/common/SummaryCard";
import { interns } from "../data/internsData";
import {
  onboardingProgress,
  ONBOARDING_STEPS,
  promotions,
  feedbackEntries,
  exitInterviews,
} from "../data/lifecycleData";
import { attendanceRecords } from "../data/attendanceData";

const LifecycleHub = () => {
  const onboardingInProgress = interns.filter(
    (intern) => (onboardingProgress[intern.id] || []).length < ONBOARDING_STEPS.length
  ).length;

  const todayStr     = new Date().toISOString().split("T")[0];
  const presentToday = attendanceRecords.filter((r) => r.date === todayStr && r.status === "Present").length;

  return (
    <Layout title="Employee Lifecycle">
      {/* Summary Stats */}
      <div className="summary-grid">
        <SummaryCard label="Total Employees"        value={interns.length}          icon="👥" color="blue"      />
        <SummaryCard label="Onboarding In Progress" value={onboardingInProgress}     icon="📋" color="orange"    />
        <SummaryCard label="Promotions Recorded"    value={promotions.length}        icon="🚀" color="green"     />
        <SummaryCard label="Feedback Sessions"      value={feedbackEntries.length}   icon="💬" color="purple"    />
        <SummaryCard label="Present Today"          value={presentToday}             icon="📅" color="blueLight" />
      </div>

      {/* Quick-access navigation cards */}
      <div className="lc-nav-grid">
        <Link to="/lifecycle/onboarding" className="lc-nav-card">
          <span className="lc-nav-icon">📋</span>
          <div>
            <div className="lc-nav-title">Onboarding</div>
            <div className="lc-nav-desc">Track onboarding checklists & completion</div>
          </div>
          <span className="lc-nav-arrow">→</span>
        </Link>
        <Link to="/lifecycle/promotions" className="lc-nav-card">
          <span className="lc-nav-icon">🚀</span>
          <div>
            <div className="lc-nav-title">Promotions & Transfers</div>
            <div className="lc-nav-desc">Manage role changes and team moves</div>
          </div>
          <span className="lc-nav-arrow">→</span>
        </Link>
        <Link to="/lifecycle/feedback" className="lc-nav-card">
          <span className="lc-nav-icon">💬</span>
          <div>
            <div className="lc-nav-title">Feedback Log</div>
            <div className="lc-nav-desc">Document 1-on-1s, quarterly & peer reviews</div>
          </div>
          <span className="lc-nav-arrow">→</span>
        </Link>
        <Link to="/lifecycle/exit" className="lc-nav-card">
          <span className="lc-nav-icon">🚪</span>
          <div>
            <div className="lc-nav-title">Exit Interviews</div>
            <div className="lc-nav-desc">Record offboarding & exit feedback</div>
          </div>
          <span className="lc-nav-arrow">→</span>
        </Link>
        <Link to="/attendance" className="lc-nav-card">
          <span className="lc-nav-icon">📅</span>
          <div>
            <div className="lc-nav-title">Attendance</div>
            <div className="lc-nav-desc">Track daily presence, WFH & absence</div>
          </div>
          <span className="lc-nav-arrow">→</span>
        </Link>
      </div>

      {/* Employee lifecycle overview table */}
      <div className="card">
        <h3 className="card-title">Employee Lifecycle Overview</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Onboarding Progress</th>
              <th>Feedback Sessions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {interns.map((intern) => {
              const done  = (onboardingProgress[intern.id] || []).length;
              const total = ONBOARDING_STEPS.length;
              const pct   = Math.round((done / total) * 100);
              const sessions = feedbackEntries.filter((f) => f.internId === intern.id).length;
              const isExited = exitInterviews.some((e) => e.internId === intern.id);

              return (
                <tr key={intern.id}>
                  <td><strong>{intern.name}</strong></td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>{intern.role}</td>
                  <td>
                    <div className="lc-progress-wrap">
                      <div className="lc-progress-track">
                        <div
                          className="lc-progress-fill"
                          style={{ width: `${pct}%`, background: pct === 100 ? "#10b981" : "#3b82f6" }}
                        />
                      </div>
                      <span className="lc-progress-label">{pct}%</span>
                    </div>
                  </td>
                  <td>{sessions}</td>
                  <td>
                    <span className={`lc-badge lc-badge-${isExited ? "exited" : "active"}`}>
                      {isExited ? "Exited" : "Active"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default LifecycleHub;
