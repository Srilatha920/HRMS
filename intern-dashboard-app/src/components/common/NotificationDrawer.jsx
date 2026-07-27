import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const NotificationDrawer = () => {
  const { notifications, unreadCount, closeDrawer, markAllRead, markRead } = useApp();
  const navigate = useNavigate();

  const handleClick = (notif) => {
    markRead(notif.id);
    closeDrawer();
    navigate(notif.link);
  };

  return (
    <>
      {/* Click-outside overlay */}
      <div className="notif-overlay" onClick={closeDrawer} />

      <aside className="notif-drawer" role="dialog" aria-label="Notifications">
        {/* Header */}
        <div className="notif-drawer-header">
          <div className="notif-drawer-title">
            <span>🔔</span>
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="topbar-badge" style={{ position: "static", border: "none", animation: "none" }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={markAllRead}>
                Mark all read
              </button>
            )}
            <button className="notif-drawer-close" onClick={closeDrawer} aria-label="Close notifications">
              ×
            </button>
          </div>
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <span className="notif-empty-icon">🎉</span>
            <span>All caught up! No notifications.</span>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notif-item${!notif.read ? " notif-item-unread" : ""}`}
                onClick={() => handleClick(notif)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleClick(notif)}
              >
                <div className="notif-icon">{notif.icon}</div>
                <div className="notif-content">
                  <div className="notif-title">{notif.title}</div>
                  <div className="notif-body">{notif.body}</div>
                </div>
                {!notif.read && <div className="notif-dot" />}
              </div>
            ))}
          </div>
        )}
      </aside>
    </>
  );
};

export default NotificationDrawer;
