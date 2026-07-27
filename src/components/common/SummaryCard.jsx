import React from "react";

// A single reusable card used for the top stats row on the Dashboard.
// Props:
//  - label: small text above the number (e.g. "Total Interns")
//  - value: the big number
//  - icon: emoji/icon shown on the left
//  - color: css class suffix used to tint the card (e.g. "blue", "green")
const SummaryCard = ({ label, value, icon, color = "blue" }) => {
  return (
    <div className={`summary-card summary-card-${color}`}>
      <div className="summary-card-icon">{icon}</div>
      <div>
        <p className="summary-card-value">{value}</p>
        <p className="summary-card-label">{label}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
