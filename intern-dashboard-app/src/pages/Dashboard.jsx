import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import Layout from "../components/layout/Layout";
import SummaryCard from "../components/common/SummaryCard";
import { interns, TECH_SKILLS } from "../data/internsData";
import { getOverallPerformanceLabel } from "../utils/skillUtils";

// Colors used consistently across all charts for each skill level
const LEVEL_COLORS = { Basic: "#f59e0b", Intermediate: "#3b82f6", High: "#10b981" };

const Dashboard = () => {
  // ---- Calculate summary numbers from the dummy data ----
  const totalInterns = interns.length;
  const frontEndCount = interns.filter((i) => i.role === "Front-End Developer").length;

  // Count how many interns have each OVERALL performance level
  const overallCounts = { Basic: 0, Intermediate: 0, High: 0 };
  interns.forEach((intern) => {
    overallCounts[getOverallPerformanceLabel(intern)] += 1;
  });

  // Data for the Pie Chart (overall performance distribution)
  const pieData = [
    { name: "Basic", value: overallCounts.Basic },
    { name: "Intermediate", value: overallCounts.Intermediate },
    { name: "High", value: overallCounts.High },
  ];

  // Data for the Bar Chart: for each tech skill, how many interns are
  // Basic / Intermediate / High in that skill.
  const barData = TECH_SKILLS.map((skill) => {
    const row = { skill, Basic: 0, Intermediate: 0, High: 0 };
    interns.forEach((intern) => {
      row[intern.skills[skill]] += 1;
    });
    return row;
  });

  return (
    <Layout title="HR Dashboard">
      {/* ---- Row of summary cards ---- */}
      <div className="summary-grid">
        <SummaryCard label="Total Interns" value={totalInterns} icon="👥" color="blue" />
        <SummaryCard label="Front-End Developers" value={frontEndCount} icon="💻" color="purple" />
        <SummaryCard label="Basic-Level Interns" value={overallCounts.Basic} icon="🌱" color="orange" />
        <SummaryCard label="Intermediate-Level Interns" value={overallCounts.Intermediate} icon="📈" color="blueLight" />
        <SummaryCard label="High-Level Interns" value={overallCounts.High} icon="🏆" color="green" />
      </div>

      {/* ---- Charts row ---- */}
      <div className="charts-grid">
        <div className="card chart-card">
          <h3 className="card-title">Overall Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={LEVEL_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h3 className="card-title">Skill Level Breakdown by Technology</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Basic" stackId="a" fill={LEVEL_COLORS.Basic} />
              <Bar dataKey="Intermediate" stackId="a" fill={LEVEL_COLORS.Intermediate} />
              <Bar dataKey="High" stackId="a" fill={LEVEL_COLORS.High} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
