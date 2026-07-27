import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { interns } from "../data/internsData";
import { feedbackEntries as initialEntries } from "../data/lifecycleData";

const FEEDBACK_TYPES = ["1-on-1", "Quarterly", "Peer"];

// Reusable star display component
const StarRating = ({ value }) => (
  <span className="lc-stars" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ color: s <= value ? "#f59e0b" : "#e2e8f0" }}>★</span>
    ))}
  </span>
);

const FeedbackLog = () => {
  const [entries, setEntries]           = useState(initialEntries);
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterType, setFilterType]     = useState("");
  const [showForm, setShowForm]         = useState(false);
  const [savedMsg, setSavedMsg]         = useState("");
  const [form, setForm] = useState({ internId: "", date: "", type: "1-on-1", rating: 3, notes: "" });

  const filtered = entries.filter((e) => {
    const matchEmp  = filterEmployee === "" || e.internId === Number(filterEmployee);
    const matchType = filterType === "" || e.type === filterType;
    return matchEmp && matchType;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const intern = interns.find((i) => i.id === Number(form.internId));
    setEntries((prev) => [
      {
        id: Date.now(),
        ...form,
        internId: Number(form.internId),
        internName: intern?.name || "",
        rating: Number(form.rating),
      },
      ...prev,
    ]);
    setForm({ internId: "", date: "", type: "1-on-1", rating: 3, notes: "" });
    setShowForm(false);
    setSavedMsg("Feedback entry saved successfully!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const typeBadgeClass = { "1-on-1": "oneonone", Quarterly: "quarterly", Peer: "peer" };

  return (
    <Layout title="Feedback Log">
      <div className="card">
        {/* Filter bar + add button */}
        <div className="lc-toolbar" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="filter-bar">
            <select className="input" value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}>
              <option value="">All Employees</option>
              {interns.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            <select className="input" value={filterType}
              onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              {FEEDBACK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <span style={{ fontSize: 13, color: "#94a3b8", alignSelf: "center" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm((f) => !f)}>
            {showForm ? "Cancel" : "+ Add Feedback"}
          </button>
        </div>

        {savedMsg && <div className="alert-success" style={{ marginTop: 12 }}>{savedMsg}</div>}

        {/* Add Feedback Form */}
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
                <label>Date</label>
                <input type="date" className="input" required value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select className="input" value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                  {FEEDBACK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Rating (1–5)</label>
                <select className="input" value={form.rating}
                  onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea className="input" rows="3" required
                placeholder="Feedback notes from this session…"
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary">Save Feedback</button>
          </form>
        )}

        {/* Feedback table */}
        {filtered.length === 0
          ? <p className="lc-empty-state">No feedback entries match the current filters.</p>
          : (
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Rating</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id}>
                    <td><strong>{entry.internName}</strong></td>
                    <td style={{ color: "#64748b", fontSize: 13 }}>{entry.date}</td>
                    <td>
                      <span className={`lc-type-badge lc-type-${typeBadgeClass[entry.type] || "oneonone"}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td><StarRating value={entry.rating} /></td>
                    <td style={{ color: "#64748b", fontSize: 13 }}>{entry.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </Layout>
  );
};

export default FeedbackLog;
