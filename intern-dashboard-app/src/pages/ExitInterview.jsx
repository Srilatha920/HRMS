import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { interns } from "../data/internsData";
import { exitInterviews as initialExits } from "../data/lifecycleData";

const EXIT_REASONS = [
  "Better Opportunity",
  "End of Contract",
  "Personal Reasons",
  "Relocation",
  "Career Change",
  "Other",
];

const StarRating = ({ value }) => (
  <span className="lc-stars" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ color: s <= value ? "#f59e0b" : "#e2e8f0" }}>★</span>
    ))}
  </span>
);

const ExitInterview = () => {
  const [exits, setExits]       = useState(initialExits);
  const [showForm, setShowForm] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [form, setForm] = useState({
    internId: "", date: "", reason: EXIT_REASONS[0], rating: 3, feedback: "",
  });

  const avgRating =
    exits.length > 0
      ? (exits.reduce((sum, e) => sum + e.rating, 0) / exits.length).toFixed(1)
      : "—";

  const handleSubmit = (e) => {
    e.preventDefault();
    const intern = interns.find((i) => i.id === Number(form.internId));
    setExits((prev) => [
      {
        id: Date.now(),
        ...form,
        internId: Number(form.internId),
        internName: intern?.name || "",
        rating: Number(form.rating),
      },
      ...prev,
    ]);
    setForm({ internId: "", date: "", reason: EXIT_REASONS[0], rating: 3, feedback: "" });
    setShowForm(false);
    setSavedMsg("Exit interview recorded successfully.");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <Layout title="Exit Interviews">
      {/* Stats row */}
      <div className="summary-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div className="summary-card summary-card-blue">
          <div className="summary-card-icon">🚪</div>
          <div>
            <p className="summary-card-value">{exits.length}</p>
            <p className="summary-card-label">Exit Interviews</p>
          </div>
        </div>
        <div className="summary-card summary-card-green">
          <div className="summary-card-icon">⭐</div>
          <div>
            <p className="summary-card-value">{avgRating}</p>
            <p className="summary-card-label">Avg. Satisfaction</p>
          </div>
        </div>
        <div className="summary-card summary-card-purple">
          <div className="summary-card-icon">✅</div>
          <div>
            <p className="summary-card-value">{interns.length - exits.length}</p>
            <p className="summary-card-label">Currently Active</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="lc-toolbar">
          <h3 className="card-title" style={{ margin: 0 }}>Exit Interview Records</h3>
          <button className="btn btn-primary" onClick={() => setShowForm((f) => !f)}>
            {showForm ? "Cancel" : "+ Record Exit Interview"}
          </button>
        </div>

        {savedMsg && <div className="alert-success" style={{ marginTop: 12 }}>{savedMsg}</div>}

        {/* Exit Interview Form */}
        {showForm && (
          <form className="lc-form" onSubmit={handleSubmit}>
            <div className="lc-form-grid">
              <div className="form-group">
                <label>Employee</label>
                <select className="input" required value={form.internId}
                  onChange={(e) => setForm((p) => ({ ...p, internId: e.target.value }))}>
                  <option value="">Select employee…</option>
                  {interns.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Interview Date</label>
                <input type="date" className="input" required value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Reason for Leaving</label>
                <select className="input" value={form.reason}
                  onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}>
                  {EXIT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Overall Satisfaction (1–5)</label>
                <select className="input" value={form.rating}
                  onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Exit Feedback</label>
              <textarea className="input" rows="4" required
                placeholder="Detailed notes from the exit interview…"
                value={form.feedback}
                onChange={(e) => setForm((p) => ({ ...p, feedback: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary">Save Exit Interview</button>
          </form>
        )}

        {/* Empty state or table */}
        {exits.length === 0 ? (
          <div className="lc-celebrate">
            <div className="lc-celebrate-icon">🎉</div>
            <p className="lc-celebrate-text">No exit interviews recorded — all employees are currently active!</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Record First Exit Interview
            </button>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Satisfaction</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {exits.map((entry) => (
                <tr key={entry.id}>
                  <td><strong>{entry.internName}</strong></td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>{entry.date}</td>
                  <td>
                    <span className="lc-badge lc-badge-exited">{entry.reason}</span>
                  </td>
                  <td><StarRating value={entry.rating} /></td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>{entry.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default ExitInterview;
