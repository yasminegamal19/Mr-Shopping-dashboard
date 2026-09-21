import { useState } from "react";
import { Outlet } from "react-router-dom";
import ProviderSidebar from "./ProviderSidebar";
import ProviderTopbar from "./ProviderTopbar";
import "./ProviderLayout.css";

export default function ProviderLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="provider-layout">
      <ProviderSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          className="provider-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="provider-main">
        <ProviderTopbar onToggleSidebar={() => setSidebarOpen((p) => !p)} />

        <main className="provider-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
