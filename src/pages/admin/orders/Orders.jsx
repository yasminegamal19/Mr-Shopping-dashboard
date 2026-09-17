import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  MoreVertical,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  MapPin,
  CreditCard,
  User,
  Store,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import "./Orders.css";

const initialOrders = [
  {
    id: "#ORD-10482",
    customer: "Ahmed Hassan",
    customerPhone: "01012345678",
    provider: "Smart Store",
    type: "Product",
    item: "iPhone 15 Pro",
    quantity: 1,
    amount: 48500,
    payment: "Paid",
    paymentMethod: "Bank Wallet",
    status: "Completed",
    deliveryStatus: "Delivered",
    address: "Nasr City, Cairo",
    createdAt: "17 Sep 2026, 09:42 AM",
    hasDelivery: true,
  },
  {
    id: "#ORD-10481",
    customer: "Mariam Ali",
    customerPhone: "01123456789",
    provider: "Fresh Market",
    type: "Product",
    item: "Fresh Grocery Package",
    quantity: 3,
    amount: 1250,
    payment: "Paid",
    paymentMethod: "Fawry",
    status: "Out for Delivery",
    deliveryStatus: "Picked Up",
    address: "Maadi, Cairo",
    createdAt: "17 Sep 2026, 08:15 AM",
    hasDelivery: true,
  },
  {
    id: "#ORD-10480",
    customer: "Omar Khaled",
    customerPhone: "01234567890",
    provider: "Dr. Sara Clinic",
    type: "Service",
    item: "Doctor Consultation",
    quantity: 1,
    amount: 500,
    payment: "Paid",
    paymentMethod: "Bank Wallet",
    status: "Accepted",
    deliveryStatus: "Not Required",
    address: "Heliopolis, Cairo",
    createdAt: "16 Sep 2026, 06:30 PM",
    hasDelivery: false,
  },
  {
    id: "#ORD-10479",
    customer: "Nour Ahmed",
    customerPhone: "01098765432",
    provider: "Home Experts",
    type: "Service",
    item: "Plumbing Service",
    quantity: 1,
    amount: 350,
    payment: "Pending",
    paymentMethod: "Fawry",
    status: "Pending",
    deliveryStatus: "Not Required",
    address: "6th of October, Giza",
    createdAt: "16 Sep 2026, 04:12 PM",
    hasDelivery: false,
  },
  {
    id: "#ORD-10478",
    customer: "Youssef Mohamed",
    customerPhone: "01567890123",
    provider: "Tech World",
    type: "Product",
    item: "MacBook Air M3",
    quantity: 1,
    amount: 62000,
    payment: "Paid",
    paymentMethod: "Bank Wallet",
    status: "Preparing",
    deliveryStatus: "Waiting for Pickup",
    address: "Dokki, Giza",
    createdAt: "16 Sep 2026, 02:45 PM",
    hasDelivery: true,
  },
  {
    id: "#ORD-10477",
    customer: "Salma Mahmoud",
    customerPhone: "01044556677",
    provider: "Learn Academy",
    type: "Service",
    item: "Private Tutoring",
    quantity: 1,
    amount: 700,
    payment: "Paid",
    paymentMethod: "Fawry",
    status: "Completed",
    deliveryStatus: "Not Required",
    address: "Zamalek, Cairo",
    createdAt: "15 Sep 2026, 11:20 AM",
    hasDelivery: false,
  },
  {
    id: "#ORD-10476",
    customer: "Mostafa Adel",
    customerPhone: "01177889900",
    provider: "Fashion House",
    type: "Product",
    item: "Men's Casual Collection",
    quantity: 2,
    amount: 2400,
    payment: "Failed",
    paymentMethod: "Fawry",
    status: "Cancelled",
    deliveryStatus: "Not Required",
    address: "Giza, Egypt",
    createdAt: "15 Sep 2026, 09:10 AM",
    hasDelivery: false,
  },
  {
    id: "#ORD-10475",
    customer: "Aya Samir",
    customerPhone: "01299887766",
    provider: "Green Pharmacy",
    type: "Product",
    item: "Health & Care Products",
    quantity: 4,
    amount: 980,
    payment: "Paid",
    paymentMethod: "Bank Wallet",
    status: "Ready",
    deliveryStatus: "Waiting for Pickup",
    address: "Mohandessin, Giza",
    createdAt: "14 Sep 2026, 07:55 PM",
    hasDelivery: true,
  },
];

