import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Settings2,
  ShoppingBag,
  Store,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

import { getAuth, logout } from "../../services/mockAuth";

import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const auth = getAuth();
  const user = auth?.user;

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Providers",
      path: "/admin/providers",
      icon: Store,
    },
    {
      label: "Delivery",
      path: "/admin/delivery",
      icon: ShoppingBag,
    },
    {
      label: "Categories",
      path: "/admin/categories",
      icon: Package,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      label: "Services",
      path: "/admin/services",
      icon: Settings2,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isActive = (path) => {
    if (path === "/admin/dashboard") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
    
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/Logo.png" alt="MR Shopping" />
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
          <span className="sidebar-section-title">Main Menu</span>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                type="button"
                className={`sidebar-item ${
                  isActive(item.path) ? "active" : ""
                }`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-item"
            onClick={() => navigate("/admin/settings")}
          >
            <Settings size={19} />

            <span>Settings</span>
          </button>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={19} />

            <span>Sign out</span>
          </button>
        </div>
      </aside>

    

      <div className="admin-main">

        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={21} />
            </button>

            <div className="topbar-page-info">
              <span>Management</span>

              <strong>Admin Dashboard</strong>
            </div>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="notification-button"
              aria-label="Notifications"
              onClick={() => navigate("/admin/notifications")}
            >
              <Bell size={20} />

              <span className="notification-dot" />
            </button>

            <div className="topbar-divider" />

            <button type="button" className="admin-profile">
              <div className="admin-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="admin-profile-info">
                <strong>{user?.name || "Administrator"}</strong>

                <span>Administrator</span>
              </div>

              <ChevronDown size={16} />
            </button>
          </div>
        </header>


        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
