import React, { useState, useEffect } from "react";
import Button from "../common/Button";

const QUESTION_BANK = [
  { type: "rating", label: "Rating scale (1–5)", icon: "⭐" },
  { type: "mcq",    label: "Multiple choice", icon: "📋" },
  { type: "text",   label: "Open text",       icon: "💬" },
  { type: "enps",   label: "NPS scale (0–10)", icon: "📈" },
];

const AI_SUGGESTIONS = {
  employees: {
    "Workload & Burnout": [
      "How manageable is your current workload?",
      "Do you have enough time to complete your work without regularly working extra hours?",
      "What's one thing that would make your workload easier this week?",
    ],
    "Manager Effectiveness": [
      "My manager supports my growth and development.",
      "I receive helpful feedback from my manager regularly.",
      "What's one thing your manager could do differently?",
    ],
    "Career Alignment": [
      "I understand how my work contributes to the company's goals.",
      "I feel motivated by the projects I am currently working on.",
      "What type of projects or learning opportunities do you want more of?",
    ]
  },
  interns: {
    "Mentorship Support": [
      "My mentor is available when I need guidance.",
      "How supported do you feel by your team members during tasks?",
      "What's one way your mentor or team could better guide you?",
    ],
    "Skills Growth & Learning": [
      "I am learning new technical or professional skills each week.",
      "The learning resources provided are helpful for my tasks.",
      "What skill or technology do you feel you need more training in?",
    ],
    "Project Scope Clarity": [
      "My project goals and requirements are clearly defined.",
      "I have a clear understanding of what a successful project deliverable looks like.",
      "What parts of your current project requirements are unclear?",
    ]
  }
};

