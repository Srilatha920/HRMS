import React, { useState, useEffect } from "react";

const TRIGGERS_DATA = {
  employees: [
    { id: "e1", name: "Recurring Pulse", desc: "Send every 2 weeks to all active employees", enabled: true, icon: "🔁" },
    { id: "e2", name: "90-Day New Hire Check-in", desc: "Trigger when an employee completes 90 days", enabled: true, icon: "📅" },
    { id: "e3", name: "Post-Promotion Survey", desc: "Trigger 2 weeks after a promotion event is logged", enabled: true, icon: "🏆" },
    { id: "e4", name: "Exit Experience Survey", desc: "Trigger when offboarding date is confirmed", enabled: false, icon: "🚪" },
  ],
  interns: [
    { id: "i1", name: "First Week Welcome", desc: "Trigger 3 days after an intern's join date", enabled: true, icon: "✨" },
    { id: "i2", name: "Mid-Term Experience", desc: "Trigger at 45 days (mid-way of internship)", enabled: true, icon: "📊" },
    { id: "i3", name: "Exit Interview Survey", desc: "Trigger 7 days before internship completion date", enabled: true, icon: "🚪" },
  ],
};

const UPCOMING_SENDS = {
  employees: [
    { event: "90 days reached", target: "Employee #4821", date: "Jul 29, 2026", survey: "90-Day New Hire Check-in" },
    { event: "Start date anniversary", target: "Employee #5011", date: "Jul 28, 2026", survey: "First Week Welcome Survey" },
    { event: "Promotion recorded", target: "Employee #3390", date: "Aug 02, 2026", survey: "Post-Promotion Check-in" },
    { event: "Recurring cadence", target: "All active (260)", date: "Aug 03, 2026", survey: "Bi-Weekly Pulse Check" },
  ],
  interns: [
    { event: "Join date + 3 days", target: "Sneha Reddy", date: "Jul 28, 2026", survey: "First Week Welcome Survey" },
    { event: "45 Days Completed", target: "Srilatha", date: "Jul 31, 2026", survey: "Mid-Term Experience Survey" },
    { event: "90 Days Reached", target: "Rahul Verma", date: "Aug 05, 2026", survey: "Exit Interview Survey" },
    { event: "Join date + 3 days", target: "Mohammed Faisal", date: "Aug 08, 2026", survey: "First Week Welcome Survey" },
  ],
};

const Scheduling = ({ targetGroup = "employees" }) => {
  const cohortKey = targetGroup === "employees" ? "employees" : "interns";
  const [triggers, setTriggers] = useState(TRIGGERS_DATA[cohortKey]);

  useEffect(() => {
    setTriggers(TRIGGERS_DATA[cohortKey]);
  }, [targetGroup, cohortKey]);

  const handleToggle = (id) => {
    setTriggers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const upcoming = UPCOMING_SENDS[cohortKey];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Triggers Grid */}
      <div>
        <div className="builder-col-title">Active Automation Triggers</div>
        <div className="trigger-grid">
          {triggers.map((t) => (
            <div key={t.id} className="trigger-card">
              <div className="trigger-top">
                <div className="trigger-icon">{t.icon}</div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={t.enabled}
                    onChange={() => handleToggle(t.id)}
                  />
                  <span className="slider" />
                </label>
              </div>
              <div className="trigger-name">{t.name}</div>
              <div className="trigger-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Table */}
      <div className="card">
        <div className="card-title">Upcoming Automated Sends</div>
        <div style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Trigger Event</th>
                <th>Target recipient</th>
                <th>Scheduled date</th>
                <th>Survey Template</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((u, i) => (
                <tr key={i}>
                  <td>{u.event}</td>
                  <td>{u.target}</td>
                  <td>{u.date}</td>
                  <td style={{ color: "var(--color-primary)", fontWeight: 500 }}>{u.survey}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="setting-note" style={{ marginTop: 12 }}>
          🔔 Automated reminders are configured to send 3 days after the initial invite if no response is recorded.
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
