import {
  ArrowUpRight,
  ClipboardList,
  Package,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";

import "./AdminDashboard.css";

function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "12,480",
      change: "+8.2%",
      icon: Users,
    },
    {
      title: "Providers",
      value: "326",
      change: "+5.4%",
      icon: Store,
    },
    {
      title: "Total Orders",
      value: "8,942",
      change: "+12.6%",
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: "4,218",
      change: "+4.8%",
      icon: Package,
    },
  ];

  return (
    <div className="admin-dashboard">

      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">Overview</span>

          <h1>Dashboard</h1>

          <p>Here's what's happening across your platform today.</p>
        </div>

        <button className="dashboard-action">
          <ClipboardList size={17} />

          <span>View Reports</span>

          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-card-top">
                <div className="stat-icon">
                  <Icon size={20} />
                </div>

                <span className="stat-change">{stat.change}</span>
              </div>

              <div className="stat-card-bottom">
                <span>{stat.title}</span>

                <strong>{stat.value}</strong>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel dashboard-orders">
          <div className="panel-header">
            <div>
              <h2>Recent Orders</h2>

              <p>Latest orders across the platform</p>
            </div>

            <button>View all</button>
          </div>

          <div className="empty-dashboard-state">
            <div className="empty-state-icon">
              <ShoppingCart size={22} />
            </div>

            <h3>No recent orders</h3>

            <p>Orders will appear here once customers start placing them.</p>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Platform Overview</h2>

              <p>Current platform activity</p>
            </div>
          </div>

          <div className="overview-list">
            <div className="overview-item">
              <span>Active Providers</span>

              <strong>284</strong>
            </div>

            <div className="overview-item">
              <span>Pending Verification</span>

              <strong>18</strong>
            </div>

            <div className="overview-item">
              <span>Active Delivery</span>

              <strong>142</strong>
            </div>

            <div className="overview-item">
              <span>Open Complaints</span>

              <strong>7</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
