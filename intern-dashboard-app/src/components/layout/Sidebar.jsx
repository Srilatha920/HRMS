import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [lifecycleOpen, setLifecycleOpen] = useState(true);

  const mainLinks = [
    { to: "/dashboard",  label: "Dashboard",       icon: "📊" },
    { to: "/interns",    label: "Interns",          icon: "👥" },
    { to: "/compare",    label: "Compare Interns",  icon: "⚖️"  },
    { to: "/assessment", label: "New Assessment",   icon: "📝" },
    { to: "/attendance", label: "Attendance",        icon: "📅" },
    { to: "/events",     label: "Event Stream",     icon: "⚡" },
  ];

  const lifecycleLinks = [
    { to: "/lifecycle",              label: "Lifecycle Hub",          icon: "🔄" },
    { to: "/lifecycle/onboarding",   label: "Onboarding",             icon: "📋" },
    { to: "/lifecycle/promotions",   label: "Promotions & Transfers", icon: "🚀" },
    { to: "/lifecycle/feedback",     label: "Feedback",               icon: "💬" },
    { to: "/lifecycle/exit",         label: "Exit Interviews",        icon: "🚪" },
  ];

  return (
    <aside className="sidebar">
      {/* Logo + AI live badge */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🎯</span>
        <span className="sidebar-logo-text">Employee Engagement & Listening</span>
        <span className="sidebar-logo-badge">
          <span style={{ fontSize: 8 }}>●</span> Live
        </span>
      </div>

      <nav className="sidebar-nav">
        {/* Main links */}
        {mainLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            id={`nav-${link.to.replace("/", "").replace("/", "-") || "dashboard"}`}
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " sidebar-link-active" : "")
            }
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}

        {/* Employee Lifecycle section */}
        <div
          className="sidebar-section-label"
          onClick={() => setLifecycleOpen((o) => !o)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setLifecycleOpen((o) => !o)}
        >
          <span>Employee Lifecycle</span>
          <span className="sidebar-section-chevron">{lifecycleOpen ? "▾" : "▸"}</span>
        </div>

        {lifecycleOpen && lifecycleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/lifecycle"}
            id={`nav-${link.to.replace(/\//g, "-").replace(/^-/, "")}`}
            className={({ isActive }) =>
              "sidebar-link sidebar-link-sub" + (isActive ? " sidebar-link-active" : "")
            }
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
