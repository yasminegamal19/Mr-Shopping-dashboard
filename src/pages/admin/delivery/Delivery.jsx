import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Eye,
  FileCheck,
  Filter,
  MoreHorizontal,
  Search,
  ShieldAlert,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import "./Delivery.css";

const initialDelivery = [
  {
    id: 1,
    name: "محمد أحمد",
    phone: "01012345678",
    location: "الجيزة",
    plan: "Plan 2",
    planAr: "الخطة 2",
    status: "Active",
    statusAr: "نشط",
    verification: "Approved",
    verificationAr: "مقبول",
    joinedAt: "2026-01-15",
    documents: {
      id: "Submitted",
      license: "Submitted",
      criminalRecord: "Submitted",
      workCertificate: "Submitted",
    },
    completedOrders: 840,
    earnings: "18,450 EGP",
  },
  {
    id: 2,
    name: "عمر خالد",
    phone: "01123456789",
    location: "مدينة نصر",
    plan: "Plan 1",
    planAr: "الخطة 1",
    status: "Pending",
    statusAr: "قيد المراجعة",
    verification: "Pending",
    verificationAr: "قيد المراجعة",
    joinedAt: "2026-02-11",
    documents: {
      id: "Submitted",
      license: "Submitted",
      criminalRecord: "Submitted",
      workCertificate: "Missing",
    },
    completedOrders: 0,
    earnings: "0 EGP",
  },
  {
    id: 3,
    name: "يوسف محمود",
    phone: "01234567890",
    location: "المعادي",
    plan: "Plan 2",
    planAr: "الخطة 2",
    status: "Active",
    statusAr: "نشط",
    verification: "Approved",
    verificationAr: "مقبول",
    joinedAt: "2026-02-28",
    documents: {
      id: "Submitted",
      license: "Submitted",
      criminalRecord: "Submitted",
      workCertificate: "Submitted",
    },
    completedOrders: 620,
    earnings: "13,200 EGP",
  },
  {
    id: 4,
    name: "كريم حسن",
    phone: "01098765432",
    location: "6 أكتوبر",
    plan: "Plan 3",
    planAr: "الخطة 3",
    status: "Active",
    statusAr: "نشط",
    verification: "Approved",
    verificationAr: "مقبول",
    joinedAt: "2026-03-05",
    documents: {
      id: "Submitted",
      license: "Submitted",
      criminalRecord: "Submitted",
      workCertificate: "Submitted",
    },
    completedOrders: 1105,
    earnings: "25,700 EGP",
  },
  {
    id: 5,
    name: "حسام علي",
    phone: "01187654321",
    location: "الهرم",
    plan: "Plan 1",
    planAr: "الخطة 1",
    status: "Suspended",
    statusAr: "موقوف",
    verification: "Approved",
    verificationAr: "مقبول",
    joinedAt: "2026-03-22",
    documents: {
      id: "Submitted",
      license: "Submitted",
      criminalRecord: "Submitted",
      workCertificate: "Submitted",
    },
    completedOrders: 190,
    earnings: "4,800 EGP",
  },
  {
    id: 6,
    name: "عبدالله سامي",
    phone: "01211112222",
    location: "الدقي",
    plan: "Plan 2",
    planAr: "الخطة 2",
    status: "Pending",
    statusAr: "قيد المراجعة",
    verification: "Pending",
    verificationAr: "قيد المراجعة",
    joinedAt: "2026-04-03",
    documents: {
      id: "Submitted",
      license: "Submitted",
      criminalRecord: "Missing",
      workCertificate: "Submitted",
    },
    completedOrders: 0,
    earnings: "0 EGP",
  },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Pending", label: "Pending" },
  { value: "Suspended", label: "Suspended" },
];

const verificationOptions = [
  { value: "all", label: "All Verification" },
  { value: "Approved", label: "Approved" },
  { value: "Pending", label: "Pending" },
];

