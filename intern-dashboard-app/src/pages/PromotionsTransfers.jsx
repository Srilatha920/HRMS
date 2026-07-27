import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { interns } from "../data/internsData";
import {
  promotions as initialPromotions,
  transfers as initialTransfers,
} from "../data/lifecycleData";

const PromotionsTransfers = () => {
  const [activeTab, setActiveTab]       = useState("promotions");
  const [promotionsList, setPromotionsList] = useState(initialPromotions);
  const [transfersList, setTransfersList]   = useState(initialTransfers);
  const [showForm, setShowForm]         = useState(false);
  const [savedMsg, setSavedMsg]         = useState("");

  const [promForm, setPromForm] = useState({ internId: "", date: "", fromRole: "", toRole: "", note: "" });
  const [transForm, setTransForm] = useState({ internId: "", date: "", fromDept: "", toDept: "", reason: "" });

  const flash = (msg) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const handlePromotionSubmit = (e) => {
    e.preventDefault();
    const intern = interns.find((i) => i.id === Number(promForm.internId));
    setPromotionsList((prev) => [
      { id: Date.now(), ...promForm, internId: Number(promForm.internId), internName: intern?.name || "" },
      ...prev,
    ]);
    setPromForm({ internId: "", date: "", fromRole: "", toRole: "", note: "" });
    setShowForm(false);
    flash("Promotion recorded successfully!");
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const intern = interns.find((i) => i.id === Number(transForm.internId));
    setTransfersList((prev) => [
      { id: Date.now(), ...transForm, internId: Number(transForm.internId), internName: intern?.name || "" },
      ...prev,
    ]);
    setTransForm({ internId: "", date: "", fromDept: "", toDept: "", reason: "" });
    setShowForm(false);
    flash("Transfer recorded successfully!");
  };

  return (
    <Layout title="Promotions & Transfers">
      <div className="card">
        {/* Tab bar + action button */}
        <div className="lc-toolbar">
          <div className="lc-tabs">
            <button
              id="tab-promotions"
              className={`lc-tab-btn${activeTab === "promotions" ? " lc-tab-active" : ""}`}
              onClick={() => { setActiveTab("promotions"); setShowForm(false); }}
            >
              🚀 Promotions
              <span className="lc-tab-count">{promotionsList.length}</span>
            </button>
            <button
              id="tab-transfers"
              className={`lc-tab-btn${activeTab === "transfers" ? " lc-tab-active" : ""}`}
              onClick={() => { setActiveTab("transfers"); setShowForm(false); }}
            >
              🔁 Transfers
              <span className="lc-tab-count">{transfersList.length}</span>
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm((f) => !f)}>
            {showForm ? "Cancel" : `+ Log ${activeTab === "promotions" ? "Promotion" : "Transfer"}`}
          </button>
        </div>

        {savedMsg && <div className="alert-success" style={{ marginTop: 12 }}>{savedMsg}</div>}

        {/* Promotion Form */}
        {showForm && activeTab === "promotions" && (
          <form className="lc-form" onSubmit={handlePromotionSubmit}>
            <div className="lc-form-grid">
              <div className="form-group">
                <label>Employee</label>
                <select className="input" required value={promForm.internId}
                  onChange={(e) => setPromForm((p) => ({ ...p, internId: e.target.value }))}>
                  <option value="">Select employee…</option>
                  {interns.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="input" required value={promForm.date}
                  onChange={(e) => setPromForm((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>From Role</label>
                <input type="text" className="input" required placeholder="e.g. Intern – Front-End"
                  value={promForm.fromRole}
                  onChange={(e) => setPromForm((p) => ({ ...p, fromRole: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>To Role</label>
                <input type="text" className="input" required placeholder="e.g. Junior Developer"
                  value={promForm.toRole}
                  onChange={(e) => setPromForm((p) => ({ ...p, toRole: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label>Note</label>
              <textarea className="input" rows="3" placeholder="Reason or note for this promotion…"
                value={promForm.note}
                onChange={(e) => setPromForm((p) => ({ ...p, note: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary">Save Promotion</button>
          </form>
        )}

        {/* Transfer Form */}
        {showForm && activeTab === "transfers" && (
          <form className="lc-form" onSubmit={handleTransferSubmit}>
            <div className="lc-form-grid">
              <div className="form-group">
                <label>Employee</label>
                <select className="input" required value={transForm.internId}
                  onChange={(e) => setTransForm((p) => ({ ...p, internId: e.target.value }))}>
                  <option value="">Select employee…</option>
                  {interns.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="input" required value={transForm.date}
                  onChange={(e) => setTransForm((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>From Department</label>
                <input type="text" className="input" required placeholder="e.g. Front-End Team"
                  value={transForm.fromDept}
                  onChange={(e) => setTransForm((p) => ({ ...p, fromDept: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>To Department</label>
                <input type="text" className="input" required placeholder="e.g. Back-End Team"
                  value={transForm.toDept}
                  onChange={(e) => setTransForm((p) => ({ ...p, toDept: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label>Reason</label>
              <textarea className="input" rows="3" placeholder="Reason for the transfer…"
                value={transForm.reason}
                onChange={(e) => setTransForm((p) => ({ ...p, reason: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary">Save Transfer</button>
          </form>
        )}

        {/* Promotions Table */}
        {activeTab === "promotions" && (
          promotionsList.length === 0
            ? <p className="lc-empty-state">No promotions recorded yet. Log the first one above.</p>
            : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>From Role</th>
                    <th>→</th>
                    <th>To Role</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {promotionsList.map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.internName}</strong></td>
                      <td style={{ color: "#64748b", fontSize: 13 }}>{p.date}</td>
                      <td><span className="lc-role-from">{p.fromRole}</span></td>
                      <td style={{ color: "#94a3b8" }}>→</td>
                      <td><span className="lc-role-to">{p.toRole}</span></td>
                      <td style={{ color: "#64748b", fontSize: 13 }}>{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
        )}

        {/* Transfers Table */}
        {activeTab === "transfers" && (
          transfersList.length === 0
            ? <p className="lc-empty-state">No transfers recorded yet. Log the first one above.</p>
            : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>From Department</th>
                    <th>→</th>
                    <th>To Department</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {transfersList.map((t) => (
                    <tr key={t.id}>
                      <td><strong>{t.internName}</strong></td>
                      <td style={{ color: "#64748b", fontSize: 13 }}>{t.date}</td>
                      <td><span className="lc-role-from">{t.fromDept}</span></td>
                      <td style={{ color: "#94a3b8" }}>→</td>
                      <td><span className="lc-role-to">{t.toDept}</span></td>
                      <td style={{ color: "#64748b", fontSize: 13 }}>{t.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
        )}
      </div>
    </Layout>
  );
};

export default PromotionsTransfers;
