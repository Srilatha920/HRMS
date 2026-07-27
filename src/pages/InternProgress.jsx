import React from "react";
import { useParams, Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import Layout from "../components/layout/Layout";
import SkillBadge from "../components/common/SkillBadge";
import { interns, TECH_SKILLS } from "../data/internsData";
import { levelToScore } from "../utils/skillUtils";

const InternProgress = () => {
  // `id` comes from the URL, e.g. /progress/1
  const { id } = useParams();
  const intern = interns.find((i) => i.id === Number(id));

  if (!intern) {
    return (
      <Layout title="Intern Progress">
        <p>Intern not found. <Link to="/interns">Go back to Interns list</Link></p>
      </Layout>
    );
  }

  // Build chart data: previous score vs current score for each skill
  const chartData = TECH_SKILLS.map((skill) => ({
    skill,
    Previous: levelToScore(intern.previousSkills[skill]),
    Current: levelToScore(intern.skills[skill]),
  }));

  return (
    <Layout title={`Progress: ${intern.name}`}>
      <div className="card">
        <h3 className="card-title">Skill Progress Table</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Previous Level</th>
              <th>Current Level</th>
            </tr>
          </thead>
          <tbody>
            {TECH_SKILLS.map((skill) => (
              <tr key={skill}>
                <td>{skill}</td>
                <td><SkillBadge level={intern.previousSkills[skill]} /></td>
                <td><SkillBadge level={intern.skills[skill]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card chart-card">
        <h3 className="card-title">Progress Chart (Previous vs Current)</h3>
        {/* Scores: Basic = 1, Intermediate = 2, High = 3 */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="skill" />
            <YAxis domain={[0, 3]} ticks={[1, 2, 3]} tickFormatter={(v) => ["", "Basic", "Intermediate", "High"][v]} />
            <Tooltip formatter={(value) => ["", "Basic", "Intermediate", "High"][value]} />
            <Legend />
            <Bar dataKey="Previous" fill="#94a3b8" />
            <Bar dataKey="Current" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
};

export default InternProgress;
