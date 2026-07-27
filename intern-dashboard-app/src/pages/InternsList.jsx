import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SkillBadge from "../components/common/SkillBadge";
import { interns, SKILL_LEVELS } from "../data/internsData";
import { getOverallPerformanceLabel } from "../utils/skillUtils";

const InternsList = () => {
  // ---- State for search, filters and sorting ----
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [performanceFilter, setPerformanceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // filteredInterns is recalculated whenever any filter/search/sort changes.
  const [filteredInterns, setFilteredInterns] = useState(interns);

  useEffect(() => {
    let result = [...interns];

    // 1) Search by name (case-insensitive)
    if (searchTerm.trim() !== "") {
      result = result.filter((intern) => intern.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // 2) Filter by skill level - true if ANY of the intern's tech skills match the chosen level
    if (skillFilter !== "All") {
      result = result.filter((intern) => Object.values(intern.skills).includes(skillFilter));
    }

    // 3) Filter by overall performance level
    if (performanceFilter !== "All") {
      result = result.filter((intern) => getOverallPerformanceLabel(intern) === performanceFilter);
    }

    // 4) Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "performance") {
      // High -> Intermediate -> Basic
      const order = { High: 3, Intermediate: 2, Basic: 1 };
      result.sort((a, b) => order[getOverallPerformanceLabel(b)] - order[getOverallPerformanceLabel(a)]);
    }

    setFilteredInterns(result);
  }, [searchTerm, skillFilter, performanceFilter, sortBy]);

  return (
    <Layout title="Interns">
      {/* ---- Search & Filter Bar ---- */}
      <div className="card filter-bar">
        <input
          type="text"
          className="input"
          placeholder="Search interns by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select className="input" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
          <option value="All">All Skill Levels</option>
          {SKILL_LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>

        <select className="input" value={performanceFilter} onChange={(e) => setPerformanceFilter(e.target.value)}>
          <option value="All">All Performance</option>
          {SKILL_LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>

        <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort: Name (A-Z)</option>
          <option value="performance">Sort: Performance (High-Low)</option>
        </select>
      </div>

      {/* ---- Interns Table ---- */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>HTML</th>
              <th>CSS</th>
              <th>JavaScript</th>
              <th>React</th>
              <th>Overall</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterns.map((intern) => (
              <tr key={intern.id}>
                <td>{intern.name}</td>
                <td>{intern.role}</td>
                <td><SkillBadge level={intern.skills.HTML} /></td>
                <td><SkillBadge level={intern.skills.CSS} /></td>
                <td><SkillBadge level={intern.skills.JavaScript} /></td>
                <td><SkillBadge level={intern.skills.React} /></td>
                <td><SkillBadge level={getOverallPerformanceLabel(intern)} /></td>
                <td className="table-actions">
                  <Link to={`/progress/${intern.id}`}>Progress</Link>
                  <Link to={`/report/${intern.id}`}>Report</Link>
                </td>
              </tr>
            ))}
            {filteredInterns.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  No interns match your search/filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default InternsList;
