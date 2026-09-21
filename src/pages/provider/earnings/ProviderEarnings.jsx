import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  Clock,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  X,
} from "lucide-react";
import "./ProviderEarnings.css";

const initialTransactions = [
  {
    id: "TX-2041",
    type: "sale",
    ref: "Order #SM-10482",
    amount: 620,
    status: "completed",
    date: "Today, 10:24 AM",
  },
  {
    id: "TX-2040",
    type: "commission",
    ref: "Commission 10% · #SM-10482",
    amount: -62,
    status: "completed",
    date: "Today, 10:24 AM",
  },
  {
    id: "TX-2039",
    type: "sale",
    ref: "Order #SM-10481",
    amount: 240,
    status: "pending",
    date: "Today, 09:50 AM",
  },
  {
    id: "TX-2038",
    type: "payout",
    ref: "Bank transfer",
    amount: -5000,
    status: "completed",
    date: "Yesterday",
  },
  {
    id: "TX-2037",
    type: "sale",
    ref: "Order #SM-10478",
    amount: 410,
    status: "completed",
    date: "Yesterday",
  },
  {
    id: "TX-2036",
    type: "commission",
    ref: "Commission 10% · #SM-10478",
    amount: -41,
    status: "completed",
    date: "Yesterday",
  },
  {
    id: "TX-2035",
    type: "sale",
    ref: "Order #SM-10477",
    amount: 500,
    status: "completed",
    date: "2 days ago",
  },
  {
    id: "TX-2034",
    type: "payout",
    ref: "Mobile wallet",
    amount: -2000,
    status: "failed",
    date: "3 days ago",
  },
];

const monthly = [
  { month: "Apr", value: 9800 },
  { month: "May", value: 12400 },
  { month: "Jun", value: 11100 },
  { month: "Jul", value: 15600 },
  { month: "Aug", value: 14200 },
  { month: "Sep", value: 18900 },
];

const INITIAL_AVAILABLE = 12400;
const PENDING = 3200;
const TOTAL_EARNED = 84200;
const MIN_PAYOUT = 100;

const tabs = [
  { key: "all", label: "All" },
  { key: "sale", label: "Sales" },
  { key: "commission", label: "Commissions" },
  { key: "payout", label: "Payouts" },
];

const statusLabels = {
  completed: "Completed",
  pending: "Pending",
  failed: "Failed",
};
const typeLabels = { sale: "Sale", commission: "Commission", payout: "Payout" };

const formatEGP = (n) => `EGP ${Math.abs(n).toLocaleString()}`;

export default function ProviderEarnings() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [available, setAvailable] = useState(INITIAL_AVAILABLE);
  const [tab, setTab] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank transfer");
  const [error, setError] = useState("");

  const maxMonth = Math.max(...monthly.map((m) => m.value));

  const filtered = useMemo(
    () => transactions.filter((t) => tab === "all" || t.type === tab),
    [transactions, tab],
  );

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setModalOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openModal = () => {
    setAmount("");
    setError("");
    setMethod("Bank transfer");
    setModalOpen(true);
  };

  const submitPayout = (e) => {
    e.preventDefault();
    const value = Number(amount);

    if (!amount || Number.isNaN(value)) return setError("Enter a valid amount");
    if (value < MIN_PAYOUT)
      return setError(`Minimum payout is ${formatEGP(MIN_PAYOUT)}`);
    if (value > available)
      return setError("Amount exceeds your available balance");

    setTransactions((prev) => [
      {
        id: `TX-${Date.now()}`,
        type: "payout",
        ref: method,
        amount: -value,
        status: "pending",
        date: "Just now",
      },
      ...prev,
    ]);
    setAvailable((a) => a - value);
    setModalOpen(false);
  };

  return (
    <div className="provider-earnings">
      <div className="er-header">
        <div>
          <h1>Earnings</h1>
          <p>Track your revenue, commissions and payouts.</p>
        </div>

        <button type="button" className="er-btn-primary" onClick={openModal}>
          <ArrowUpRight size={18} />
          Request Payout
        </button>
      </div>

      <section className="er-cards">
        <div className="er-card er-card-main">
          <div className="er-card-icon">
            <Wallet size={22} />
          </div>
          <span>Available balance</span>
          <strong>{formatEGP(available)}</strong>
          <small>Ready to withdraw</small>
        </div>

        <div className="er-card">
          <div className="er-card-icon tone-warning">
            <Clock size={22} />
          </div>
          <span>Pending</span>
          <strong>{formatEGP(PENDING)}</strong>
          <small>Released after delivery</small>
        </div>

        <div className="er-card">
          <div className="er-card-icon tone-success">
            <TrendingUp size={22} />
          </div>
          <span>Total earned</span>
          <strong>{formatEGP(TOTAL_EARNED)}</strong>
          <small>Since you joined</small>
        </div>
      </section>

      <section className="er-panel">
        <div className="er-panel-header">
          <div>
            <h3>Monthly Earnings</h3>
            <span>Last 6 months</span>
          </div>
        </div>

        <div className="er-chart">
          {monthly.map((m) => (
            <div key={m.month} className="er-bar-col">
              <span className="er-bar-value">
                {(m.value / 1000).toFixed(1)}k
              </span>
              <div className="er-bar-track">
                <div
                  className="er-bar-fill"
                  style={{ height: `${(m.value / maxMonth) * 100}%` }}
                  title={formatEGP(m.value)}
                />
              </div>
              <span className="er-bar-label">{m.month}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="er-panel er-table-panel">
        <div className="er-toolbar">
          <h3>Transactions</h3>

          <div className="er-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`er-tab ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="er-table-wrapper">
          <table className="er-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th className="right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="er-empty">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const positive = t.amount > 0;

                  return (
                    <tr key={t.id}>
                      <td>
                        <div className="er-tx">
                          <div
                            className={`er-tx-icon ${positive ? "in" : "out"}`}
                          >
                            {positive ? (
                              <ArrowDownLeft size={16} />
                            ) : (
                              <ArrowUpRight size={16} />
                            )}
                          </div>
                          <div>
                            <strong>{t.ref}</strong>
                            <span>{t.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{typeLabels[t.type]}</td>
                      <td>
                        <span className={`er-status ${t.status}`}>
                          {statusLabels[t.status]}
                        </span>
                      </td>
                      <td className="muted">{t.date}</td>
                      <td
                        className={`right er-amount ${positive ? "in" : "out"}`}
                      >
                        {positive ? "+" : "-"}
                        {formatEGP(t.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="er-overlay" onClick={() => setModalOpen(false)}>
          <div className="er-modal" onClick={(e) => e.stopPropagation()}>
            <div className="er-modal-header">
              <h3>Request Payout</h3>
              <button
                type="button"
                className="er-icon-btn"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitPayout} noValidate>
              <div className="er-modal-body">
                <div className="er-available">
                  <span>Available balance</span>
                  <strong>{formatEGP(available)}</strong>
                </div>

                <div className="er-field">
                  <label htmlFor="er-amount">Amount (EGP)</label>
                  <input
                    id="er-amount"
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError("");
                    }}
                    className={error ? "invalid" : ""}
                    placeholder={`Min ${MIN_PAYOUT}`}
                    autoFocus
                  />
                  {error && <small>{error}</small>}
                </div>

                <div className="er-field">
                  <label htmlFor="er-method">Payout method</label>
                  <select
                    id="er-method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    <option>Bank transfer</option>
                    <option>Mobile wallet</option>
                  </select>
                </div>
              </div>

              <div className="er-modal-footer">
                <button
                  type="button"
                  className="er-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="er-btn-primary">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
