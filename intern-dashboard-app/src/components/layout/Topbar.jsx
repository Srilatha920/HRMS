import React from "react";
import { useApp } from "../../context/AppContext";
import NotificationDrawer from "../common/NotificationDrawer";

// Topbar with notification bell wired to AppContext
const Topbar = ({ title }) => {
  const { unreadCount, notificationDrawerOpen, toggleDrawer } = useApp();

  return (
    <>
      <header className="topbar">
        <h1 className="topbar-title">{title}</h1>

        <div className="topbar-right">
          {/* Notification bell */}
          <button
            id="topbar-notification-bell"
            className="topbar-bell-btn"
            onClick={toggleDrawer}
            aria-label={`Notifications — ${unreadCount} unread`}
            title="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span className="topbar-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
            )}
          </button>

          {/* HR Admin avatar */}
          <div className="topbar-avatar" title="HR Admin">HR</div>
        </div>
      </header>

      {/* Notification drawer (portal-style, rendered inside Topbar so it's always accessible) */}
      {notificationDrawerOpen && <NotificationDrawer />}
    </>
  );
};

export default Topbar;
