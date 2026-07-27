import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import Layout      from "../components/layout/Layout";
import SummaryCard from "../components/common/SummaryCard";
import { interns }           from "../data/internsData";
import { attendanceRecords as initialRecords } from "../data/attendanceData";

// ── Constants ────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = ["Present", "Absent", "Late", "WFH"];

const STATUS_META = {
  Present: { color: "#10b981", icon: "✅" },
  Absent:  { color: "#ef4444", icon: "❌" },
  Late:    { color: "#f59e0b", icon: "⏰" },
  WFH:     { color: "#818cf8", icon: "🏠" },
};

const today = new Date().toISOString().split("T")[0];

// Custom tooltip for the Recharts bar chart
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "10px 14px", fontSize: 12,
    }}>
      <div style={{ color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: p.fill, display: "inline-block" }} />
          <span style={{ color: "#f1f5f9" }}>{p.name}: <strong>{p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
const Attendance = () => {
  const [records,       setRecords]       = useState(initialRecords);
  const [filterIntern,  setFilterIntern]  = useState("");
  const [filterStatus,  setFilterStatus]  = useState("");
  const [showForm,      setShowForm]      = useState(false);
  const [savedMsg,      setSavedMsg]      = useState("");
  const [form, setForm] = useState({ internId: "", date: today, status: "Present", note: "" });

  // ── Today's summary ──────────────────────────────────────────────────────
  const todayRecs      = records.filter((r) => r.date === today);
  const presentToday   = todayRecs.filter((r) => r.status === "Present").length;
  const absentToday    = todayRecs.filter((r) => r.status === "Absent").length;
  const lateToday      = todayRecs.filter((r) => r.status === "Late").length;
  const wfhToday       = todayRecs.filter((r) => r.status === "WFH").length;

  // Overall attendance rate (Present + Late + WFH counts as "attended")
  const attendedTotal  = records.filter((r) => r.status !== "Absent").length;
  const overallPct     = records.length > 0 ? Math.round((attendedTotal / records.length) * 100) : 0;

  // ── Per-intern stats for the overview table ──────────────────────────────
  const internStats = interns.map((intern) => {
    const recs    = records.filter((r) => r.internId === intern.id);
    const cnt     = (s) => recs.filter((r) => r.status === s).length;
    const present = cnt("Present"), absent = cnt("Absent"),
          late    = cnt("Late"),    wfh    = cnt("WFH");
    const total   = recs.length;
    const pct     = total > 0 ? Math.round(((present + late + wfh) / total) * 100) : 0;
    const barColor = pct >= 85 ? "#10b981" : pct >= 65 ? "#f59e0b" : "#ef4444";
    const todayStatus = todayRecs.find((r) => r.internId === intern.id)?.status ?? "Not Marked";
    return { ...intern, present, absent, late, wfh, total, pct, barColor, todayStatus };
  });

  // ── Weekly chart data ────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const weeks = {};
    records.forEach((r) => {
      const d   = new Date(r.date + "T00:00:00");
      const dow = d.getDay(); // 0=Sun
      const diff = dow === 0 ? -6 : 1 - dow;           // shift to Monday
      const mon  = new Date(d);
      mon.setDate(d.getDate() + diff);
      const key  = mon.toISOString().split("T")[0];
      const label = `${mon.toLocaleString("default", { month: "short" })} ${mon.getDate()}`;
      if (!weeks[key]) weeks[key] = { week: label, Present: 0, Absent: 0, Late: 0, WFH: 0 };
      weeks[key][r.status] += 1;
    });
    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [records]);

  // ── Filtered record log ──────────────────────────────────────────────────
  const filtered = [...records]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((r) => {
      const matchIntern = !filterIntern || r.internId === Number(filterIntern);
      const matchStatus = !filterStatus || r.status === filterStatus;
      return matchIntern && matchStatus;
    });

  // ── Mark attendance handler ──────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const intern = interns.find((i) => i.id === Number(form.internId));
    setRecords((prev) => [
      {
        id:         Date.now(),
        internId:   Number(form.internId),
        internName: intern?.name ?? "",
        date:       form.date,
        status:     form.status,
        note:       form.note,
      },
      ...prev,
    ]);
    setForm({ internId: "", date: today, status: "Present", note: "" });
    setShowForm(false);
    setSavedMsg("Attendance marked successfully!");
    setTimeout(() => setSavedMsg(""), 3500);
  };

  // ── Badge class helper ───────────────────────────────────────────────────
  const badgeClass = (s) =>
    `att-badge att-badge-${s.toLowerCase().replace(/\s+/g, "-")}`;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Layout title="Attendance Tracker">

      {/* ── Summary cards ────────────────────────────────────────────── */}
      <div className="summary-grid">
        <SummaryCard label="Present Today"        value={presentToday} icon="✅" color="green"     />
        <SummaryCard label="Absent Today"         value={absentToday}  icon="❌" color="orange"    />
        <SummaryCard label="Late Today"           value={lateToday}    icon="⏰" color="blueLight" />
        <SummaryCard label="WFH Today"            value={wfhToday}     icon="🏠" color="purple"    />
        <SummaryCard label="Overall Attendance"   value={`${overallPct}%`} icon="📊" color="blue" />
      </div>

      {/* ── Intern overview table ─────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h3 className="card-title" style={{ margin: 0 }}>Intern Attendance Overview — July 2026</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(STATUS_META).map(([s, m]) => (
              <span key={s} className="att-stat-chip">
                <span className="att-stat-dot" style={{ background: m.color }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Intern</th>
              <th>Role</th>
              <th>Attendance %</th>
              <th style={{ color: STATUS_META.Present.color }}>✅ Present</th>
              <th style={{ color: STATUS_META.Absent.color  }}>❌ Absent</th>
              <th style={{ color: STATUS_META.Late.color    }}>⏰ Late</th>
              <th style={{ color: STATUS_META.WFH.color     }}>🏠 WFH</th>
              <th>Today</th>
            </tr>
          </thead>
          <tbody>
            {internStats.map((s) => (
              <tr key={s.id}>
                {/* Name + avatar */}
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="att-avatar">{s.avatar}</div>
                    <strong>{s.name}</strong>
                  </div>
                </td>
                <td style={{ color: "#64748b", fontSize: 13 }}>{s.role}</td>

                {/* Progress bar */}
                <td>
                  <div className="lc-progress-wrap">
                    <div className="lc-progress-track">
                      <div
                        className="lc-progress-fill"
                        style={{ width: `${s.pct}%`, background: s.barColor }}
                      />
                    </div>
                    <span className="lc-progress-label">{s.pct}%</span>
                  </div>
                </td>

                <td style={{ color: STATUS_META.Present.color, fontWeight: 600 }}>{s.present}</td>
                <td style={{ color: STATUS_META.Absent.color,  fontWeight: 600 }}>{s.absent}</td>
                <td style={{ color: STATUS_META.Late.color,    fontWeight: 600 }}>{s.late}</td>
                <td style={{ color: STATUS_META.WFH.color,     fontWeight: 600 }}>{s.wfh}</td>

                {/* Today's status badge */}
                <td>
                  <span className={badgeClass(s.todayStatus)}>{s.todayStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Weekly breakdown chart ────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="card-title">Weekly Attendance Breakdown</h3>
        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 10 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="Present" stackId="a" fill={STATUS_META.Present.color} />
            <Bar dataKey="Late"    stackId="a" fill={STATUS_META.Late.color} />
            <Bar dataKey="WFH"     stackId="a" fill={STATUS_META.WFH.color} />
            <Bar dataKey="Absent"  stackId="a" fill={STATUS_META.Absent.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Record log with filter + mark attendance ──────────────────── */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 16 }}>Attendance Log</h3>

        {/* Toolbar */}
        <div className="lc-toolbar" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="filter-bar">
            <select
              id="att-filter-intern"
              className="input"
              value={filterIntern}
              onChange={(e) => setFilterIntern(e.target.value)}
            >
              <option value="">All Interns</option>
              {interns.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>

            <select
              id="att-filter-status"
              className="input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <span style={{ fontSize: 13, color: "#94a3b8", alignSelf: "center" }}>
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <button
            id="btn-mark-attendance"
            className="btn btn-primary"
            onClick={() => setShowForm((f) => !f)}
          >
            {showForm ? "Cancel" : "+ Mark Attendance"}
          </button>
        </div>

        {/* Success toast */}
        {savedMsg && (
          <div className="alert-success" style={{ marginTop: 12 }}>{savedMsg}</div>
        )}

        {/* Mark attendance form */}
        {showForm && (
          <form className="lc-form" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <div className="lc-form-grid">
              <div className="form-group">
                <label>Intern</label>
                <select
                  id="att-form-intern"
                  className="input"
                  required
                  value={form.internId}
                  onChange={(e) => setForm((p) => ({ ...p, internId: e.target.value }))}
                >
                  <option value="">Select intern…</option>
                  {interns.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  id="att-form-date"
                  type="date"
                  className="input"
                  required
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  id="att-form-status"
                  className="input"
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Note <span style={{ color: "#64748b", fontWeight: 400 }}>(optional)</span></label>
              <input
                id="att-form-note"
                type="text"
                className="input"
                placeholder="e.g. Medical appointment, traveling…"
                value={form.note}
                onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              />
            </div>

            <button type="submit" className="btn btn-primary">Save Attendance</button>
          </form>
        )}

        {/* Record table */}
        {filtered.length === 0 ? (
          <p className="lc-empty-state">No attendance records match the current filters.</p>
        ) : (
          <table className="table" style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>Intern</th>
                <th>Date</th>
                <th>Status</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 60).map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="att-avatar" style={{ width: 26, height: 26, fontSize: 9 }}>
                        {interns.find((i) => i.id === r.internId)?.avatar ?? "??"}
                      </div>
                      <strong>{r.internName}</strong>
                    </div>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>{r.date}</td>
                  <td>
                    <span className={badgeClass(r.status)}>
                      {STATUS_META[r.status]?.icon} {r.status}
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>{r.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default Attendance;