const QuestionCard = ({ q, index, onRemove, onChange, onMoveUp, onMoveDown, isFirst, isLast }) => {
  return (
    <div className="q-card">
      <div className="q-card-head">
        <span className="q-index">Q{index + 1}</span>
        <span className="badge badge-intermediate" style={{ textTransform: "capitalize", marginLeft: 8 }}>
          {q.type === "enps" ? "NPS" : q.type}
        </span>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto", alignItems: "center" }}>
          <Button 
            variant="secondary" 
            style={{ padding: "4px 8px", fontSize: 11, minWidth: 28 }} 
            disabled={isFirst} 
            onClick={onMoveUp}
          >
            ▲
          </Button>
          <Button 
            variant="secondary" 
            style={{ padding: "4px 8px", fontSize: 11, minWidth: 28 }} 
            disabled={isLast} 
            onClick={onMoveDown}
          >
            ▼
          </Button>
          <Button variant="danger" style={{ padding: "4px 8px" }} onClick={onRemove}>
            🗑️
          </Button>
        </div>
      </div>
      <input
        className="q-input"
        value={q.label}
        onChange={(e) => onChange({ ...q, label: e.target.value })}
        placeholder="Type your question..."
      />
      {q.type === "rating" && (
        <div className="q-preview">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="star-preview">⭐</span>
          ))}
        </div>
      )}
      {q.type === "mcq" && (
        <div className="q-preview mcq-preview">
          {["Option A", "Option B", "Option C"].map((o, i) => (
            <div key={i} className="mcq-chip">{o}</div>
          ))}
        </div>
      )}
      {q.type === "text" && <div className="q-preview text-preview">Open response text area...</div>}
      {q.type === "enps" && (
        <div className="q-preview enps-preview">
          {Array.from({ length: 11 }).map((_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const SurveyBuilder = ({ targetGroup = "employees", onSave }) => {
  const cohortKey = targetGroup === "employees" ? "employees" : "interns";
  const defaultGoal = Object.keys(AI_SUGGESTIONS[cohortKey])[0];

  const [questions, setQuestions] = useState([]);
  const [goal, setGoal] = useState(defaultGoal);
  const [suggestions, setSuggestions] = useState([]);
  const [anonymous, setAnonymous] = useState(true);
  const [minGroup, setMinGroup] = useState(5);
  const [surveyTitle, setSurveyTitle] = useState("");

  // Sync state when cohort triggers change
  useEffect(() => {
    const goals = Object.keys(AI_SUGGESTIONS[cohortKey]);
    setGoal(goals[0]);
    setSuggestions([]);
    
    // Seed with two default questions matching target cohort
    if (targetGroup === "employees") {
      setSurveyTitle("Quarterly Employee Engagement Survey");
      setQuestions([
        { id: 1, type: "rating", label: "How would you rate your workload this week?" },
        { id: 2, type: "text", label: "What's one thing that would make work easier this week?" },
      ]);
    } else {
      setSurveyTitle("Bi-Weekly Intern Learning & Growth Survey");
      setQuestions([
        { id: 1, type: "rating", label: "How satisfied are you with the mentorship support?" },
        { id: 2, type: "text", label: "What technical skill do you feel you want more hands-on training with?" },
      ]);
    }
  }, [targetGroup]);

  const addQuestion = (block) => {
    setQuestions((qs) => [
      ...qs,
      { id: Date.now(), type: block.type, label: "" }
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((qs) => qs.filter((_, idx) => idx !== index));
  };

  const updateQuestion = (index, updatedQ) => {
    setQuestions((qs) => qs.map((q, idx) => (idx === index ? updatedQ : q)));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setQuestions((qs) => {
      const copy = [...qs];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index) => {
    if (index === questions.length - 1) return;
    setQuestions((qs) => {
      const copy = [...qs];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const generateSuggestions = () => {
    setSuggestions(AI_SUGGESTIONS[cohortKey][goal] || []);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        title: surveyTitle || "Untitled Survey",
        targetGroup,
        questions,
        anonymous,
        minGroupSize: minGroup,
      });
    }
  };

  return (
    <div className="builder-grid">
      {/* Question Blocks Sidebar */}
      <div className="card" style={{ padding: 18 }}>
        <div className="builder-col-title">Question blocks</div>
        <div className="block-list">
          {QUESTION_BANK.map((b) => (
            <Button
              key={b.type}
              variant="secondary"
              className="block-btn"
              style={{ display: "flex", width: "100%", justifyContent: "flex-start", gap: 10 }}
              onClick={() => addQuestion(b)}
            >
              <span>{b.icon}</span>
              <span>{b.label}</span>
              <span className="block-plus" style={{ marginLeft: "auto" }}>＋</span>
            </Button>
          ))}
        </div>

        <div className="builder-col-title" style={{ marginTop: 28 }}>Suggest questions with AI</div>
        <select 
          className="input" 
          style={{ width: "100%", marginBottom: 12, backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }} 
          value={goal} 
          onChange={(e) => { setGoal(e.target.value); setSuggestions([]); }}
        >
          {Object.keys(AI_SUGGESTIONS[cohortKey]).map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <Button variant="secondary" style={{ width: "100%" }} onClick={generateSuggestions}>
          ✨ Suggest questions
        </Button>

        {suggestions.length > 0 && (
          <div className="suggestion-list">
            {suggestions.map((s, i) => (
              <div 
                key={i} 
                className="suggestion-chip" 
                onClick={() => setQuestions((qs) => [...qs, { id: Date.now() + i, type: "text", label: s }])}
              >
                <span style={{ marginRight: 6 }}>＋</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Survey Canvas */}
      <div className="card canvas-col">
        <div style={{ marginBottom: 20 }}>
          <div className="builder-col-title">Survey Title</div>
          <input 
            className="input" 
            style={{ width: "100%", fontSize: 16, fontWeight: 700, backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            placeholder="Name your survey..." 
          />
        </div>
        <div className="builder-col-title" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Survey Canvas</span>
          <span>{questions.length} Question{questions.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="canvas-list">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              q={q}
              index={i}
              onRemove={() => removeQuestion(i)}
              onChange={(updatedQ) => updateQuestion(i, updatedQ)}
              onMoveUp={() => moveUp(i)}
              onMoveDown={() => moveDown(i)}
              isFirst={i === 0}
              isLast={i === questions.length - 1}
            />
          ))}
          {questions.length === 0 && (
            <div className="empty-canvas">
              Click a question block on the left sidebar to add questions to your survey.
            </div>
          )}
        </div>
      </div>

      {/* Survey Settings Sidebar */}
      <div className="card" style={{ padding: 18 }}>
        <div className="builder-col-title">Survey settings</div>
        
        <label className="setting-row" style={{ cursor: "pointer" }}>
          <span>Allow anonymous responses</span>
          <input 
            type="checkbox" 
            checked={anonymous} 
            onChange={(e) => setAnonymous(e.target.checked)} 
          />
        </label>

        <div className="setting-row">
          <span>Min group size to show results</span>
          <input
            type="number"
            className="input"
            style={{ width: 64, padding: "4px 8px", textAlign: "center", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
            value={minGroup}
            min={1}
            onChange={(e) => setMinGroup(Math.max(1, Number(e.target.value)))}
          />
        </div>
        <div className="setting-note">
          🔒 Results for groups smaller than {minGroup} will be aggregated/hidden to protect privacy.
        </div>

        <div className="builder-col-title" style={{ marginTop: 28 }}>Distribution Channels</div>
        <div className="channel-icons">
          <div className="channel-chip">💻 Web</div>
          <div className="channel-chip">📱 Mobile</div>
          <div className="channel-chip">💬 Slack/Teams</div>
        </div>

        <Button variant="primary" style={{ marginTop: 28, width: "100%" }} onClick={handleSave}>
          💾 Save & Publish Survey
        </Button>
      </div>
    </div>
  );
};

export default SurveyBuilder;
