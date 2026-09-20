import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  Clock3,
  AlertCircle,
  XCircle,
  MessageSquareWarning,
  User,
  Store,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Complaints.css";

const initialComplaints = [
  {
    id: "CMP-2041",
    complainant: "Ahmed Hassan",
    complainantType: "Client",
    against: "Smart Store",
    againstType: "Provider",
    orderId: "#ORD-10482",
    category: "Order Issue",
    subject: "Product arrived damaged",
    description:
      "The customer reported that the product arrived with visible damage and requested a resolution.",
    date: "2026-09-18",
    priority: "High",
    status: "Open",
  },
  {
    id: "CMP-2040",
    complainant: "Mariam Ali",
    complainantType: "Client",
    against: "Fresh Market",
    againstType: "Provider",
    orderId: "#ORD-10481",
    category: "Delivery",
    subject: "Order was delayed",
    description:
      "The customer reported that the order arrived later than the expected delivery time.",
    date: "2026-09-17",
    priority: "Medium",
    status: "Under Review",
  },
  {
    id: "CMP-2039",
    complainant: "Omar Khaled",
    complainantType: "Client",
    against: "Delivery - Mahmoud Ali",
    againstType: "Delivery",
    orderId: "#ORD-10480",
    category: "Delivery Behavior",
    subject: "Issue with delivery interaction",
    description:
      "The customer submitted a complaint regarding the delivery interaction during the order.",
    date: "2026-09-17",
    priority: "High",
    status: "Open",
  },
  {
    id: "CMP-2038",
    complainant: "Nour Ahmed",
    complainantType: "Client",
    against: "Home Experts",
    againstType: "Provider",
    orderId: "#ORD-10479",
    category: "Service Issue",
    subject: "Service request was not accepted",
    description:
      "The customer reported that the requested service was not handled within the expected time.",
    date: "2026-09-16",
    priority: "Medium",
    status: "Resolved",
  },
  {
    id: "CMP-2037",
    complainant: "Tech World",
    complainantType: "Provider",
    against: "Delivery - Mohamed Samir",
    againstType: "Delivery",
    orderId: "#ORD-10478",
    category: "Delivery",
    subject: "Pickup delay",
    description: "The provider reported a delay in the pickup process.",
    date: "2026-09-16",
    priority: "Low",
    status: "Resolved",
  },
  {
    id: "CMP-2036",
    complainant: "Salma Mahmoud",
    complainantType: "Client",
    against: "Learn Academy",
    againstType: "Provider",
    orderId: "#ORD-10477",
    category: "Service Quality",
    subject: "Issue with booked service",
    description:
      "The customer reported an issue related to the quality of the booked service.",
    date: "2026-09-15",
    priority: "Medium",
    status: "Closed",
  },
  {
    id: "CMP-2035",
    complainant: "Mostafa Adel",
    complainantType: "Client",
    against: "Fashion House",
    againstType: "Provider",
    orderId: "#ORD-10476",
    category: "Payment",
    subject: "Payment issue",
    description:
      "The customer reported an issue related to the payment and requested an investigation.",
    date: "2026-09-15",
    priority: "High",
    status: "Under Review",
  },
  {
    id: "CMP-2034",
    complainant: "Aya Samir",
    complainantType: "Provider",
    against: "Green Pharmacy",
    againstType: "Provider",
    orderId: "#ORD-10475",
    category: "Platform Issue",
    subject: "Issue with order processing",
    description:
      "A provider reported an issue during the order processing flow.",
    date: "2026-09-14",
    priority: "Low",
    status: "Closed",
  },
];

const statusOptions = ["All", "Open", "Under Review", "Resolved", "Closed"];
const priorityOptions = ["All", "High", "Medium", "Low"];

const getStatusClass = (status) => {
  switch (status) {
    case "Open":
      return "status-open";
    case "Under Review":
      return "status-review";
    case "Resolved":
      return "status-resolved";
    case "Closed":
      return "status-closed";
    default:
      return "";
  }
};

const getPriorityClass = (priority) => {
  switch (priority) {
    case "High":
      return "priority-high";
    case "Medium":
      return "priority-medium";
    case "Low":
      return "priority-low";
    default:
      return "";
  }
};

const getPersonIcon = (type) => {
  if (type === "Provider") return <Store size={15} />;
  if (type === "Delivery") return <Truck size={15} />;
  return <User size={15} />;
};

const formatDate = (date) => {
  const formatted = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formatted;
};

