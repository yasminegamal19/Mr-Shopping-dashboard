import {
  ShoppingBag,
  Wallet,
  Package,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { mockProvider } from "../../features/providers/providerConfig";
import "./ProviderDashboard.css";

const stats = [
  {
    key: "orders",
    label: "Total Orders",
    value: "1,284",
    change: 12.5,
    icon: ShoppingBag,
    tone: "primary",
  },
  {
    key: "revenue",
    label: "Revenue",
    value: "EGP 84,200",
    change: 8.2,
    icon: Wallet,
    tone: "success",
  },
  {
    key: "products",
    label: "Active Products",
    value: "146",
    change: -2.4,
    icon: Package,
    tone: "info",
  },
  {
    key: "rating",
    label: "Average Rating",
    value: "4.8",
    change: 1.1,
    icon: Star,
    tone: "warning",
  },
];

const weeklySales = [
  { day: "Sat", value: 6200 },
  { day: "Sun", value: 8400 },
  { day: "Mon", value: 5100 },
  { day: "Tue", value: 9800 },
  { day: "Wed", value: 7300 },
  { day: "Thu", value: 11200 },
  { day: "Fri", value: 9100 },
];

const topProducts = [
  { name: "Fresh Milk 1L", sales: 320 },
  { name: "Arabic Bread Pack", sales: 254 },
  { name: "Olive Oil 500ml", sales: 198 },
  { name: "Chicken Breast 1kg", sales: 143 },
];

const recentOrders = [
  {
    id: "#SM-10482",
    customer: "Ahmed Hassan",
    items: 4,
    total: 620,
    status: "delivered",
    date: "Today, 10:24 AM",
  },
  {
    id: "#SM-10481",
    customer: "Sara Mohamed",
    items: 2,
    total: 240,
    status: "processing",
    date: "Today, 09:50 AM",
  },
  {
    id: "#SM-10480",
    customer: "Omar Khaled",
    items: 6,
    total: 1150,
    status: "pending",
    date: "Today, 09:12 AM",
  },
  {
    id: "#SM-10479",
    customer: "Mona Ali",
    items: 1,
    total: 95,
    status: "cancelled",
    date: "Yesterday",
  },
  {
    id: "#SM-10478",
    customer: "Youssef Adel",
    items: 3,
    total: 410,
    status: "delivered",
    date: "Yesterday",
  },
];

const statusLabels = {
  delivered: "Delivered",
  processing: "Processing",
  pending: "Pending",
  cancelled: "Cancelled",
};

const formatEGP = (n) => `EGP ${n.toLocaleString()}`;

export default function ProviderDashboard() {
  const maxSales = Math.max(...weeklySales.map((d) => d.value));
  const maxProduct = Math.max(...topProducts.map((p) => p.sales));

  return (
    <div className="provider-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {mockProvider.ownerName} 👋</h1>
          <p>Here's what's happening with {mockProvider.name} today.</p>
        </div>

        <button type="button" className="dashboard-btn-primary">
          + Add Product
        </button>
      </div>

      <section className="dashboard-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const positive = stat.change >= 0;
          const Trend = positive ? TrendingUp : TrendingDown;

          return (
            <div key={stat.key} className="stat-card">
              <div className={`stat-icon tone-${stat.tone}`}>
                <Icon size={22} />
              </div>

              <div className="stat-body">
                <span className="stat-label">{stat.label}</span>
                <strong className="stat-value">{stat.value}</strong>

                <span className={`stat-change ${positive ? "up" : "down"}`}>
                  <Trend size={14} />
                  {Math.abs(stat.change)}% vs last week
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Weekly Sales</h3>
              <span>Revenue over the last 7 days</span>
            </div>
          </div>

          <div className="bar-chart">
            {weeklySales.map((d) => (
              <div key={d.day} className="bar-col">
                <span className="bar-value">
                  {(d.value / 1000).toFixed(1)}k
                </span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: `${(d.value / maxSales) * 100}%` }}
                    title={formatEGP(d.value)}
                  />
                </div>
                <span className="bar-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Top Products</h3>
              <span>Best sellers this month</span>
            </div>
          </div>

          <ul className="top-products">
            {topProducts.map((p, i) => (
              <li key={p.name}>
                <div className="top-product-row">
                  <span className="top-product-rank">{i + 1}</span>
                  <span className="top-product-name">{p.name}</span>
                  <strong>{p.sales}</strong>
                </div>
                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{ width: `${(p.sales / maxProduct) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="dashboard-card">
        <div className="card-header">
          <div>
            <h3>Recent Orders</h3>
            <span>Latest orders from your customers</span>
          </div>

          <button type="button" className="dashboard-btn-ghost">
            View all
          </button>
        </div>

        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.items}</td>
                  <td>{formatEGP(order.total)}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="muted">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
