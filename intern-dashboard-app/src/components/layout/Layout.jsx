import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Layout wraps every dashboard page with the Sidebar + Topbar,
// so we don't have to repeat that markup on every single page.
// Usage: <Layout title="Dashboard"><YourPageContent /></Layout>
const Layout = ({ title, children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Topbar title={title} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
