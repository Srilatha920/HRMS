import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import Layout      from "../components/layout/Layout";
import Button      from "../components/common/Button";
import { interns } from "../data/internsData";
import { attendanceRecords as initialRecords } from "../data/attendanceData";

// Months and Years constants for selectors
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const YEARS = ["2024", "2025", "2026"];

const STATUS_LEGEND = [
  { code: "P",   label: "Present - P",   color: "#10b981", class: "p" },
  { code: "A",   label: "Absent - A",    color: "#ef4444", class: "a" },
  { code: "HD",  label: "Half Day - HD",  color: "#f59e0b", class: "hd" },
  { code: "WFH", label: "Work From Home - WFH", color: "#06b6d4", class: "wfh" },
  { code: "L",   label: "On Leave - L",   color: "#8b5cf6", class: "l" },
  { code: "H",   label: "Holiday - H",   color: "#64748b", class: "h" },
  { code: "WO",  label: "Weekly Off - WO", color: "#64748b", class: "wo" }
];

const DEPARTMENTS = ["All Departments", "Front-End Developer", "Back-End Developer", "Full-Stack Developer"];

const Attendance = () => {
  const [records, setRecords] = useState(initialRecords);
  
  // Spreadsheet filter state
  const [selectedMonth, setSelectedMonth] = useState("Jul"); // Default to July
  const [selectedYear, setSelectedYear] = useState("2026");   // Default to 2026
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [summarizedView, setSummarizedView] = useState(false);
  const [showMarkForm, setShowMarkForm] = useState(false);
  
  // Mark Attendance Form state
  const [form, setForm] = useState({ internId: "", date: "2026-07-27", status: "Present", note: "" });
  const [savedMsg, setSavedMsg] = useState("");

  const monthIndex = MONTHS.indexOf(selectedMonth);
  const yearNum = Number(selectedYear);

  // Generate days of the month array dynamically
  const daysInMonth = useMemo(() => {
    const days = [];
    const daysCount = new Date(yearNum, monthIndex + 1, 0).getDate();
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    for (let d = 1; d <= daysCount; d++) {
      const date = new Date(yearNum, monthIndex, d);
      const dayName = weekdays[date.getDay()];
      days.push({
        dayNum: d,
        dayName,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        dateStr: `${selectedYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      });
    }
    return days;
  }, [monthIndex, yearNum, selectedMonth, selectedYear]);

  // Deterministic daily status generator for mock data consistency across months/years
  const getStatusForDay = (intern, day) => {
    // 1. Check if we have an active record marked in state
    const match = records.find(
      (r) => r.internId === intern.id && r.date === day.dateStr
    );
    if (match) {
      if (match.status === "Present") return "P";
      if (match.status === "Absent") return "A";
      if (match.status === "Late") return "HD";
      if (match.status === "WFH") return "WFH";
      return "P";
    }

    // 2. Weekend Weekly Off
    if (day.isWeekend) return "WO";

    // 3. Holidays
    const m = monthIndex;
    const d = day.dayNum;
    if ((m === 0 && d === 1) || (m === 7 && d === 15) || (m === 11 && d === 25)) {
      return "H";
    }

    // 4. Stable pseudorandom patterns based on intern ID and dates
    const hash = (intern.id * 17 + m * 31 + d * 7) % 100;
    if (hash < 6) return "A";      // 6% Absent
    if (hash < 12) return "L";     // 6% Leave
    if (hash < 20) return "HD";    // 8% Half Day
    if (hash < 32) return "WFH";   // 12% WFH
    return "P";                    // 68% Present
  };

  // Filtered interns list
  const filteredInterns = useMemo(() => {
    return interns.filter((intern) => {
      const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === "All Departments" || intern.role === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, selectedDept]);

  // Simple summary graph data computation
  const summaryGraphData = useMemo(() => {
    let present = 0;
    let absent = 0;
    let halfDay = 0;
    let wfh = 0;
    let leave = 0;

    daysInMonth.forEach((day) => {
      filteredInterns.forEach((intern) => {
        const status = getStatusForDay(intern, day);
        if (status === "P") present++;
        else if (status === "A") absent++;
        else if (status === "HD") halfDay++;
        else if (status === "WFH") wfh++;
        else if (status === "L") leave++;
      });
    });

    return [
      { category: "Present (P)", count: present, color: "#10b981" },
      { category: "Absent (A)", count: absent, color: "#ef4444" },
      { category: "Half Day (HD)", count: halfDay, color: "#f59e0b" },
      { category: "WFH", count: wfh, color: "#06b6d4" },
      { category: "Leave (L)", count: leave, color: "#8b5cf6" },
    ];
  }, [daysInMonth, filteredInterns, records, monthIndex, yearNum]);

  // Mark attendance submission handler
  const handleMarkSubmit = (e) => {
    e.preventDefault();
    const intern = interns.find((i) => i.id === Number(form.internId));
    if (!intern) return;

    setRecords((prev) => [
      {
        id: Date.now(),
        internId: Number(form.internId),
        internName: intern.name,
        date: form.date,
        status: form.status,
        note: form.note,
      },
      ...prev,
    ]);

    setForm({ internId: "", date: "2026-07-27", status: "Present", note: "" });
    setShowMarkForm(false);
    setSavedMsg("Attendance record saved successfully!");
    setTimeout(() => setSavedMsg(""), 3500);
  };

  return (
    <Layout title="Attendance Sheet">
      {/* Title Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>
            Monthly Attendance Sheet
          </h2>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Button variant="secondary" onClick={() => setShowMarkForm((prev) => !prev)}>
            ⚙️ Actions
          </Button>
          <Button variant="secondary" onClick={() => setRecords(initialRecords)}>
            🔄 Refresh
          </Button>
          <Button variant="primary" onClick={() => setShowMarkForm((prev) => !prev)}>
            ＋ Mark Attendance
          </Button>
        </div>
      </div>

      {/* Mark Attendance Overlay / Modal */}
      {showMarkForm && (
        <div className="modal-backdrop" onClick={() => setShowMarkForm(false)}>
          <form className="modal-panel" onClick={(e) => e.stopPropagation()} onSubmit={handleMarkSubmit}>
            <div className="modal-head">
              <h3 className="card-title" style={{ margin: 0 }}>Mark Employee Attendance</h3>
              <Button variant="ghost" style={{ padding: "4px 8px", border: "none" }} onClick={() => setShowMarkForm(false)}>
                ✕
              </Button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Employee / Intern</label>
                <select
                  className="input"
                  required
                  value={form.internId}
                  onChange={(e) => setForm((p) => ({ ...p, internId: e.target.value }))}
                >
                  <option value="">Select employee...</option>
                  {interns.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Date</label>
                <input
                  type="date"
                  className="input"
                  required
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Status</label>
                <select
                  className="input"
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Half Day / Late</option>
                  <option value="WFH">WFH</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Note (optional)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Medical leave, onsite project..."
                  value={form.note}
                  onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
              <Button variant="ghost" onClick={() => setShowMarkForm(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Record
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Success notification toast */}
      {savedMsg && (
        <div className="card" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--color-success)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: 12, marginBottom: 20 }}>
          {savedMsg}
        </div>
      )}

      {/* Spreadsheet Filter Toolbar */}
      <div className="card filter-bar" style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
        {/* Month Selector */}
        <select 
          className="input" 
          style={{ width: "100px", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {MONTHS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Year Selector */}
        <select 
          className="input" 
          style={{ width: "100px", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Employee Search */}
        <input
          type="text"
          className="input"
          style={{ width: "240px", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
          placeholder="Search Employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Department / Role Filter */}
        <select 
          className="input" 
          style={{ width: "200px", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* Group By Option */}
        <select 
          className="input" 
          style={{ width: "130px", backgroundColor: "var(--bg-input)", color: "var(--text-muted)" }}
          disabled
        >
          <option>Group By</option>
        </select>

        {/* Summarized View Checkbox */}
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)", cursor: "pointer", marginLeft: "auto" }}>
          <input
            type="checkbox"
            checked={summarizedView}
            onChange={(e) => setSummarizedView(e.target.checked)}
          />
          <span>Summarized View</span>
        </label>
      </div>

      {/* Simple & Easy-to-Understand Attendance Graph */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <h3 className="card-title" style={{ margin: 0, fontSize: 15 }}>
              Monthly Attendance Overview ({selectedMonth} {selectedYear})
            </h3>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
              Total status count breakdown across all working days
            </p>
          </div>
          <span className="badge badge-high" style={{ padding: "4px 10px" }}>
            📊 Clean Summary
          </span>
        </div>

        <div style={{ width: "100%", height: 190 }}>
          <ResponsiveContainer>
            <BarChart data={summaryGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="category" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "var(--border)", color: "#fff", borderRadius: 8, fontSize: 12 }}
                formatter={(value) => [`${value} Total Days`, "Count"]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={46}>
                {summaryGraphData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend Indicators Bar */}
      <div className="legend-bar">
        {STATUS_LEGEND.map((l) => (
          <div key={l.code} className="legend-item">
            <span className={`legend-color-dot legend-dot-${l.class}`} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Spreadsheet grid table */}
      <div className="sheet-table-wrap">
        <table className="sheet-table">
          <thead>
            <tr>
              <th className="cell-name" style={{ minWidth: 120 }}>Employee ID</th>
              <th className="cell-id" style={{ minWidth: 140 }}>Employee Name</th>
              <th style={{ minWidth: 90 }}>Shift</th>
              {daysInMonth.map((day) => (
                <th 
                  key={day.dayNum} 
                  style={{ 
                    minWidth: 50, 
                    color: day.isWeekend ? "var(--text-muted)" : "var(--text-secondary)" 
                  }}
                >
                  <div style={{ fontSize: 11 }}>{day.dayNum}</div>
                  <div style={{ fontSize: 9, opacity: 0.8 }}>{day.dayName}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredInterns.map((intern, index) => (
              <tr key={intern.id}>
                {/* Index + Employee ID code sticky column */}
                <td className="cell-name">
                  <strong>{index + 1}</strong> &nbsp;
                  <span style={{ fontSize: 12, opacity: 0.8 }}>
                    EMP/0019{intern.id}
                  </span>
                </td>
                {/* Employee name sticky column */}
                <td className="cell-id">
                  <strong>{intern.name}</strong>
                </td>
                {/* General Shift */}
                <td style={{ color: "var(--text-muted)", fontSize: 12 }}>General</td>
                
                {/* Daily Spreadsheet status cells */}
                {daysInMonth.map((day) => {
                  const status = getStatusForDay(intern, day);
                  let cellClass = "cell-marker-p";
                  if (status === "A") cellClass = "cell-marker-a";
                  if (status === "HD") cellClass = "cell-marker-hd";
                  if (status === "WFH") cellClass = "cell-marker-wfh";
                  if (status === "L") cellClass = "cell-marker-l";
                  if (status === "H") cellClass = "cell-marker-h";
                  if (status === "WO") cellClass = "cell-marker-wo";

                  return (
                    <td 
                      key={day.dayNum}
                      style={{ 
                        backgroundColor: day.isWeekend ? "rgba(255, 255, 255, 0.01)" : "transparent"
                      }}
                    >
                      <span className={`cell-marker ${cellClass}`}>
                        {status}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
            {filteredInterns.length === 0 && (
              <tr>
                <td colSpan={daysInMonth.length + 3} style={{ textAlign: "center", padding: 30, color: "var(--text-muted)" }}>
                  No employees match the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Spreadsheet Footer Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, fontSize: 12, color: "var(--text-muted)", flexWrap: "wrap", gap: 10 }}>
        <div>
          For comparison, use &gt;5, &lt;10 or =324. For ranges, use 5:10 (for values between 5 &amp; 10).
        </div>
        <div style={{ fontFamily: "monospace" }}>
          Execution Time: 0.014298 sec
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
