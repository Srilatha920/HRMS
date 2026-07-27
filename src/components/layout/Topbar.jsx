import React from "react";

// Simple top bar. `title` changes per page (passed down from Layout).
const Topbar = ({ title }) => {
  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-right">
        <span className="topbar-role">HR Admin</span>
        <div className="topbar-avatar">HR</div>
      </div>
    </header>
  );
};

export default Topbar;
