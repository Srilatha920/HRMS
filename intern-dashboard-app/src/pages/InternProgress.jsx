import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import Layout from "../components/layout/Layout";
import SkillBadge from "../components/common/SkillBadge";
import AIInsightPanel from "../components/common/AIInsightPanel";
import { interns, TECH_SKILLS } from "../data/internsData";
import { levelToScore } from "../utils/skillUtils";

// Engagement bar subcomponent
const EngagementBar = ({ score }) => {
  const cls = score >= 70 ? "high" : score >= 50 ? "mid" : "low";
  return (
    <div className="engagement-bar-wrap">
      <div className="engagement-bar">
        <div
          className={`engagement-fill engagement-fill-${cls}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", minWidth: 40 }}>
        {score}/100
      </span>
    </div>
  );
};

const InternProgress = () => {
  const { id } = useParams();
  const intern = interns.find((i) => i.id === Number(id));

  if (!intern) {
    return (
      <Layout title="Intern Progress">
        <p style={{ color: "var(--text-secondary)" }}>
          Intern not found. <Link to="/interns" style={{ color: "var(--color-primary)" }}>Go back to Interns list</Link>
        </p>
      </Layout>
    );
  }

  // Bar chart data: previous vs current skill scores
  const barData = TECH_SKILLS.map((skill) => ({
    skill,
    Previous: levelToScore(intern.previousSkills[skill]),
    Current: levelToScore(intern.skills[skill]),
  }));

  // Radar chart data: current skill scores (1–3 scale → %)
  const radarData = TECH_SKILLS.map((skill) => ({
    skill,
    score: levelToScore(intern.skills[skill]),
    fullMark: 3,
  }));

  const trajectoryColor = {
    improving: "var(--color-success)",
    stable: "var(--color-warning)",
    declining: "var(--color-danger)",
  }[intern.trajectory] ?? "var(--text-muted)";

  return (
    <Layout title={`Progress: ${intern.name}`}>
      {/* Profile header card */}
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
        <div className="intern-avatar" style={{ width: 56, height: 56, fontSize: 18 }}>
          {intern.avatar || intern.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>{intern.name}</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
            {intern.role} · Joined {intern.joinDate}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
            Trajectory
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: trajectoryColor, textTransform: "capitalize" }}>
            {intern.trajectory === "improving" ? "↑" : intern.trajectory === "declining" ? "↓" : "→"} {intern.trajectory}
          </span>
        </div>
      </div>

      {/* AI Insight Panel — the agent layer */}
      <AIInsightPanel intern={intern} />

      {/* Engagement & wellbeing */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">Engagement & Wellbeing</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
              Engagement Score
            </div>
            <EngagementBar score={intern.engagementScore} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
              Wellbeing Status
            </div>
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: intern.wellbeingFlag ? "var(--color-danger)" : "var(--color-success)",
            }}>
              {intern.wellbeingFlag ? "⚠️ Needs Check-In" : "✓ All Good"}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
              Recognitions
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "var(--color-warning)" }}>
              🏆 {intern.recognitionCount}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
              Last Check-In
            </div>
            <span style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 600 }}>{intern.lastCheckIn}</span>
          </div>
        </div>
      </div>

      {/* Charts row: Radar + Bar */}
      <div className="charts-grid">
        {/* Radar / Skills Graph */}
        <div className="card chart-card">
          <div className="card-title">Skills Radar</div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={100}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 3]}
                ticks={[1, 2, 3]}
                tickFormatter={(v) => ["", "Basic", "Inter.", "High"][v]}
                tick={{ fill: "#64748b", fontSize: 10 }}
              />
              <Radar
                name="Current"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip
                formatter={(v) => [["", "Basic", "Intermediate", "High"][v], "Level"]}
                contentStyle={{ background: "#0e1629", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 13 }}
                labelStyle={{ color: "#f1f5f9" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress bar chart: previous vs current */}
        <div className="card chart-card">
          <div className="card-title">Progress — Previous vs Current</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 3]}
                ticks={[1, 2, 3]}
                tickFormatter={(v) => ["", "Basic", "Inter.", "High"][v]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <Tooltip
                formatter={(v) => [["", "Basic", "Intermediate", "High"][v]]}
                contentStyle={{ background: "#0e1629", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 13 }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 13 }} />
              <Bar dataKey="Previous" fill="#334155" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Current" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill table */}
      <div className="card">
        <div className="card-title">Skill Breakdown</div>
        <table className="table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Previous Level</th>
              <th>Current Level</th>
              <th>Delta</th>
            </tr>
          </thead>
          <tbody>
            {TECH_SKILLS.map((skill) => {
              const prev = levelToScore(intern.previousSkills[skill]);
              const curr = levelToScore(intern.skills[skill]);
              const delta = curr - prev;
              return (
                <tr key={skill}>
                  <td><strong>{skill}</strong></td>
                  <td><SkillBadge level={intern.previousSkills[skill]} /></td>
                  <td><SkillBadge level={intern.skills[skill]} /></td>
                  <td style={{
                    fontWeight: 700,
                    color: delta > 0 ? "var(--color-success)" : delta < 0 ? "var(--color-danger)" : "var(--text-muted)",
                  }}>
                    {delta > 0 ? `↑ +${delta}` : delta < 0 ? `↓ ${delta}` : "— No change"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* HR Comments */}
      {intern.hrComments && (
        <div className="card">
          <div className="card-title">HR Notes</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            "{intern.hrComments}"
          </p>
        </div>
      )}
    </Layout>
  );
};

export default InternProgress;
