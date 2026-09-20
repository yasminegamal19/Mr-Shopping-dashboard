import { Outlet } from "react-router-dom";
import ProviderSidebar from "./ProviderSidebar";
import "./ProviderLayout.css";

export default function ProviderLayout() {
  return (
    <div className="provider-layout">
      <ProviderSidebar />

      <main className="provider-content">
        <Outlet />
      </main>
    </div>
  );
}
