import React, { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer } from "recharts";
import Layout from "../components/layout/Layout";
import SkillBadge from "../components/common/SkillBadge";
import { interns, TECH_SKILLS } from "../data/internsData";
import { levelToScore } from "../utils/skillUtils";

// Colors for each selected intern's line on the radar chart
const LINE_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

const CompareInterns = () => {
  // selectedIds holds the IDs of interns chosen for comparison (max 4 for readability)
  const [selectedIds, setSelectedIds] = useState([interns[0].id, interns[1].id]);

  const toggleIntern = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id); // remove if already selected
      if (prev.length >= 4) return prev; // limit to 4 interns for a readable chart
      return [...prev, id];
    });
  };

  const selectedInterns = interns.filter((i) => selectedIds.includes(i.id));

  // Build radar chart data: one row per skill, one column per selected intern
  const radarData = TECH_SKILLS.map((skill) => {
    const row = { skill };
    selectedInterns.forEach((intern) => {
      row[intern.name] = levelToScore(intern.skills[skill]);
    });
    return row;
  });

  return (
    <Layout title="Compare Interns">
      <div className="card">
        <h3 className="card-title">Select Interns to Compare (up to 4)</h3>
        <div className="chip-group">
          {interns.map((intern) => (
            <button
              key={intern.id}
              onClick={() => toggleIntern(intern.id)}
              className={"chip" + (selectedIds.includes(intern.id) ? " chip-active" : "")}
            >
              {intern.name}
            </button>
          ))}
        </div>
      </div>

      {selectedInterns.length > 0 && (
        <>
          <div className="card chart-card">
            <h3 className="card-title">Skill Comparison Radar</h3>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 3]} tickCount={4} tickFormatter={(v) => ["", "Basic", "Inter", "High"][v]} />
                {selectedInterns.map((intern, index) => (
                  <Radar
                    key={intern.id}
                    name={intern.name}
                    dataKey={intern.name}
                    stroke={LINE_COLORS[index % LINE_COLORS.length]}
                    fill={LINE_COLORS[index % LINE_COLORS.length]}
                    fillOpacity={0.2}
                  />
                ))}
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="card-title">Side-by-Side Skill Table</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Skill</th>
                  {selectedInterns.map((intern) => (
                    <th key={intern.id}>{intern.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TECH_SKILLS.map((skill) => (
                  <tr key={skill}>
                    <td>{skill}</td>
                    {selectedInterns.map((intern) => (
                      <td key={intern.id}><SkillBadge level={intern.skills[skill]} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
};

export default CompareInterns;