const planOptions = [
  { value: "all", label: "All Plans" },
  { value: "Plan 1", label: "Plan 1" },
  { value: "Plan 2", label: "Plan 2" },
  { value: "Plan 3", label: "Plan 3" },
];

function Delivery() {
  const [deliveryPeople, setDeliveryPeople] = useState(initialDelivery);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredDelivery = useMemo(() => {
    return deliveryPeople.filter((delivery) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        delivery.name.toLowerCase().includes(search) ||
        delivery.phone.includes(search) ||
        delivery.location.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" || delivery.status === statusFilter;

      const matchesVerification =
        verificationFilter === "all" ||
        delivery.verification === verificationFilter;

      const matchesPlan = planFilter === "all" || delivery.plan === planFilter;

      return (
        matchesSearch && matchesStatus && matchesVerification && matchesPlan
      );
    });
  }, [
    deliveryPeople,
    searchTerm,
    statusFilter,
    verificationFilter,
    planFilter,
  ]);

  const stats = useMemo(
    () => ({
      total: deliveryPeople.length,

      active: deliveryPeople.filter((item) => item.status === "Active").length,

      pending: deliveryPeople.filter((item) => item.status === "Pending")
        .length,

      suspended: deliveryPeople.filter((item) => item.status === "Suspended")
        .length,
    }),
    [deliveryPeople],
  );

  const updateDelivery = (id, updates) => {
    setDeliveryPeople((current) =>
      current.map((delivery) =>
        delivery.id === id ? { ...delivery, ...updates } : delivery,
      ),
    );
  };

  const handleApprove = (delivery) => {
    updateDelivery(delivery.id, {
      status: "Active",
      statusAr: "نشط",
      verification: "Approved",
      verificationAr: "مقبول",
    });

    setSelectedDelivery(null);
    setOpenMenuId(null);
  };

  const handleReject = (delivery) => {
    updateDelivery(delivery.id, {
      status: "Suspended",
      statusAr: "موقوف",
      verification: "Rejected",
      verificationAr: "مرفوض",
    });

    setSelectedDelivery(null);
    setOpenMenuId(null);
  };

  const handleToggleStatus = (delivery) => {
    const isActive = delivery.status === "Active";

    updateDelivery(delivery.id, {
      status: isActive ? "Suspended" : "Active",
      statusAr: isActive ? "موقوف" : "نشط",
    });

    setOpenMenuId(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setVerificationFilter("all");
    setPlanFilter("all");
  };

  const hasFilters =
    searchTerm ||
    statusFilter !== "all" ||
    verificationFilter !== "all" ||
    planFilter !== "all";

  return (
    <div className="delivery-page">
      <div className="delivery-header">
        <div className="delivery-title-row">
          <div className="delivery-title-icon">
            <FileCheck size={20} />
          </div>

          <div>
            <h1>Delivery</h1>
            <p>Manage delivery personnel, verification and account status.</p>
          </div>
        </div>
      </div>

      <div className="delivery-stats">
        <div className="delivery-stat-card">
          <div className="delivery-stat-icon total">
            <FileCheck size={20} />
          </div>

          <div>
            <span>Total Delivery</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="delivery-stat-card">
          <div className="delivery-stat-icon active">
            <UserCheck size={20} />
          </div>

          <div>
            <span>Active</span>
            <strong>{stats.active}</strong>
          </div>
        </div>

        <div className="delivery-stat-card">
          <div className="delivery-stat-icon pending">
            <ShieldAlert size={20} />
          </div>

          <div>
            <span>Pending Approval</span>
            <strong>{stats.pending}</strong>
          </div>
        </div>

        <div className="delivery-stat-card">
          <div className="delivery-stat-icon suspended">
            <UserX size={20} />
          </div>

          <div>
            <span>Suspended</span>
            <strong>{stats.suspended}</strong>
          </div>
        </div>
      </div>

      <div className="delivery-toolbar">
        <div className="delivery-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search delivery..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="delivery-filters">
          <div className="delivery-select">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>

          <div className="delivery-select">
            <select
              value={verificationFilter}
              onChange={(event) => setVerificationFilter(event.target.value)}
            >
              {verificationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>

          <div className="delivery-select">
            <select
              value={planFilter}
              onChange={(event) => setPlanFilter(event.target.value)}
            >
              {planOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>

          {hasFilters && (
            <button
              type="button"
              className="clear-delivery-filters"
              onClick={clearFilters}
            >
              <Filter size={15} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="delivery-results">
        Showing <strong>{filteredDelivery.length}</strong> of{" "}
        <strong>{deliveryPeople.length}</strong> delivery personnel
      </div>

      <div className="delivery-table-card">
        <div className="delivery-table-wrapper">
          <table className="delivery-table">
            <thead>
              <tr>
                <th>Delivery Person</th>
                <th>Location</th>
                <th>Plan</th>
                <th>Documents</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredDelivery.length > 0 ? (
                filteredDelivery.map((delivery) => (
                  <tr key={delivery.id}>
                    <td>
                      <div className="delivery-person">
                        <div className="delivery-avatar">
                          {delivery.name.charAt(0)}
                        </div>

                        <div>
                          <strong>{delivery.name}</strong>
                          <span>{delivery.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td>{delivery.location}</td>

                    <td>
                      <span className="delivery-plan-badge">
                        {delivery.planAr}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`documents-badge ${
                          Object.values(delivery.documents).every(
                            (document) => document === "Submitted",
                          )
                            ? "complete"
                            : "incomplete"
                        }`}
                      >
                        {
                          Object.values(delivery.documents).filter(
                            (document) => document === "Submitted",
                          ).length
                        }
                        /4
                      </span>
                    </td>

                    <td>
                      <span
                        className={`delivery-verification ${delivery.verification.toLowerCase()}`}
                      >
                        <span className="delivery-dot"></span>
                        {delivery.verificationAr}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`delivery-status ${delivery.status.toLowerCase()}`}
                      >
                        <span className="delivery-dot"></span>
                        {delivery.statusAr}
                      </span>
                    </td>

                    <td>
                      <strong className="delivery-orders">
                        {delivery.completedOrders.toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <span className="delivery-date">{delivery.joinedAt}</span>
                    </td>

                    <td>
                      <div className="delivery-actions">
                        <button
                          type="button"
                          className="delivery-icon-btn"
                          title="View Details"
                          onClick={() => setSelectedDelivery(delivery)}
                        >
                          <Eye size={17} />
                        </button>

                        <div className="delivery-menu-wrapper">
                          <button
                            type="button"
                            className="delivery-icon-btn"
                            title="More"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === delivery.id ? null : delivery.id,
                              )
                            }
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openMenuId === delivery.id && (
                            <div className="delivery-action-menu">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDelivery(delivery);
                                  setOpenMenuId(null);
                                }}
                              >
                                <Eye size={15} />
                                View Details
                              </button>

                              {delivery.verification === "Pending" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(delivery)}
                                  >
                                    <Check size={15} />
                                    Approve
                                  </button>

                                  <button
                                    type="button"
                                    className="danger"
                                    onClick={() => handleReject(delivery)}
                                  >
                                    <X size={15} />
                                    Reject
                                  </button>
                                </>
                              )}

                              {delivery.status === "Active" ? (
                                <button
                                  type="button"
                                  className="danger"
                                  onClick={() => handleToggleStatus(delivery)}
                                >
                                  <UserX size={15} />
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(delivery)}
                                >
                                  <UserCheck size={15} />
                                  Activate
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
                    <div className="delivery-empty">
                      <div className="delivery-empty-icon">
                        <FileCheck size={24} />
                      </div>

                      <h3>No delivery personnel found</h3>

                      <p>Try changing your search or filters.</p>

                      {hasFilters && (
                        <button type="button" onClick={clearFilters}>
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredDelivery.length > 0 && (
          <div className="delivery-pagination">
            <span>
              Showing 1-{filteredDelivery.length} of {filteredDelivery.length}
            </span>

            <div>
              <button type="button" disabled>
                Previous
              </button>

              <button type="button" className="active-page">
                1
              </button>

              <button type="button" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedDelivery && (
        <div
          className="delivery-modal-overlay"
          onClick={() => setSelectedDelivery(null)}
        >
          <div
            className="delivery-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="delivery-modal-header">
              <div>
                <span>Delivery Details</span>
                <h2>{selectedDelivery.name}</h2>
                <p>{selectedDelivery.phone}</p>
              </div>

              <button
                type="button"
                className="delivery-close-btn"
                onClick={() => setSelectedDelivery(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="delivery-modal-body">
              <div className="delivery-modal-section">
                <div className="delivery-section-title">
                  <h3>Overview</h3>
                </div>

                <div className="delivery-info-grid">
                  <div>
                    <span>Name</span>
                    <strong>{selectedDelivery.name}</strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>{selectedDelivery.phone}</strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>{selectedDelivery.location}</strong>
                  </div>

                  <div>
                    <span>Joined Date</span>
                    <strong>{selectedDelivery.joinedAt}</strong>
                  </div>

                  <div>
                    <span>Completed Orders</span>
                    <strong>
                      {selectedDelivery.completedOrders.toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>Earnings</span>
                    <strong>{selectedDelivery.earnings}</strong>
                  </div>
                </div>
              </div>

              <div className="delivery-modal-section">
                <div className="delivery-section-title">
                  <div>
                    <h3>Required Documents</h3>
                    <p>Documents required during delivery registration.</p>
                  </div>
                </div>

                <div className="documents-list">
                  <DocumentRow
                    title="National ID"
                    status={selectedDelivery.documents.id}
                  />

                  <DocumentRow
                    title="Driving License"
                    status={selectedDelivery.documents.license}
                  />

                  <DocumentRow
                    title="Criminal Record"
                    status={selectedDelivery.documents.criminalRecord}
                  />

                  <DocumentRow
                    title="Work Certificate"
                    status={selectedDelivery.documents.workCertificate}
                  />
                </div>
              </div>

              <div className="delivery-plan-section">
                <div>
                  <span>Current Plan</span>
                  <strong>{selectedDelivery.planAr}</strong>
                </div>

                <span className="delivery-plan-large">
                  {selectedDelivery.plan}
                </span>
              </div>
            </div>

            <div className="delivery-modal-footer">
              {selectedDelivery.verification === "Pending" && (
                <>
                  <button
                    type="button"
                    className="delivery-footer-reject"
                    onClick={() => handleReject(selectedDelivery)}
                  >
                    <X size={16} />
                    Reject
                  </button>

                  <button
                    type="button"
                    className="delivery-footer-approve"
                    onClick={() => handleApprove(selectedDelivery)}
                  >
                    <Check size={16} />
                    Approve
                  </button>
                </>
              )}

              {selectedDelivery.verification !== "Pending" && (
                <button
                  type="button"
                  className="delivery-footer-close"
                  onClick={() => setSelectedDelivery(null)}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentRow({ title, status }) {
  const submitted = status === "Submitted";

  return (
    <div className="document-row">
      <div className="document-row-left">
        <div
          className={`document-status-icon ${
            submitted ? "submitted" : "missing"
          }`}
        >
          {submitted ? <Check size={15} /> : <X size={15} />}
        </div>

        <span>{title}</span>
      </div>

      <span
        className={`document-status-text ${
          submitted ? "submitted" : "missing"
        }`}
      >
        {submitted ? "Submitted" : "Missing"}
      </span>
    </div>
  );
}

export default Delivery;
