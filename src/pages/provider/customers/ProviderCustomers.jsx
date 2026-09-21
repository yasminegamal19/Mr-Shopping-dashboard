import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Crown,
  Search,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./ProviderCustomers.css";

const customersData = [
  {
    id: 1,
    name: "Ahmed Hassan",
    phone: "0100 123 4567",
    email: "ahmed@example.com",
    address: "12 Tahrir St, Giza",
    orders: 12,
    spent: 8420,
    lastOrder: "2026-09-21",
    joined: "2025-11-03",
    recent: [
      { id: "#SM-10482", total: 620, status: "delivered" },
      { id: "#SM-10460", total: 310, status: "delivered" },
    ],
  },
  {
    id: 2,
    name: "Sara Mohamed",
    phone: "0111 222 3344",
    email: "sara@example.com",
    address: "5 Pyramids Rd, Giza",
    orders: 6,
    spent: 3150,
    lastOrder: "2026-09-21",
    joined: "2026-01-15",
    recent: [
      { id: "#SM-10481", total: 240, status: "processing" },
      { id: "#SM-10433", total: 480, status: "delivered" },
    ],
  },
  {
    id: 3,
    name: "Omar Khaled",
    phone: "0122 555 6677",
    email: "omar@example.com",
    address: "30 Faisal St, Giza",
    orders: 3,
    spent: 1980,
    lastOrder: "2026-09-20",
    joined: "2026-05-22",
    recent: [{ id: "#SM-10480", total: 1150, status: "pending" }],
  },
  {
    id: 4,
    name: "Mona Ali",
    phone: "0155 888 9900",
    email: "mona@example.com",
    address: "8 Dokki St, Giza",
    orders: 1,
    spent: 95,
    lastOrder: "2026-09-19",
    joined: "2026-09-10",
    recent: [{ id: "#SM-10479", total: 95, status: "cancelled" }],
  },
  {
    id: 5,
    name: "Youssef Adel",
    phone: "0100 777 1122",
    email: "youssef@example.com",
    address: "22 Haram St, Giza",
    orders: 5,
    spent: 2760,
    lastOrder: "2026-09-18",
    joined: "2026-02-08",
    recent: [{ id: "#SM-10478", total: 410, status: "delivered" }],
  },
  {
    id: 6,
    name: "Laila Samir",
    phone: "0128 334 5566",
    email: "laila@example.com",
    address: "3 Mohandessin, Giza",
    orders: 2,
    spent: 870,
    lastOrder: "2026-09-17",
    joined: "2026-07-01",
    recent: [{ id: "#SM-10477", total: 500, status: "delivered" }],
  },
  {
    id: 7,
    name: "Karim Nabil",
    phone: "0106 909 8080",
    email: "karim@example.com",
    address: "17 Agouza St, Giza",
    orders: 1,
    spent: 180,
    lastOrder: "2026-09-15",
    joined: "2026-09-14",
    recent: [{ id: "#SM-10476", total: 180, status: "processing" }],
  },
  {
    id: 8,
    name: "Hana Tarek",
    phone: "0114 606 7070",
    email: "hana@example.com",
    address: "9 Nasr St, Giza",
    orders: 8,
    spent: 5240,
    lastOrder: "2026-09-12",
    joined: "2025-12-20",
    recent: [
      { id: "#SM-10475", total: 475, status: "pending" },
      { id: "#SM-10401", total: 900, status: "delivered" },
    ],
  },
];

const getSegment = (orders) => {
  if (orders >= 5) return "vip";
  if (orders >= 2) return "returning";
  return "new";
};

const segmentLabels = { new: "New", returning: "Returning", vip: "VIP" };
const statusLabels = {
  delivered: "Delivered",
  processing: "Processing",
  pending: "Pending",
  cancelled: "Cancelled",
};

const tabs = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "returning", label: "Returning" },
  { key: "vip", label: "VIP" },
];

const sorters = {
  recent: (a, b) => new Date(b.lastOrder) - new Date(a.lastOrder),
  spent: (a, b) => b.spent - a.spent,
  orders: (a, b) => b.orders - a.orders,
  name: (a, b) => a.name.localeCompare(b.name),
};

const PAGE_SIZE = 6;

