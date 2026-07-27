import React from "react";
import { NavLink } from "react-router-dom";

// Sidebar navigation. NavLink automatically adds an "active" class
// to whichever link matches the current URL - great for highlighting
// the current page.
const Sidebar = () => {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/interns", label: "Interns", icon: "👥" },
    { to: "/compare", label: "Compare Interns", icon: "⚖️" },
    { to: "/assessment", label: "New Assessment", icon: "📝" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🎯</span>
        <span className="sidebar-logo-text">Intern Skill Tracker</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => "sidebar-link" + (isActive ? " sidebar-link-active" : "")}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
