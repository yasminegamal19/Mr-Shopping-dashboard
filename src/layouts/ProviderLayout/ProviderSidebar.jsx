import { NavLink } from "react-router-dom";
import { getProviderModules } from "../../features/providers/providerModules";
import { mockProvider } from "../../features/providers/providerConfig";
import "./ProviderSidebar.css";

export default function ProviderSidebar() {
  const modules = getProviderModules(mockProvider);

  return (
    <aside className="provider-sidebar">
      <div className="provider-sidebar-brand">
        <div className="provider-logo">S</div>

        <div>
          <h2>Shopping Mr</h2>
          <span>Provider Portal</span>
        </div>
      </div>

      <nav className="provider-sidebar-nav">
        <div className="provider-nav-section">
          <span className="provider-nav-title">MAIN MENU</span>

          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <NavLink
                key={module.key}
                to={module.path}
                end={module.path === "/provider"}
                className={({ isActive }) =>
                  `provider-nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{module.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="provider-sidebar-footer">
        <div className="provider-sidebar-provider">
          <div className="provider-avatar">
            {mockProvider.ownerName.charAt(0)}
          </div>

          <div>
            <strong>{mockProvider.ownerName}</strong>
            <span>{mockProvider.name}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
