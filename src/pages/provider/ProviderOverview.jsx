import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Wallet,
  Star,
  ArrowUpRight,
  ArrowRight,
  Package,
  CalendarDays,
} from "lucide-react";

import { mockProvider } from "../../features/providers/providerConfig";
import "./ProviderOverview.css";

const stats = [
  {
    title: "Total Orders",
    value: "248",
    change: "+12.5%",
    icon: ShoppingBag,
    type: "primary",
  },
  {
    title: "Pending Requests",
    value: "18",
    change: "+4.2%",
    icon: Clock3,
    type: "warning",
  },
  {
    title: "Completed",
    value: "214",
    change: "+8.7%",
    icon: CheckCircle2,
    type: "success",
  },
  {
    title: "Total Earnings",
    value: "48,250",
    change: "+14.3%",
    icon: Wallet,
    type: "earnings",
  },
];

const recentOrders = [
  {
    id: "#ORD-10482",
    customer: "Ahmed Hassan",
    item: "Men's Casual Collection",
    amount: "2,400 EGP",
    status: "Completed",
    date: "18 Sep 2026",
  },
  {
    id: "#ORD-10478",
    customer: "Youssef Mohamed",
    item: "MacBook Air M3",
    amount: "62,000 EGP",
    status: "Preparing",
    date: "17 Sep 2026",
  },
  {
    id: "#ORD-10475",
    customer: "Aya Samir",
    item: "Health & Care Products",
    amount: "980 EGP",
    status: "Ready",
    date: "16 Sep 2026",
  },
  {
    id: "#ORD-10471",
    customer: "Mariam Ali",
    item: "Wireless Headphones",
    amount: "1,850 EGP",
    status: "Pending",
    date: "16 Sep 2026",
  },
];

const getOrderStatusClass = (status) => {
  switch (status) {
    case "Completed":
      return "provider-status-success";

    case "Preparing":
    case "Ready":
      return "provider-status-warning";

    case "Pending":
      return "provider-status-pending";

    default:
      return "";
  }
};

export default function ProviderOverview() {
  return (
    <div className="provider-overview">
      <div className="provider-overview-header">
        <div>
          <h1>Good afternoon, {mockProvider.ownerName}</h1>
          <p>Here's what's happening with your business today.</p>
        </div>

        <div className="provider-plan-badge">
          <span>Current Plan</span>
          <strong>{mockProvider.plan}</strong>
        </div>
      </div>

      <div className="provider-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="provider-stat-card" key={stat.title}>
              <div className={`provider-stat-icon ${stat.type}`}>
                <Icon size={20} />
              </div>

              <div className="provider-stat-content">
                <span>{stat.title}</span>

                <div className="provider-stat-value-row">
                  <strong>{stat.value}</strong>

                  <span className="provider-stat-change">
                    <ArrowUpRight size={13} />
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="provider-dashboard-grid">
        <section className="provider-panel provider-orders-panel">
          <div className="provider-panel-header">
            <div>
              <h2>Recent Orders</h2>
              <p>Your latest customer orders</p>
            </div>

            <button className="provider-view-all">
              View All
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="provider-orders-table-wrapper">
            <table className="provider-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="provider-order-id">{order.id}</span>
                    </td>

                    <td>
                      <strong className="provider-customer-name">
                        {order.customer}
                      </strong>
                    </td>

                    <td>
                      <span className="provider-order-item">{order.item}</span>
                    </td>

                    <td>
                      <strong>{order.amount}</strong>
                    </td>

                    <td>
                      <span
                        className={`provider-order-status ${getOrderStatusClass(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <span className="provider-order-date">{order.date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="provider-side-panels">
          <section className="provider-panel provider-rating-panel">
            <div className="provider-panel-header">
              <div>
                <h2>Customer Rating</h2>
                <p>Your overall performance</p>
              </div>

              <Star
                size={19}
                className="provider-rating-star"
                fill="currentColor"
              />
            </div>

            <div className="provider-rating-main">
              <strong>{mockProvider.rating}</strong>

              <div>
                <div className="provider-rating-stars">★★★★★</div>

                <span>Based on 126 reviews</span>
              </div>
            </div>

            <div className="provider-rating-bars">
              <div>
                <span>5</span>
                <div className="rating-bar">
                  <span style={{ width: "82%" }} />
                </div>
                <small>82%</small>
              </div>

              <div>
                <span>4</span>
                <div className="rating-bar">
                  <span style={{ width: "12%" }} />
                </div>
                <small>12%</small>
              </div>

              <div>
                <span>3</span>
                <div className="rating-bar">
                  <span style={{ width: "4%" }} />
                </div>
                <small>4%</small>
              </div>

              <div>
                <span>2</span>
                <div className="rating-bar">
                  <span style={{ width: "1%" }} />
                </div>
                <small>1%</small>
              </div>

              <div>
                <span>1</span>
                <div className="rating-bar">
                  <span style={{ width: "1%" }} />
                </div>
                <small>1%</small>
              </div>
            </div>
          </section>

          <section className="provider-panel provider-quick-panel">
            <div className="provider-panel-header">
              <div>
                <h2>Quick Actions</h2>
                <p>Manage your business</p>
              </div>
            </div>

            <div className="provider-quick-actions">
              <button>
                <Package size={17} />
                <span>Add Product</span>
                <ArrowRight size={14} />
              </button>

              <button>
                <CalendarDays size={17} />
                <span>Manage Orders</span>
                <ArrowRight size={14} />
              </button>

              <button>
                <Wallet size={17} />
                <span>View Earnings</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
