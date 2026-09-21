import { memo, useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { mockProvider } from "../../features/providers/providerConfig";
import "./ProviderTopbar.css";

const ProviderTopbar = ({ onToggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="provider-topbar">
      <div className="provider-topbar-left">
        <button
          type="button"
          className="provider-topbar-icon-btn provider-topbar-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="provider-topbar-search">
          <Search size={16} />
          <input type="text" placeholder="Search orders, products..." />
        </div>
      </div>

      <div className="provider-topbar-right">
        <button
          type="button"
          className="provider-topbar-icon-btn"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="provider-topbar-badge">3</span>
        </button>

        <div className="provider-topbar-divider" />

        <div className="provider-topbar-user" ref={menuRef}>
          <button
            type="button"
            className="provider-topbar-user-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div className="provider-avatar">
              {mockProvider.ownerName.charAt(0)}
            </div>

            <div className="provider-topbar-user-info">
              <strong>{mockProvider.ownerName}</strong>
              <span>{mockProvider.name}</span>
            </div>

            <ChevronDown
              size={16}
              className={`provider-topbar-chevron ${menuOpen ? "open" : ""}`}
            />
          </button>

          {menuOpen && (
            <div className="provider-topbar-dropdown">
              <button type="button">
                <User size={16} />
                <span>Profile</span>
              </button>
              <button type="button">
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <hr />
              <button type="button" className="danger">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(ProviderTopbar);
