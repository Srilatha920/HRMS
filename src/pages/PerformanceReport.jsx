import React from "react";
import { useParams, Link } from "react-router-dom";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import Layout from "../components/layout/Layout";
import SkillBadge from "../components/common/SkillBadge";
import { interns, TECH_SKILLS } from "../data/internsData";
import { levelToScore, getOverallPerformanceLabel, getRecommendations, getStrengths } from "../utils/skillUtils";

const PerformanceReport = () => {
  const { id } = useParams();
  const intern = interns.find((i) => i.id === Number(id));

  if (!intern) {
    return (
      <Layout title="Performance Report">
        <p>Intern not found. <Link to="/interns">Go back to Interns list</Link></p>
      </Layout>
    );
  }

  const overall = getOverallPerformanceLabel(intern);
  const strengths = getStrengths(intern);
  const recommendations = getRecommendations(intern);

  // Radar chart data includes both technical and soft skills
  const radarData = [
    ...TECH_SKILLS.map((skill) => ({ skill, score: levelToScore(intern.skills[skill]) })),
    { skill: "Communication", score: levelToScore(intern.softSkills.communication) },
    { skill: "Problem-Solving", score: levelToScore(intern.softSkills.problemSolving) },
  ];

  // Printing simply calls the browser's native print dialog.
  // The `no-print` CSS class (in dashboard.css) hides the sidebar/topbar/buttons when printing.
  const handlePrint = () => window.print();

  return (
    <Layout title="Performance Report">
      <div className="card report-container">
        <div className="report-header">
          <div>
            <h2>{intern.name}</h2>
            <p className="report-subtitle">{intern.role} &bull; Joined {intern.joinDate}</p>
          </div>
          <button className="btn btn-primary no-print" onClick={handlePrint}>🖨️ Print Report</button>
        </div>

        <div className="report-grid">
          {/* ---- Technical Skills ---- */}
          <div>
            <h3 className="card-title">Technical Skills</h3>
            <table className="table">
              <tbody>
                {TECH_SKILLS.map((skill) => (
                  <tr key={skill}>
                    <td>{skill}</td>
                    <td><SkillBadge level={intern.skills[skill]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="card-title" style={{ marginTop: "20px" }}>Soft Skills</h3>
            <table className="table">
              <tbody>
                <tr>
                  <td>Communication</td>
                  <td><SkillBadge level={intern.softSkills.communication} /></td>
                </tr>
                <tr>
                  <td>Problem-Solving</td>
                  <td><SkillBadge level={intern.softSkills.problemSolving} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ---- Skill Web (Radar) Graph ---- */}
          <div>
            <h3 className="card-title">Skill Web Graph</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 3]} tickCount={4} />
                <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---- Strengths & Improvements ---- */}
        <div className="report-grid" style={{ marginTop: "20px" }}>
          <div>
            <h3 className="card-title">Strengths</h3>
            {strengths.length > 0 ? (
              <ul>
                {strengths.map((s) => <li key={s}>{s}</li>)}
              </ul>
            ) : (
              <p>No skills at High level yet.</p>
            )}
          </div>

          <div>
            <h3 className="card-title">Areas for Improvement & Recommendations</h3>
            {recommendations.length > 0 ? (
              <ul className="recommendation-list">
                {recommendations.map((r) => (
                  <li key={r.skill}>
                    <strong>{r.skill} - {r.level} Level:</strong> {r.recommendation}
                  </li>
                ))}
              </ul>
            ) : (
              <p>All skills are at High level. Great performance!</p>
            )}
          </div>
        </div>

        {/* ---- HR Comments & Overall ---- */}
        <div style={{ marginTop: "20px" }}>
          <h3 className="card-title">HR Comments</h3>
          <p>{intern.hrComments}</p>

          <h3 className="card-title" style={{ marginTop: "16px" }}>Overall Performance</h3>
          <SkillBadge level={overall} />
        </div>
      </div>
    </Layout>
  );
};

export default PerformanceReport;
