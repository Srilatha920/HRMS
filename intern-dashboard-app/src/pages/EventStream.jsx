import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useApp } from "../context/AppContext";

const EVENT_TYPES = [
  { key: "all",        label: "All Events",  icon: "⚡" },
  { key: "feedback",   label: "Feedback",    icon: "💬" },
  { key: "promotion",  label: "Promotions",  icon: "🚀" },
  { key: "transfer",   label: "Transfers",   icon: "🔁" },
  { key: "onboarding", label: "Onboarding",  icon: "📋" },
  { key: "nudge",      label: "AI Nudges",   icon: "🧠" },
  { key: "wellbeing",  label: "Wellbeing",   icon: "💚" },
  { key: "recognition",label: "Recognition", icon: "🏆" },
];

const formatTimestamp = (ts) => {
  const date = new Date(ts);
  return date.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const EventStream = () => {
  const { events } = useApp();
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = events.filter((e) => {
    const matchType   = activeFilter === "all" || e.type === activeFilter;
    const matchSearch = search === "" ||
      e.internName?.toLowerCase().includes(search.toLowerCase()) ||
      e.body?.toLowerCase().includes(search.toLowerCase()) ||
      e.label?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const typeColors = {
    feedback:    "rgba(139,92,246,0.15)",
    promotion:   "rgba(99,102,241,0.15)",
    transfer:    "rgba(6,182,212,0.15)",
    onboarding:  "rgba(16,185,129,0.15)",
    nudge:       "rgba(99,102,241,0.15)",
    wellbeing:   "rgba(16,185,129,0.15)",
    recognition: "rgba(245,158,11,0.15)",
    alert:       "rgba(239,68,68,0.15)",
  };

  return (
    <Layout title="Event Stream">
      {/* Header stats */}
      <div className="summary-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", marginBottom: 28 }}>
        <div className="summary-card summary-card-blue">
          <div className="summary-card-icon">⚡</div>
          <div>
            <p className="summary-card-value">{events.length}</p>
            <p className="summary-card-label">Total Events</p>
          </div>
        </div>
        <div className="summary-card summary-card-purple">
          <div className="summary-card-icon">🚀</div>
          <div>
            <p className="summary-card-value">{events.filter(e => e.type === "promotion").length}</p>
            <p className="summary-card-label">Promotions</p>
          </div>
        </div>
        <div className="summary-card summary-card-green">
          <div className="summary-card-icon">🧠</div>
          <div>
            <p className="summary-card-value">{events.filter(e => e.type === "nudge").length}</p>
            <p className="summary-card-label">AI Actions</p>
          </div>
        </div>
        <div className="summary-card summary-card-blueLight">
          <div className="summary-card-icon">💬</div>
          <div>
            <p className="summary-card-value">{events.filter(e => e.type === "feedback").length}</p>
            <p className="summary-card-label">Feedback Events</p>
          </div>
        </div>
      </div>

      <div className="card">
        {/* Filter chips */}
        <div className="event-filter-bar">
          {EVENT_TYPES.map((t) => (
            <button
              key={t.key}
              id={`event-filter-${t.key}`}
              className={`event-filter-chip${activeFilter === t.key ? " event-filter-chip-active" : ""}`}
              onClick={() => setActiveFilter(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input
            className="input"
            style={{ width: "100%" }}
            placeholder="Search by intern name, event type, or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Count */}
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
          Showing <strong style={{ color: "var(--text-primary)" }}>{filtered.length}</strong> event{filtered.length !== 1 ? "s" : ""}
        </div>

        {/* Events */}
        {filtered.length === 0 ? (
          <div className="lc-empty-state">
            No events match the current filter or search.
          </div>
        ) : (
          <div className="event-stream">
            {filtered.map((event, idx) => (
              <div key={event.id} className="event-item">
                {/* Timeline dot */}
                <div className="event-timeline">
                  <div
                    className="event-dot"
                    style={{ background: typeColors[event.type] || "var(--bg-surface-hv)" }}
                  >
                    {event.icon}
                  </div>
                </div>

                {/* Body */}
                <div className="event-body">
                  <div className="event-label">{event.label}</div>
                  <div className="event-text">{event.body}</div>
                  <div className="event-meta">
                    <span>🕐 {formatTimestamp(event.timestamp)}</span>
                    {event.internName && <span>👤 {event.internName}</span>}
                    {event.link && (
                      <Link to={event.link} className="event-link">
                        View →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventStream;
