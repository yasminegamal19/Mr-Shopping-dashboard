import { useMemo, useState, useEffect } from "react";
import {
  Search,
  X,
  Eye,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./ProviderOrders.css";

const ordersData = [
  {
    id: "#SM-10482",
    customer: "Ahmed Hassan",
    phone: "0100 123 4567",
    address: "12 Tahrir St, Giza",
    payment: "Cash",
    status: "delivered",
    date: "Today, 10:24 AM",
    items: [
      { name: "Fresh Milk 1L", qty: 2, price: 45 },
      { name: "Arabic Bread Pack", qty: 2, price: 265 },
    ],
  },
  {
    id: "#SM-10481",
    customer: "Sara Mohamed",
    phone: "0111 222 3344",
    address: "5 Pyramids Rd, Giza",
    payment: "Card",
    status: "processing",
    date: "Today, 09:50 AM",
    items: [{ name: "Olive Oil 500ml", qty: 1, price: 240 }],
  },
  {
    id: "#SM-10480",
    customer: "Omar Khaled",
    phone: "0122 555 6677",
    address: "30 Faisal St, Giza",
    payment: "Cash",
    status: "pending",
    date: "Today, 09:12 AM",
    items: [
      { name: "Chicken Breast 1kg", qty: 3, price: 250 },
      { name: "Fresh Milk 1L", qty: 3, price: 133 },
    ],
  },
  {
    id: "#SM-10479",
    customer: "Mona Ali",
    phone: "0155 888 9900",
    address: "8 Dokki St, Giza",
    payment: "Card",
    status: "cancelled",
    date: "Yesterday",
    items: [{ name: "Arabic Bread Pack", qty: 1, price: 95 }],
  },
  {
    id: "#SM-10478",
    customer: "Youssef Adel",
    phone: "0100 777 1122",
    address: "22 Haram St, Giza",
    payment: "Cash",
    status: "delivered",
    date: "Yesterday",
    items: [
      { name: "Olive Oil 500ml", qty: 1, price: 240 },
      { name: "Fresh Milk 1L", qty: 2, price: 85 },
    ],
  },
  {
    id: "#SM-10477",
    customer: "Laila Samir",
    phone: "0128 334 5566",
    address: "3 Mohandessin, Giza",
    payment: "Card",
    status: "delivered",
    date: "2 days ago",
    items: [{ name: "Chicken Breast 1kg", qty: 2, price: 500 }],
  },
  {
    id: "#SM-10476",
    customer: "Karim Nabil",
    phone: "0106 909 8080",
    address: "17 Agouza St, Giza",
    payment: "Cash",
    status: "processing",
    date: "2 days ago",
    items: [{ name: "Fresh Milk 1L", qty: 4, price: 180 }],
  },
  {
    id: "#SM-10475",
    customer: "Hana Tarek",
    phone: "0114 606 7070",
    address: "9 Nasr St, Giza",
    payment: "Card",
    status: "pending",
    date: "3 days ago",
    items: [{ name: "Arabic Bread Pack", qty: 5, price: 475 }],
  },
];

const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const tabs = ["all", "pending", "processing", "delivered", "cancelled"];
const PAGE_SIZE = 5;

const orderTotal = (o) => o.items.reduce((sum, i) => sum + i.price, 0);
const formatEGP = (n) => `EGP ${n.toLocaleString()}`;

export default function ProviderOrders() {
  const [orders, setOrders] = useState(ordersData);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const counts = useMemo(() => {
    const c = { all: orders.length };
    Object.keys(statusLabels).forEach((s) => {
      c[s] = orders.filter((o) => o.status === s).length;
    });
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchTab = tab === "all" || o.status === tab;
      const matchQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q);
      return matchTab && matchQuery;
    });
  }, [orders, tab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [tab, query]);

  const updateStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev,
    );
  };

  return (
    <div className="provider-orders">
      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and track all your customer orders.</p>
        </div>
      </div>

      <section className="orders-summary">
        {Object.keys(statusLabels).map((s) => (
          <div key={s} className={`summary-card ${s}`}>
            <span>{statusLabels[s]}</span>
            <strong>{counts[s]}</strong>
          </div>
        ))}
      </section>

      <section className="orders-card">
        <div className="orders-toolbar">
          <div className="orders-tabs">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                className={`orders-tab ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t === "all" ? "All" : statusLabels[t]}
                <span>{counts[t]}</span>
              </button>
            ))}
          </div>

          <div className="orders-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by order or customer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-list-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th aria-label="Actions" />
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="orders-empty">
                    No orders found.
                  </td>
                </tr>
              ) : (
                pageRows.map((o) => (
                  <tr key={o.id} onClick={() => setSelected(o)}>
                    <td className="order-id">{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.items.length}</td>
                    <td>{formatEGP(orderTotal(o))}</td>
                    <td>{o.payment}</td>
                    <td>
                      <span className={`status-badge ${o.status}`}>
                        {statusLabels[o.status]}
                      </span>
                    </td>
                    <td className="muted">{o.date}</td>
                    <td>
                      <button
                        type="button"
                        className="row-action"
                        aria-label="View order"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(o);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="orders-pagination">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>

          <div className="pagination-controls">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="pagination-current">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {selected && (
        <>
          <div className="drawer-overlay" onClick={() => setSelected(null)} />

          <aside className="order-drawer">
            <div className="drawer-header">
              <div>
                <h3>{selected.id}</h3>
                <span className={`status-badge ${selected.status}`}>
                  {statusLabels[selected.status]}
                </span>
              </div>

              <button
                type="button"
                className="row-action"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              <div className="drawer-section">
                <h4>Customer</h4>
                <strong>{selected.customer}</strong>
                <p>
                  <Phone size={14} /> {selected.phone}
                </p>
                <p>
                  <MapPin size={14} /> {selected.address}
                </p>
              </div>

              <div className="drawer-section">
                <h4>Items</h4>
                <ul className="drawer-items">
                  {selected.items.map((i) => (
                    <li key={i.name}>
                      <span>
                        {i.name} <em>× {i.qty}</em>
                      </span>
                      <strong>{formatEGP(i.price)}</strong>
                    </li>
                  ))}
                </ul>

                <div className="drawer-total">
                  <span>Total ({selected.payment})</span>
                  <strong>{formatEGP(orderTotal(selected))}</strong>
                </div>
              </div>

              <div className="drawer-section">
                <h4>Update status</h4>
                <select
                  className="drawer-select"
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                >
                  {Object.keys(statusLabels).map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
