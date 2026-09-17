import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  MoreVertical,
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
  WalletCards,
  User,
  Store,
  CalendarDays,
  Receipt,
  ChevronDown,
} from "lucide-react";

import "./Payments.css";

const initialPayments = [
  {
    id: "#PAY-78241",
    orderId: "#ORD-10482",
    customer: "Ahmed Hassan",
    provider: "Smart Store",
    amount: 48500,
    method: "Bank Wallet",
    status: "Successful",
    transactionId: "TXN-8A42F91",
    createdAt: "17 Sep 2026, 09:43 AM",
  },
  {
    id: "#PAY-78240",
    orderId: "#ORD-10481",
    customer: "Mariam Ali",
    provider: "Fresh Market",
    amount: 1250,
    method: "Fawry",
    status: "Successful",
    transactionId: "TXN-7B31D82",
    createdAt: "17 Sep 2026, 08:16 AM",
  },
  {
    id: "#PAY-78239",
    orderId: "#ORD-10480",
    customer: "Omar Khaled",
    provider: "Dr. Sara Clinic",
    amount: 500,
    method: "Bank Wallet",
    status: "Successful",
    transactionId: "TXN-6C21E73",
    createdAt: "16 Sep 2026, 06:31 PM",
  },
  {
    id: "#PAY-78238",
    orderId: "#ORD-10479",
    customer: "Nour Ahmed",
    provider: "Home Experts",
    amount: 350,
    method: "Fawry",
    status: "Pending",
    transactionId: "TXN-5D10F64",
    createdAt: "16 Sep 2026, 04:13 PM",
  },
  {
    id: "#PAY-78237",
    orderId: "#ORD-10478",
    customer: "Youssef Mohamed",
    provider: "Tech World",
    amount: 62000,
    method: "Bank Wallet",
    status: "Successful",
    transactionId: "TXN-4E09G55",
    createdAt: "16 Sep 2026, 02:46 PM",
  },
  {
    id: "#PAY-78236",
    orderId: "#ORD-10477",
    customer: "Salma Mahmoud",
    provider: "Learn Academy",
    amount: 700,
    method: "Fawry",
    status: "Successful",
    transactionId: "TXN-3F98H46",
    createdAt: "15 Sep 2026, 11:21 AM",
  },
  {
    id: "#PAY-78235",
    orderId: "#ORD-10476",
    customer: "Mostafa Adel",
    provider: "Fashion House",
    amount: 2400,
    method: "Fawry",
    status: "Failed",
    transactionId: "TXN-2G87J37",
    createdAt: "15 Sep 2026, 09:11 AM",
  },
  {
    id: "#PAY-78234",
    orderId: "#ORD-10475",
    customer: "Aya Samir",
    provider: "Green Pharmacy",
    amount: 980,
    method: "Bank Wallet",
    status: "Successful",
    transactionId: "TXN-1H76K28",
    createdAt: "14 Sep 2026, 07:56 PM",
  },
];

const statusOptions = ["All", "Successful", "Pending", "Failed"];

const methodOptions = ["All", "Fawry", "Bank Wallet"];

