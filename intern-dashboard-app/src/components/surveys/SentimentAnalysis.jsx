import React, { useState, useEffect } from "react";
import Button from "../common/Button";

const ALERT_DATA = {
  employees: {
    title: "Negative sentiment spike detected · Workload",
    desc: "Negative mentions regarding work hours increased 18% over the past 7 days across Engineering. PII has been redacted.",
  },
  interns: {
    title: "Support gap flagged · Mentorship Support",
    desc: "Mentions regarding mentor availability decreased 14% this week in Batch B (Node Backend). Action plan recommended.",
  }
};

const THEMES_DATA = {
  employees: [
    { id: "e_workload", name: "Workload & Hours", count: 142, pos: 18, neu: 26, neg: 56, trend: "worsening", delta: 18,
      comments: [
        { sentiment: "neg", text: "Sprint scope keeps growing but the release timeline never shifts." },
        { sentiment: "neg", text: "I'm covering two roles since headcount was frozen." },
        { sentiment: "neu", text: "Workload is fine most weeks, but rough during deployments." },
        { sentiment: "pos", text: "Appreciate that leads are actively checking in on capacity now." },
      ] },
    { id: "e_manager", name: "Manager Support", count: 98, pos: 61, neu: 22, neg: 17, trend: "improving", delta: -9,
      comments: [
        { sentiment: "pos", text: "My manager makes time for weekly 1:1s even during busy weeks." },
        { sentiment: "pos", text: "Got clear, actionable feedback on my last performance cycle." },
        { sentiment: "neg", text: "Feedback only happens at review time, not before." },
      ] },
    { id: "e_growth", name: "Career Growth", count: 121, pos: 22, neu: 30, neg: 69, trend: "worsening", delta: 12,
      comments: [
        { sentiment: "neg", text: "No clear path to the next level on my team." },
        { sentiment: "neg", text: "Promotion cycle wasn't explained until I asked directly." },
        { sentiment: "pos", text: "Got approved for a certification course this quarter." },
      ] },
  ],
  interns: [
    { id: "i_mentorship", name: "Mentorship Quality", count: 34, pos: 58, neu: 24, neg: 18, trend: "stable", delta: 2,
      comments: [
        { sentiment: "pos", text: "My mentor is incredibly helpful and explains technical concepts clearly." },
        { sentiment: "neg", text: "It is hard to get help because my mentor is always in customer meetings." },
        { sentiment: "neu", text: "Mentorship is decent, but wish we had structured daily check-ins." },
      ] },
    { id: "i_learning", name: "Skills & Training", count: 48, pos: 72, neu: 18, neg: 10, trend: "improving", delta: -5,
      comments: [
        { sentiment: "pos", text: "The React workshops are excellent and directly applicable to the project." },
        { sentiment: "pos", text: "I feel like I'm writing production-level code already." },
        { sentiment: "neg", text: "Some learning resources are outdated. Need modern JS tutorials." },
      ] },
    { id: "i_integration", name: "Team Integration", count: 28, pos: 45, neu: 35, neg: 20, trend: "worsening", delta: 8,
      comments: [
        { sentiment: "neu", text: "Everyone on the team is friendly, but they are all very busy." },
        { sentiment: "neg", text: "I feel isolated working remotely without team-building sessions." },
        { sentiment: "pos", text: "Daily standups really help me feel connected to the project work." },
      ] },
  ]
};

const AlwaysOnWidget = () => {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!text.trim() && !mood) return;
    setSent(true);
    setText("");
    setMood("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="widget-preview">
      <div className="widget-header">
        <span>💬</span>
        <span>Share what's on your mind</span>
      </div>
      <textarea
        className="widget-textarea"
        placeholder="Tell us how work is going... (optional, responses are encrypted and anonymous)"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="widget-footer">
        <div className="mood-row">
          <Button 
            variant="secondary"
            className={`mood-btn ${mood === "pos" ? "mood-btn-active" : ""}`} 
            onClick={() => setMood("pos")}
            title="Positive"
          >
            👍
          </Button>
          <Button 
            variant="secondary"
            className={`mood-btn ${mood === "neu" ? "mood-btn-active" : ""}`} 
            onClick={() => setMood("neu")}
            title="Neutral"
          >
            😐
          </Button>
          <Button 
            variant="secondary"
            className={`mood-btn ${mood === "neg" ? "mood-btn-active" : ""}`} 
            onClick={() => setMood("neg")}
            title="Negative"
          >
            👎
          </Button>
        </div>
        <Button variant="primary" onClick={handleSend}>
          🚀 Send feedback
        </Button>
      </div>
      {sent && (
        <div className="widget-toast">
          <span>✓</span>
          <span>Thank you. Your feedback has been logged securely and anonymously.</span>
        </div>
      )}
    </div>
  );
};