const statusOptions = [
  "All",
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Completed",
  "Cancelled",
];

const typeOptions = ["All", "Product", "Service"];

const paymentOptions = ["All", "Paid", "Pending", "Failed"];

function Orders() {
  const [orders, setOrders] = useState(initialOrders);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === "Pending").length,
      inProgress: orders.filter(
        (order) =>
          order.status === "Accepted" ||
          order.status === "Preparing" ||
          order.status === "Ready" ||
          order.status === "Out for Delivery",
      ).length,
      completed: orders.filter((order) => order.status === "Completed").length,
      cancelled: orders.filter((order) => order.status === "Cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(searchValue) ||
        order.customer.toLowerCase().includes(searchValue) ||
        order.provider.toLowerCase().includes(searchValue) ||
        order.item.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const matchesType = typeFilter === "All" || order.type === typeFilter;

      const matchesPayment =
        paymentFilter === "All" || order.payment === paymentFilter;

      return matchesSearch && matchesStatus && matchesType && matchesPayment;
    });
  }, [orders, search, statusFilter, typeFilter, paymentFilter]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId) return order;

        let deliveryStatus = order.deliveryStatus;

        if (newStatus === "Out for Delivery") {
          deliveryStatus = "Picked Up";
        }

        if (newStatus === "Completed" && order.hasDelivery) {
          deliveryStatus = "Delivered";
        }

        if (newStatus === "Cancelled") {
          deliveryStatus = "Not Required";
        }

        return {
          ...order,
          status: newStatus,
          deliveryStatus,
        };
      }),
    );

    setOpenMenu(null);

    setSelectedOrder((currentOrder) => {
      if (!currentOrder || currentOrder.id !== orderId) {
        return currentOrder;
      }

      return {
        ...currentOrder,
        status: newStatus,
      };
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "status-success";

      case "Pending":
        return "status-warning";

      case "Cancelled":
        return "status-danger";

      case "Out for Delivery":
        return "status-info";

      default:
        return "status-primary";
    }
  };

  const getPaymentClass = (payment) => {
    switch (payment) {
      case "Paid":
        return "payment-paid";

      case "Failed":
        return "payment-failed";

      default:
        return "payment-pending";
    }
  };

  const getTypeClass = (type) => {
    return type === "Product" ? "order-type-product" : "order-type-service";
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>
            Manage and monitor all orders and service bookings across the
            platform.
          </p>
        </div>
      </div>

      <div className="orders-stats">
        <div className="order-stat-card">
          <div className="order-stat-icon total">
            <ShoppingBag size={20} />
          </div>

          <div>
            <span>Total Orders</span>
            <strong>{stats.total.toLocaleString()}</strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon pending">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{stats.pending}</strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon progress">
            <Package size={20} />
          </div>

          <div>
            <span>In Progress</span>
            <strong>{stats.inProgress}</strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon completed">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon cancelled">
            <XCircle size={20} />
          </div>

          <div>
            <span>Cancelled</span>
            <strong>{stats.cancelled}</strong>
          </div>
        </div>
      </div>

      <div className="orders-toolbar">
        <div className="orders-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by order, customer, provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="orders-filters">
          <div className="filter-select">
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

          <div className="filter-select">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Types" : type}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </div>

          <div className="filter-select">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              {paymentOptions.map((payment) => (
                <option key={payment} value={payment}>
                  {payment === "All" ? "All Payments" : payment}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </div>
        </div>
      </div>

      <div className="orders-table-card">
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="order-id-cell">
                        <div className="order-icon">
                          {order.type === "Product" ? (
                            <ShoppingBag size={17} />
                          ) : (
                            <CalendarDays size={17} />
                          )}
                        </div>

                        <div>
                          <strong>{order.id}</strong>
                          <span>{order.item}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {order.customer.charAt(0)}
                        </div>

                        <div>
                          <strong>{order.customer}</strong>
                          <span>{order.customerPhone}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="provider-cell">
                        <Store size={16} />
                        <span>{order.provider}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`order-type ${getTypeClass(order.type)}`}
                      >
                        {order.type}
                      </span>
                    </td>

                    <td>
                      <strong className="order-amount">
                        {order.amount.toLocaleString()} EGP
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`payment-badge ${getPaymentClass(
                          order.payment,
                        )}`}
                      >
                        {order.payment}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <span className="order-date">{order.createdAt}</span>
                    </td>

                    <td>
                      <div className="order-actions">
                        <button
                          className="icon-action"
                          onClick={() => setSelectedOrder(order)}
                          title="View order"
                        >
                          <Eye size={17} />
                        </button>

                        <div className="more-action-wrapper">
                          <button
                            className="icon-action"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === order.id ? null : order.id,
                              )
                            }
                            title="More actions"
                          >
                            <MoreVertical size={17} />
                          </button>

                          {openMenu === order.id && (
                            <div className="order-action-menu">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setOpenMenu(null);
                                }}
                              >
                                View Details
                              </button>

                              {order.status === "Pending" && (
                                <button
                                  onClick={() =>
                                    updateOrderStatus(order.id, "Accepted")
                                  }
                                >
                                  Accept Order
                                </button>
                              )}

                              {order.status === "Accepted" && (
                                <button
                                  onClick={() =>
                                    updateOrderStatus(order.id, "Preparing")
                                  }
                                >
                                  Mark Preparing
                                </button>
                              )}

                              {order.status === "Preparing" && (
                                <button
                                  onClick={() =>
                                    updateOrderStatus(order.id, "Ready")
                                  }
                                >
                                  Mark Ready
                                </button>
                              )}

                              {order.status === "Ready" &&
                                order.hasDelivery && (
                                  <button
                                    onClick={() =>
                                      updateOrderStatus(
                                        order.id,
                                        "Out for Delivery",
                                      )
                                    }
                                  >
                                    Send for Delivery
                                  </button>
                                )}

                              {order.status === "Out for Delivery" && (
                                <button
                                  onClick={() =>
                                    updateOrderStatus(order.id, "Completed")
                                  }
                                >
                                  Mark Completed
                                </button>
                              )}

                              {!["Completed", "Cancelled"].includes(
                                order.status,
                              ) && (
                                <button
                                  className="danger-action"
                                  onClick={() =>
                                    updateOrderStatus(order.id, "Cancelled")
                                  }
                                >
                                  Cancel Order
                                </button>
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
                    <div className="orders-empty">
                      <div className="empty-icon">
                        <ShoppingBag size={26} />
                      </div>

                      <h3>No orders found</h3>

                      <p>Try changing your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="orders-table-footer">
          <span>
            Showing {filteredOrders.length} of {orders.length} orders
          </span>

          <div className="pagination">
            <button disabled>Previous</button>
            <button className="active-page">1</button>
            <button>2</button>
            <button>3</button>
            <button>Next</button>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-modal-header">
              <div>
                <span>Order Details</span>
                <h2>{selectedOrder.id}</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="order-modal-body">
              <div className="modal-order-summary">
                <div>
                  <span>Order Type</span>
                  <strong>{selectedOrder.type}</strong>
                </div>

                <div>
                  <span>Total Amount</span>
                  <strong>{selectedOrder.amount.toLocaleString()} EGP</strong>
                </div>

                <div>
                  <span>Payment</span>
                  <strong>{selectedOrder.payment}</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>{selectedOrder.status}</strong>
                </div>
              </div>

              <div className="modal-info-grid">
                <div className="modal-info-card">
                  <div className="modal-info-title">
                    <User size={17} />
                    <h3>Customer</h3>
                  </div>

                  <strong>{selectedOrder.customer}</strong>
                  <span>{selectedOrder.customerPhone}</span>
                </div>

                <div className="modal-info-card">
                  <div className="modal-info-title">
                    <Store size={17} />
                    <h3>Provider</h3>
                  </div>

                  <strong>{selectedOrder.provider}</strong>
                  <span>{selectedOrder.item}</span>
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-section-title">
                  <Package size={17} />
                  <h3>Order Information</h3>
                </div>

                <div className="modal-details-list">
                  <div>
                    <span>Item / Service</span>
                    <strong>{selectedOrder.item}</strong>
                  </div>

                  <div>
                    <span>Quantity</span>
                    <strong>{selectedOrder.quantity}</strong>
                  </div>

                  <div>
                    <span>Payment Method</span>
                    <strong>{selectedOrder.paymentMethod}</strong>
                  </div>

                  <div>
                    <span>Created At</span>
                    <strong>{selectedOrder.createdAt}</strong>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-section-title">
                  <MapPin size={17} />
                  <h3>Address</h3>
                </div>

                <p className="modal-address">{selectedOrder.address}</p>
              </div>

              {selectedOrder.hasDelivery && (
                <div className="modal-section">
                  <div className="modal-section-title">
                    <Truck size={17} />
                    <h3>Delivery</h3>
                  </div>

                  <div className="delivery-info">
                    <span>Delivery Status</span>
                    <strong>{selectedOrder.deliveryStatus}</strong>
                  </div>
                </div>
              )}

              {!selectedOrder.hasDelivery && (
                <div className="no-delivery-info">
                  <CalendarDays size={17} />
                  <span>This service does not require delivery.</span>
                </div>
              )}

              <div className="modal-section">
                <div className="modal-section-title">
                  <Clock3 size={17} />
                  <h3>Order Progress</h3>
                </div>

                <div className="order-timeline">
                  <div className="timeline-item completed">
                    <div className="timeline-dot">
                      <CheckCircle2 size={14} />
                    </div>

                    <div>
                      <strong>Order Created</strong>
                      <span>{selectedOrder.createdAt}</span>
                    </div>
                  </div>

                  <div
                    className={`timeline-item ${
                      [
                        "Accepted",
                        "Preparing",
                        "Ready",
                        "Out for Delivery",
                        "Completed",
                      ].includes(selectedOrder.status)
                        ? "completed"
                        : ""
                    }`}
                  >
                    <div className="timeline-dot">
                      <CheckCircle2 size={14} />
                    </div>

                    <div>
                      <strong>Accepted</strong>
                      <span>Provider accepted the order</span>
                    </div>
                  </div>

                  <div
                    className={`timeline-item ${
                      [
                        "Preparing",
                        "Ready",
                        "Out for Delivery",
                        "Completed",
                      ].includes(selectedOrder.status)
                        ? "completed"
                        : ""
                    }`}
                  >
                    <div className="timeline-dot">
                      <Package size={14} />
                    </div>

                    <div>
                      <strong>Preparing</strong>
                      <span>Provider is preparing the order</span>
                    </div>
                  </div>

                  {selectedOrder.hasDelivery && (
                    <div
                      className={`timeline-item ${
                        ["Out for Delivery", "Completed"].includes(
                          selectedOrder.status,
                        )
                          ? "completed"
                          : ""
                      }`}
                    >
                      <div className="timeline-dot">
                        <Truck size={14} />
                      </div>

                      <div>
                        <strong>Delivery</strong>
                        <span>Order is being delivered to customer</span>
                      </div>
                    </div>
                  )}

                  <div
                    className={`timeline-item ${
                      selectedOrder.status === "Completed" ? "completed" : ""
                    }`}
                  >
                    <div className="timeline-dot">
                      <CheckCircle2 size={14} />
                    </div>

                    <div>
                      <strong>Completed</strong>
                      <span>Order completed successfully</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-modal-footer">
              <button
                className="secondary-modal-button"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>

              {!["Completed", "Cancelled"].includes(selectedOrder.status) && (
                <button
                  className="primary-modal-button"
                  onClick={() => {
                    const nextStatus =
                      selectedOrder.status === "Pending"
                        ? "Accepted"
                        : selectedOrder.status === "Accepted"
                          ? "Preparing"
                          : selectedOrder.status === "Preparing"
                            ? "Ready"
                            : selectedOrder.status === "Ready" &&
                                selectedOrder.hasDelivery
                              ? "Out for Delivery"
                              : "Completed";

                    updateOrderStatus(selectedOrder.id, nextStatus);
                  }}
                >
                  Update Status
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