const formatEGP = (n) => `EGP ${n.toLocaleString()}`;
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function ProviderCustomers() {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const customers = useMemo(
    () => customersData.map((c) => ({ ...c, segment: getSegment(c.orders) })),
    [],
  );

  const counts = useMemo(
    () => ({
      all: customers.length,
      new: customers.filter((c) => c.segment === "new").length,
      returning: customers.filter((c) => c.segment === "returning").length,
      vip: customers.filter((c) => c.segment === "vip").length,
    }),
    [customers],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers
      .filter((c) => {
        const matchTab = tab === "all" || c.segment === tab;
        const matchQuery =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
          c.email.toLowerCase().includes(q);
        return matchTab && matchQuery;
      })
      .sort(sorters[sort]);
  }, [customers, tab, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [tab, query, sort]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="provider-customers">
      <div className="cu-header">
        <h1>Customers</h1>
        <p>See who's buying from you and how often.</p>
      </div>

      <section className="cu-summary">
        <div className="cu-card">
          <div className="cu-card-icon tone-primary">
            <Users size={22} />
          </div>
          <div>
            <span>Total customers</span>
            <strong>{counts.all}</strong>
          </div>
        </div>

        <div className="cu-card">
          <div className="cu-card-icon tone-info">
            <UserPlus size={22} />
          </div>
          <div>
            <span>New customers</span>
            <strong>{counts.new}</strong>
          </div>
        </div>

        <div className="cu-card">
          <div className="cu-card-icon tone-warning">
            <Crown size={22} />
          </div>
          <div>
            <span>VIP customers</span>
            <strong>{counts.vip}</strong>
          </div>
        </div>
      </section>

      <section className="cu-panel cu-table-panel">
        <div className="cu-toolbar">
          <div className="cu-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`cu-tab ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
                <span>{counts[t.key]}</span>
              </button>
            ))}
          </div>

          <div className="cu-tools">
            <div className="cu-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search name, phone or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort customers"
            >
              <option value="recent">Most recent</option>
              <option value="spent">Top spenders</option>
              <option value="orders">Most orders</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>

        <div className="cu-table-wrapper">
          <table className="cu-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Segment</th>
                <th>Orders</th>
                <th>Total spent</th>
                <th>Last order</th>
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="cu-empty">
                    No customers found.
                  </td>
                </tr>
              ) : (
                pageRows.map((c) => (
                  <tr key={c.id} onClick={() => setSelected(c)}>
                    <td>
                      <div className="cu-person">
                        <div className="cu-avatar">{c.name.charAt(0)}</div>
                        <div>
                          <strong>{c.name}</strong>
                          <span>{c.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`cu-badge ${c.segment}`}>
                        {segmentLabels[c.segment]}
                      </span>
                    </td>
                    <td>{c.orders}</td>
                    <td className="cu-spent">{formatEGP(c.spent)}</td>
                    <td className="muted">{formatDate(c.lastOrder)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="cu-pagination">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>

          <div className="cu-pagination-controls">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="cu-page-current">
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
          <div className="cu-overlay" onClick={() => setSelected(null)} />

          <aside className="cu-drawer">
            <div className="cu-drawer-header">
              <div className="cu-person large">
                <div className="cu-avatar large">{selected.name.charAt(0)}</div>
                <div>
                  <h3>{selected.name}</h3>
                  <span className={`cu-badge ${selected.segment}`}>
                    {segmentLabels[selected.segment]}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="cu-icon-btn"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="cu-drawer-body">
              <div className="cu-stats">
                <div>
                  <span>Orders</span>
                  <strong>{selected.orders}</strong>
                </div>
                <div>
                  <span>Total spent</span>
                  <strong>{formatEGP(selected.spent)}</strong>
                </div>
                <div>
                  <span>Avg. order</span>
                  <strong>
                    {formatEGP(Math.round(selected.spent / selected.orders))}
                  </strong>
                </div>
              </div>

              <div className="cu-section">
                <h4>Contact</h4>
                <p>
                  <Phone size={14} /> {selected.phone}
                </p>
                <p>
                  <Mail size={14} /> {selected.email}
                </p>
                <p>
                  <MapPin size={14} /> {selected.address}
                </p>
                <p className="cu-joined">
                  Customer since {formatDate(selected.joined)}
                </p>
              </div>

              <div className="cu-section">
                <h4>Recent orders</h4>
                <ul className="cu-orders">
                  {selected.recent.map((o) => (
                    <li key={o.id}>
                      <strong>{o.id}</strong>
                      <span className={`cu-status ${o.status}`}>
                        {statusLabels[o.status]}
                      </span>
                      <em>{formatEGP(o.total)}</em>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="cu-drawer-footer">
              <a className="cu-btn-secondary" href={`mailto:${selected.email}`}>
                <Mail size={16} /> Email
              </a>
              <a
                className="cu-btn-primary"
                href={`tel:${selected.phone.replace(/\s/g, "")}`}
              >
                <Phone size={16} /> Call
              </a>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