const ThemeCard = ({ theme, onOpen }) => {
  const isWorsening = theme.trend === "worsening";
  const trendEmoji = theme.trend === "improving" ? "📈" : isWorsening ? "📉" : "➖";
  const badgeClass = isWorsening ? "badge-basic" : theme.trend === "improving" ? "badge-high" : "badge-intermediate";

  return (
    <div className="card theme-card" onClick={() => onOpen(theme)}>
      <div className="theme-top">
        <div className="theme-name">{theme.name}</div>
        <span className={`badge ${badgeClass}`}>
          {trendEmoji} {theme.trend}
        </span>
      </div>
      <div className="theme-count">
        {theme.count} <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: "normal" }}>comments</span>
      </div>
      <div className="sentiment-bar" style={{ display: "flex", height: 6, borderRadius: 4, overflow: "hidden", margin: "12px 0" }}>
        <div style={{ width: `${theme.pos}%`, background: "var(--color-success)" }} />
        <div style={{ width: `${theme.neu}%`, background: "var(--text-muted)" }} />
        <div style={{ width: `${theme.neg}%`, background: "var(--color-danger)" }} />
      </div>
      <div className="theme-legend" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-secondary)" }}>
        <span>😊 {theme.pos}%</span>
        <span>😐 {theme.neu}%</span>
        <span>☹️ {theme.neg}%</span>
      </div>
      <button className="link-btn" style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: "var(--color-primary)", background: "transparent", border: "none", cursor: "pointer" }}>
        View sample comments →
      </button>
    </div>
  );
};

const SentimentAnalysis = ({ targetGroup = "employees" }) => {
  const cohortKey = targetGroup === "employees" ? "employees" : "interns";
  const alertInfo = ALERT_DATA[cohortKey];
  const themes = THEMES_DATA[cohortKey];
  const [selectedTheme, setSelectedTheme] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Alert Banner */}
      <div 
        className="card" 
        style={{ 
          borderLeft: "4px solid var(--color-danger)", 
          background: "rgba(239, 68, 68, 0.08)", 
          display: "flex", 
          gap: 16, 
          alignItems: "center",
          marginBottom: 0
        }}
      >
        <span style={{ fontSize: 24 }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{alertInfo.title}</h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{alertInfo.desc}</p>
        </div>
        <Button variant="secondary" style={{ padding: "8px 12px", fontSize: 12 }}>
          Address
        </Button>
      </div>

      {/* Grid: Always-on Widget and AI Description */}
      <div className="grid-2">
        <AlwaysOnWidget />
        <div className="card">
          <div className="card-title">How AI Clusters Feedback</div>
          <ul className="ai-steps" style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0, listStyle: "none" }}>
            <li>
              <span className="bullet">✨</span>
              <span>Personally identifiable details (PII) are automatically redacted before analysis.</span>
            </li>
            <li>
              <span className="bullet">✨</span>
              <span>Sentiments are tagged as positive, neutral, or negative.</span>
            </li>
            <li>
              <span className="bullet">✨</span>
              <span>Anonymity threshold (5 responses minimum) ensures team confidentiality.</span>
            </li>
            <li>
              <span className="bullet">✨</span>
              <span>Sudden drops in sentiment triggers instant alerts to managers.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Themes Grid */}
      <div>
        <div className="builder-col-title">Feedback Themes Analysis</div>
        <div className="theme-grid">
          {themes.map((t) => (
            <ThemeCard key={t.id} theme={t} onOpen={setSelectedTheme} />
          ))}
        </div>
      </div>

      {/* Drill-down Modal */}
      {selectedTheme && (
        <div className="modal-backdrop" onClick={() => setSelectedTheme(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="eyebrow" style={{ fontSize: 11, fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>
                  Theme drill-down
                </div>
                <h3 className="card-title" style={{ fontSize: 18, marginTop: 4, marginBottom: 0 }}>
                  {selectedTheme.name}
                </h3>
              </div>
              <Button 
                variant="ghost" 
                style={{ padding: "6px 12px", border: "none" }} 
                onClick={() => setSelectedTheme(null)}
              >
                ✕
              </Button>
            </div>
            <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
              <div className="card" style={{ flex: 1, padding: 12, marginBottom: 0, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{selectedTheme.count}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>Mentions</div>
              </div>
              <div className="card" style={{ flex: 1, padding: 12, marginBottom: 0, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--color-success)" }}>
                  {selectedTheme.pos}%
                </div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>Positive Share</div>
              </div>
            </div>
            
            <div className="modal-sub-title">Anonymized Sample Comments</div>
            <div className="comment-list">
              {selectedTheme.comments.map((c, i) => (
                <div key={i} className="comment-row">
                  <span className={`sent-dot sent-${c.sentiment}`} />
                  <span style={{ fontSize: 13, lineHeight: 1.4 }}>{c.text}</span>
                  <span className="anon-pill">Anonymous</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