export default function Complaints() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        complaint.id.toLowerCase().includes(searchValue) ||
        complaint.complainant.toLowerCase().includes(searchValue) ||
        complaint.against.toLowerCase().includes(searchValue) ||
        complaint.subject.toLowerCase().includes(searchValue) ||
        complaint.orderId.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || complaint.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || complaint.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, search, statusFilter, priorityFilter]);

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      open: complaints.filter((item) => item.status === "Open").length,
      review: complaints.filter((item) => item.status === "Under Review")
        .length,
      resolved: complaints.filter((item) => item.status === "Resolved").length,
      highPriority: complaints.filter((item) => item.priority === "High")
        .length,
    };
  }, [complaints]);

  const updateComplaintStatus = (id, status) => {
    setComplaints((current) =>
      current.map((complaint) =>
        complaint.id === id
          ? {
              ...complaint,
              status,
            }
          : complaint,
      ),
    );

    setSelectedComplaint((current) =>
      current?.id === id
        ? {
            ...current,
            status,
          }
        : current,
    );
  };

  return (
    <div className="complaints-page">
      <div className="complaints-header">
        <div>
          <h1>Complaints</h1>
          <p>Review and manage customer and provider complaints.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="complaints-stats">
        <div className="complaint-stat-card">
          <div className="complaint-stat-icon total">
            <MessageSquareWarning size={20} />
          </div>

          <div>
            <span>Total Complaints</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="complaint-stat-card">
          <div className="complaint-stat-icon open">
            <AlertCircle size={20} />
          </div>

          <div>
            <span>Open</span>
            <strong>{stats.open}</strong>
          </div>
        </div>

        <div className="complaint-stat-card">
          <div className="complaint-stat-icon review">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Under Review</span>
            <strong>{stats.review}</strong>
          </div>
        </div>

        <div className="complaint-stat-card">
          <div className="complaint-stat-icon resolved">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Resolved</span>
            <strong>{stats.resolved}</strong>
          </div>
        </div>

        <div className="complaint-stat-card">
          <div className="complaint-stat-icon high">
            <AlertCircle size={20} />
          </div>

          <div>
            <span>High Priority</span>
            <strong>{stats.highPriority}</strong>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="complaints-toolbar">
        <div className="complaints-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by complaint, user, provider or order..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="complaints-filters">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All Statuses" : status}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority === "All" ? "All Priorities" : `${priority} Priority`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="complaints-card">
        <div className="complaints-table-wrapper">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>Complaint</th>
                <th>From</th>
                <th>Against</th>
                <th>Order</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>
                      <div className="complaint-main">
                        <strong>{complaint.subject}</strong>
                        <span>{complaint.id}</span>
                      </div>
                    </td>

                    <td>
                      <div className="person-cell">
                        <div className="person-icon">
                          {getPersonIcon(complaint.complainantType)}
                        </div>

                        <div>
                          <strong>{complaint.complainant}</strong>
                          <span>{complaint.complainantType}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="person-cell">
                        <div className="person-icon">
                          {getPersonIcon(complaint.againstType)}
                        </div>

                        <div>
                          <strong>{complaint.against}</strong>
                          <span>{complaint.againstType}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="order-id">{complaint.orderId}</span>
                    </td>

                    <td>
                      <span
                        className={`priority-badge ${getPriorityClass(
                          complaint.priority,
                        )}`}
                      >
                        {complaint.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          complaint.status,
                        )}`}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    <td>
                      <span className="date-cell">
                        {formatDate(complaint.date)}
                      </span>
                    </td>

                    <td>
                      <button
                        className="icon-action-button"
                        onClick={() => setSelectedComplaint(complaint)}
                        title="View complaint"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <MessageSquareWarning size={38} />
                      <h3>No complaints found</h3>
                      <p>Try changing your search or filter options.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="complaints-pagination">
          <span>
            Showing {filteredComplaints.length} of {complaints.length}{" "}
            complaints
          </span>

          <div className="pagination-buttons">
            <button disabled>
              <ChevronLeft size={16} />
            </button>

            <button className="active">1</button>

            <button disabled>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedComplaint && (
        <div
          className="complaint-modal-overlay"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="complaint-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="complaint-modal-header">
              <div>
                <span className="modal-label">{selectedComplaint.id}</span>
                <h2>{selectedComplaint.subject}</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedComplaint(null)}
              >
                <XCircle size={21} />
              </button>
            </div>

            <div className="complaint-modal-content">
              <div className="complaint-info-grid">
                <div className="info-item">
                  <span>Category</span>
                  <strong>{selectedComplaint.category}</strong>
                </div>

                <div className="info-item">
                  <span>Order</span>
                  <strong>{selectedComplaint.orderId}</strong>
                </div>

                <div className="info-item">
                  <span>Date</span>
                  <strong>{formatDate(selectedComplaint.date)}</strong>
                </div>

                <div className="info-item">
                  <span>Priority</span>
                  <strong
                    className={getPriorityClass(selectedComplaint.priority)}
                  >
                    {selectedComplaint.priority}
                  </strong>
                </div>
              </div>

              <div className="complaint-people">
                <div className="complaint-person-card">
                  <span>Complaint From</span>

                  <div className="modal-person">
                    <div className="modal-person-icon">
                      {getPersonIcon(selectedComplaint.complainantType)}
                    </div>

                    <div>
                      <strong>{selectedComplaint.complainant}</strong>
                      <span>{selectedComplaint.complainantType}</span>
                    </div>
                  </div>
                </div>

                <div className="complaint-person-card">
                  <span>Complaint Against</span>

                  <div className="modal-person">
                    <div className="modal-person-icon">
                      {getPersonIcon(selectedComplaint.againstType)}
                    </div>

                    <div>
                      <strong>{selectedComplaint.against}</strong>
                      <span>{selectedComplaint.againstType}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="description-box">
                <span>Description</span>
                <p>{selectedComplaint.description}</p>
              </div>

              <div className="status-management">
                <div>
                  <span>Current Status</span>
                  <strong
                    className={`status-badge ${getStatusClass(
                      selectedComplaint.status,
                    )}`}
                  >
                    {selectedComplaint.status}
                  </strong>
                </div>

                <div className="status-actions">
                  {selectedComplaint.status !== "Under Review" && (
                    <button
                      className="secondary-action"
                      onClick={() =>
                        updateComplaintStatus(
                          selectedComplaint.id,
                          "Under Review",
                        )
                      }
                    >
                      <Clock3 size={16} />
                      Review
                    </button>
                  )}

                  {selectedComplaint.status !== "Resolved" && (
                    <button
                      className="success-action"
                      onClick={() =>
                        updateComplaintStatus(selectedComplaint.id, "Resolved")
                      }
                    >
                      <CheckCircle2 size={16} />
                      Resolve
                    </button>
                  )}

                  {selectedComplaint.status !== "Closed" && (
                    <button
                      className="danger-action"
                      onClick={() =>
                        updateComplaintStatus(selectedComplaint.id, "Closed")
                      }
                    >
                      <XCircle size={16} />
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