function Payments() {
  const [payments, setPayments] = useState(initialPayments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const stats = useMemo(() => {
    const successfulPayments = payments.filter(
      (payment) => payment.status === "Successful",
    );

    return {
      total: payments.length,

      successful: successfulPayments.length,

      pending: payments.filter((payment) => payment.status === "Pending")
        .length,

      failed: payments.filter((payment) => payment.status === "Failed").length,

      revenue: successfulPayments.reduce(
        (total, payment) => total + payment.amount,
        0,
      ),
    };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        payment.id.toLowerCase().includes(searchValue) ||
        payment.orderId.toLowerCase().includes(searchValue) ||
        payment.customer.toLowerCase().includes(searchValue) ||
        payment.provider.toLowerCase().includes(searchValue) ||
        payment.transactionId.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || payment.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const updatePaymentStatus = (paymentId, newStatus) => {
    setPayments((currentPayments) =>
      currentPayments.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: newStatus,
            }
          : payment,
      ),
    );

    setOpenMenu(null);

    setSelectedPayment((currentPayment) => {
      if (!currentPayment || currentPayment.id !== paymentId) {
        return currentPayment;
      }

      return {
        ...currentPayment,
        status: newStatus,
      };
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Successful":
        return "payment-status-success";

      case "Pending":
        return "payment-status-pending";

      case "Failed":
        return "payment-status-failed";

      default:
        return "";
    }
  };

  return (
    <div className="payments-page">
      {/* Header */}
      <div className="payments-header">
        <div>
          <h1>Payments</h1>

          <p>
            Monitor payment transactions and their current status across the
            platform.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="payments-stats">
        <div className="payment-stat-card">
          <div className="payment-stat-icon total">
            <CreditCard size={20} />
          </div>

          <div>
            <span>Total Transactions</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-icon success">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Successful</span>
            <strong>{stats.successful}</strong>
          </div>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-icon pending">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{stats.pending}</strong>
          </div>
        </div>

        <div className="payment-stat-card">
          <div className="payment-stat-icon failed">
            <XCircle size={20} />
          </div>

          <div>
            <span>Failed</span>
            <strong>{stats.failed}</strong>
          </div>
        </div>

        <div className="payment-stat-card revenue-card">
          <div className="payment-stat-icon revenue">
            <WalletCards size={20} />
          </div>

          <div>
            <span>Successful Amount</span>

            <strong>{stats.revenue.toLocaleString()} EGP</strong>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="payments-toolbar">
        <div className="payments-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by payment, order, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="payments-filters">
          <div className="payment-filter-select">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </div>

          <div className="payment-filter-select">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              {methodOptions.map((method) => (
                <option key={method} value={method}>
                  {method === "All" ? "All Methods" : method}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="payments-table-card">
        <div className="payments-table-wrapper">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div className="payment-id-cell">
                        <div className="payment-icon">
                          <Receipt size={17} />
                        </div>

                        <div>
                          <strong>{payment.id}</strong>

                          <span>{payment.transactionId}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="payment-order-id">
                        {payment.orderId}
                      </span>
                    </td>

                    <td>
                      <div className="payment-person-cell">
                        <div className="payment-avatar">
                          {payment.customer.charAt(0)}
                        </div>

                        <span>{payment.customer}</span>
                      </div>
                    </td>

                    <td>
                      <div className="payment-provider">
                        <Store size={16} />

                        <span>{payment.provider}</span>
                      </div>
                    </td>

                    <td>
                      <strong className="payment-amount">
                        {payment.amount.toLocaleString()} EGP
                      </strong>
                    </td>

                    <td>
                      <span className="payment-method">{payment.method}</span>
                    </td>

                    <td>
                      <span
                        className={`payment-status ${getStatusClass(
                          payment.status,
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td>
                      <span className="payment-date">{payment.createdAt}</span>
                    </td>

                    <td>
                      <div className="payment-actions">
                        <button
                          className="payment-icon-action"
                          onClick={() => setSelectedPayment(payment)}
                          title="View payment"
                        >
                          <Eye size={17} />
                        </button>

                        <div className="payment-more-wrapper">
                          <button
                            className="payment-icon-action"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === payment.id ? null : payment.id,
                              )
                            }
                            title="More actions"
                          >
                            <MoreVertical size={17} />
                          </button>

                          {openMenu === payment.id && (
                            <div className="payment-action-menu">
                              <button
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setOpenMenu(null);
                                }}
                              >
                                View Details
                              </button>

                              {payment.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      updatePaymentStatus(
                                        payment.id,
                                        "Successful",
                                      )
                                    }
                                  >
                                    Mark Successful
                                  </button>

                                  <button
                                    className="danger-payment-action"
                                    onClick={() =>
                                      updatePaymentStatus(payment.id, "Failed")
                                    }
                                  >
                                    Mark Failed
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">
                    <div className="payments-empty">
                      <div className="payments-empty-icon">
                        <CreditCard size={26} />
                      </div>

                      <h3>No payments found</h3>

                      <p>Try changing your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="payments-table-footer">
          <span>
            Showing {filteredPayments.length} of {payments.length} transactions
          </span>

          <div className="payments-pagination">
            <button disabled>Previous</button>
            <button className="active-payment-page">1</button>
            <button>2</button>
            <button>3</button>
            <button>Next</button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedPayment && (
        <div
          className="payment-modal-overlay"
          onClick={() => setSelectedPayment(null)}
        >
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <div>
                <span>Payment Details</span>

                <h2>{selectedPayment.id}</h2>
              </div>

              <button
                className="payment-modal-close"
                onClick={() => setSelectedPayment(null)}
              >
                ×
              </button>
            </div>

            <div className="payment-modal-body">
              {/* Summary */}
              <div className="payment-summary">
                <div>
                  <span>Amount</span>

                  <strong>{selectedPayment.amount.toLocaleString()} EGP</strong>
                </div>

                <div>
                  <span>Method</span>

                  <strong>{selectedPayment.method}</strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong className={getStatusClass(selectedPayment.status)}>
                    {selectedPayment.status}
                  </strong>
                </div>
              </div>

              {/* Transaction */}
              <div className="payment-modal-section">
                <div className="payment-section-title">
                  <Receipt size={17} />

                  <h3>Transaction Information</h3>
                </div>

                <div className="payment-details-grid">
                  <div>
                    <span>Payment ID</span>

                    <strong>{selectedPayment.id}</strong>
                  </div>

                  <div>
                    <span>Transaction ID</span>

                    <strong>{selectedPayment.transactionId}</strong>
                  </div>

                  <div>
                    <span>Order ID</span>

                    <strong>{selectedPayment.orderId}</strong>
                  </div>

                  <div>
                    <span>Created At</span>

                    <strong>{selectedPayment.createdAt}</strong>
                  </div>
                </div>
              </div>

              {/* Customer / Provider */}
              <div className="payment-modal-section">
                <div className="payment-section-title">
                  <User size={17} />

                  <h3>Customer & Provider</h3>
                </div>

                <div className="payment-parties">
                  <div>
                    <span>Customer</span>

                    <strong>{selectedPayment.customer}</strong>
                  </div>

                  <div>
                    <span>Provider</span>

                    <strong>{selectedPayment.provider}</strong>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="payment-modal-section">
                <div className="payment-section-title">
                  <CalendarDays size={17} />

                  <h3>Payment Status</h3>
                </div>

                <div className="payment-status-box">
                  <div
                    className={`payment-status-large ${getStatusClass(
                      selectedPayment.status,
                    )}`}
                  >
                    {selectedPayment.status === "Successful" && (
                      <CheckCircle2 size={20} />
                    )}

                    {selectedPayment.status === "Pending" && (
                      <Clock3 size={20} />
                    )}

                    {selectedPayment.status === "Failed" && (
                      <XCircle size={20} />
                    )}

                    <span>{selectedPayment.status}</span>
                  </div>

                  <p>
                    Payment status is currently{" "}
                    {selectedPayment.status.toLowerCase()}.
                  </p>
                </div>
              </div>
            </div>

            <div className="payment-modal-footer">
              <button
                className="payment-secondary-button"
                onClick={() => setSelectedPayment(null)}
              >
                Close
              </button>

              {selectedPayment.status === "Pending" && (
                <button
                  className="payment-primary-button"
                  onClick={() =>
                    updatePaymentStatus(selectedPayment.id, "Successful")
                  }
                >
                  Mark Successful
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;
