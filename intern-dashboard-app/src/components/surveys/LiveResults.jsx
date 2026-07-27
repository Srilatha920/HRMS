import React, { useState } from "react";
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";

const SURVEYS_LIST = {
  employees: [
    { id: "s1", title: "Bi-Weekly Pulse Check", responses: 214, targeted: 260, avgScore: 3.9,
      trend: [
        { label: "Feb", score: 3.6 },
        { label: "Mar", score: 3.7 },
        { label: "Apr", score: 3.5 },
        { label: "May", score: 3.8 },
        { label: "Jun", score: 3.9 },
        { label: "Jul", score: 4.0 }
      ]
    },
    { id: "s2", title: "90-Day New Hire Check-in", responses: 18, targeted: 22, avgScore: 4.3,
      trend: [
        { label: "W1", score: 4.0 },
        { label: "W2", score: 4.1 },
        { label: "W3", score: 4.2 },
        { label: "W4", score: 4.3 }
      ]
    },
  ],
  interns: [
    { id: "s3", title: "First Week Welcome Survey", responses: 8, targeted: 9, avgScore: 4.5,
      trend: [
        { label: "Day 1", score: 4.2 },
        { label: "Day 2", score: 4.3 },
        { label: "Day 3", score: 4.5 }
      ]
    },
    { id: "s4", title: "Mid-Term Experience Survey", responses: 18, targeted: 22, avgScore: 4.1,
      trend: [
        { label: "W1", score: 3.9 },
        { label: "W2", score: 4.0 },
        { label: "W3", score: 4.1 }
      ]
    },
  ]
};

const SUBGROUP_DATA = {
  employees: [
    { name: "Engineering", responses: 88, size: 96 },
    { name: "Sales", responses: 41, size: 52 },
    { name: "Customer Success", responses: 37, size: 40 },
    { name: "Design", responses: 4, size: 4 }, // < 5: hidden
    { name: "Finance", responses: 3, size: 5 }, // < 5: hidden
  ],
  interns: [
    { name: "Batch A (React Frontend)", responses: 8, size: 8 },
    { name: "Batch B (Node Backend)", responses: 6, size: 8 },
    { name: "Batch C (UI/UX Design)", responses: 3, size: 5 }, // < 5: hidden
    { name: "Batch D (Python AI/ML)", responses: 1, size: 2 }, // < 5: hidden
  ]
};

const LiveResults = ({ targetGroup = "employees" }) => {
  const cohortKey = targetGroup === "employees" ? "employees" : "interns";
  const list = SURVEYS_LIST[cohortKey];

  const [selectedSurveyId, setSelectedSurveyId] = useState(list[0]?.id || "");
  
  // Sync selected survey when targetGroup changes
  React.useEffect(() => {
    if (list.length > 0) {
      setSelectedSurveyId(list[0].id);
    }
  }, [targetGroup, list]);

  const survey = list.find((s) => s.id === selectedSurveyId) || list[0];
  if (!survey) return null;

  const responseRate = Math.round((survey.responses / survey.targeted) * 100);
  const subgroups = SUBGROUP_DATA[cohortKey];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Selector */}
      <div className="results-select-row">
        <select
          className="input"
          style={{ width: "320px", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
          value={selectedSurveyId}
          onChange={(e) => setSelectedSurveyId(e.target.value)}
        >
          {list.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <span className="badge badge-high" style={{ padding: "6px 12px" }}>
          Active
        </span>
      </div>

      {/* Analytical Cards */}
      <div className="summary-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 0 }}>
        <div className="summary-card summary-card-blue">
          <div className="summary-card-icon">👥</div>
          <div>
            <p className="summary-card-value">{survey.responses}</p>
            <p className="summary-card-label">Total Responses (of {survey.targeted})</p>
          </div>
        </div>

        <div className="summary-card summary-card-purple">
          <div className="summary-card-icon">📈</div>
          <div>
            <p className="summary-card-value">{responseRate}%</p>
            <p className="summary-card-label">Response Rate</p>
          </div>
        </div>

        <div className="summary-card summary-card-green">
          <div className="summary-card-icon">⭐</div>
          <div>
            <p className="summary-card-value">{survey.avgScore} / 5</p>
            <p className="summary-card-label">Average Score</p>
          </div>
        </div>

        <div className="summary-card summary-card-blueLight">
          <div className="summary-card-icon">✅</div>
          <div>
            <p className="summary-card-value">{responseRate}%</p>
            <p className="summary-card-label">Completion Status</p>
          </div>
        </div>
      </div>

      {/* Charts Panel */}
      <div className="charts-grid">
        {/* Trend Area Chart */}
        <div className="card chart-card">
          <div className="card-title">Score Trend Over Time</div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={survey.trend}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[1, 5]} 
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "var(--border)", color: "#fff" }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#scoreGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subgroups Progress Breakdown */}
        <div className="card">
          <div className="card-title">
            Completion by {targetGroup === "employees" ? "Department" : "Batch Group"}
          </div>
          <div className="dept-list">
            {subgroups.map((sub, i) => {
              const isHidden = sub.responses < 5;
              const pct = Math.round((sub.responses / sub.size) * 100);
              
              return (
                <div key={i} className="dept-row">
                  <div className="dept-name">{sub.name}</div>
                  {isHidden ? (
                    <div className="dept-hidden">
                      🔒 Hidden — below minimum anonymity threshold (5 responses)
                    </div>
                  ) : (
                    <>
                      <div className="progress-track">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${pct}%`, 
                            background: pct > 80 ? "var(--color-success)" : "var(--color-primary)" 
                          }} 
                        />
                      </div>
                      <div className="dept-pct">{pct}%</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveResults;
