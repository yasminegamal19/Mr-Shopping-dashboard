import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronDown,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Store,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import "./Providers.css";

const initialProviders = [
  {
    id: 1,
    name: "صيدلية الشفاء",
    owner: "أحمد محمد",
    type: "Pharmacy",
    typeAr: "صيدلية",
    email: "alshifa@example.com",
    phone: "01012345678",
    location: "الجيزة",
    plan: "Plan 3",
    planAr: "الخطة 3",
    verification: "Verified",
    verificationAr: "موثق",
    status: "Active",
    statusAr: "نشط",
    orders: 1250,
    joinedAt: "2026-01-12",
  },
  {
    id: 2,
    name: "مطعم البيت السوري",
    owner: "محمد خالد",
    type: "Restaurant",
    typeAr: "مطعم",
    email: "baytshami@example.com",
    phone: "01123456789",
    location: "مدينة نصر",
    plan: "Plan 2",
    planAr: "الخطة 2",
    verification: "Not Verified",
    verificationAr: "غير موثق",
    status: "Active",
    statusAr: "نشط",
    orders: 845,
    joinedAt: "2026-02-03",
  },
  {
    id: 3,
    name: "عيادة د. سارة",
    owner: "د. سارة علي",
    type: "Doctor",
    typeAr: "طبيب",
    email: "sara.clinic@example.com",
    phone: "01234567890",
    location: "المعادي",
    plan: "Plan 3",
    planAr: "الخطة 3",
    verification: "Pending",
    verificationAr: "قيد المراجعة",
    status: "Active",
    statusAr: "نشط",
    orders: 420,
    joinedAt: "2026-02-18",
  },
  {
    id: 4,
    name: "مدرسة المستقبل",
    owner: "محمود حسن",
    type: "Teacher",
    typeAr: "مدرس",
    email: "future.teacher@example.com",
    phone: "01098765432",
    location: "6 أكتوبر",
    plan: "Plan 2",
    planAr: "الخطة 2",
    verification: "Verified",
    verificationAr: "موثق",
    status: "Active",
    statusAr: "نشط",
    orders: 315,
    joinedAt: "2026-03-01",
  },
  {
    id: 5,
    name: "سباك إكسبريس",
    owner: "حسام إبراهيم",
    type: "Plumber",
    typeAr: "سباك",
    email: "plumber.express@example.com",
    phone: "01187654321",
    location: "الهرم",
    plan: "Plan 1",
    planAr: "الخطة 1",
    verification: "Pending",
    verificationAr: "قيد المراجعة",
    status: "Active",
    statusAr: "نشط",
    orders: 95,
    joinedAt: "2026-03-15",
  },
  {
    id: 6,
    name: "Fashion House",
    owner: "منة أحمد",
    type: "Clothing Store",
    typeAr: "محل ملابس",
    email: "fashion@example.com",
    phone: "01211112222",
    location: "الزمالك",
    plan: "Plan 3",
    planAr: "الخطة 3",
    verification: "Verified",
    verificationAr: "موثق",
    status: "Active",
    statusAr: "نشط",
    orders: 760,
    joinedAt: "2026-04-02",
  },
  {
    id: 7,
    name: "صيدلية الرحمة",
    owner: "خالد مصطفى",
    type: "Pharmacy",
    typeAr: "صيدلية",
    email: "rahma.pharmacy@example.com",
    phone: "01055556666",
    location: "فيصل",
    plan: "Plan 1",
    planAr: "الخطة 1",
    verification: "Rejected",
    verificationAr: "مرفوض",
    status: "Inactive",
    statusAr: "غير نشط",
    orders: 64,
    joinedAt: "2026-04-10",
  },
  {
    id: 8,
    name: "د. أحمد الطبي",
    owner: "د. أحمد سامي",
    type: "Doctor",
    typeAr: "طبيب",
    email: "ahmed.doctor@example.com",
    phone: "01144445555",
    location: "الدقي",
    plan: "Plan 2",
    planAr: "الخطة 2",
    verification: "Verified",
    verificationAr: "موثق",
    status: "Inactive",
    statusAr: "غير نشط",
    orders: 210,
    joinedAt: "2026-05-06",
  },
];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "Doctor", label: "Doctor" },
  { value: "Pharmacy", label: "Pharmacy" },
  { value: "Restaurant", label: "Restaurant" },
  { value: "Teacher", label: "Teacher" },
  { value: "Plumber", label: "Plumber" },
  { value: "Clothing Store", label: "Clothing Store" },
];

const verificationOptions = [
  { value: "all", label: "All Verification" },
  { value: "Verified", label: "Verified" },
  { value: "Pending", label: "Pending" },
  { value: "Rejected", label: "Rejected" },
  { value: "Not Verified", label: "Not Verified" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const planOptions = [
  { value: "all", label: "All Plans" },
  { value: "Plan 1", label: "Plan 1" },
  { value: "Plan 2", label: "Plan 2" },
  { value: "Plan 3", label: "Plan 3" },
];

function Providers() {
  const [providers, setProviders] = useState(initialProviders);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const navigate = useNavigate();

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        provider.name.toLowerCase().includes(search) ||
        provider.owner.toLowerCase().includes(search) ||
        provider.email.toLowerCase().includes(search) ||
        provider.phone.includes(search);

      const matchesType = typeFilter === "all" || provider.type === typeFilter;

      const matchesVerification =
        verificationFilter === "all" ||
        provider.verification === verificationFilter;

      const matchesStatus =
        statusFilter === "all" || provider.status === statusFilter;

      const matchesPlan = planFilter === "all" || provider.plan === planFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesVerification &&
        matchesStatus &&
        matchesPlan
      );
    });
  }, [
    providers,
    searchTerm,
    typeFilter,
    verificationFilter,
    statusFilter,
    planFilter,
  ]);

  const stats = useMemo(() => {
    return {
      total: providers.length,
      active: providers.filter((provider) => provider.status === "Active")
        .length,
      pending: providers.filter(
        (provider) => provider.verification === "Pending",
      ).length,
      verified: providers.filter(
        (provider) => provider.verification === "Verified",
      ).length,
    };
  }, [providers]);

  const updateProvider = (id, updates) => {
    setProviders((currentProviders) =>
      currentProviders.map((provider) =>
        provider.id === id ? { ...provider, ...updates } : provider,
      ),
    );
  };

  const handleToggleStatus = (provider) => {
    const isActive = provider.status === "Active";

    updateProvider(provider.id, {
      status: isActive ? "Inactive" : "Active",
      statusAr: isActive ? "غير نشط" : "نشط",
    });

    setOpenMenuId(null);

    if (selectedProvider?.id === provider.id) {
      setSelectedProvider((current) => ({
        ...current,
        status: isActive ? "Inactive" : "Active",
        statusAr: isActive ? "غير نشط" : "نشط",
      }));
    }
  };

  const handleVerification = (provider, verificationStatus) => {
    const verificationArMap = {
      Verified: "موثق",
      Rejected: "مرفوض",
      Pending: "قيد المراجعة",
      "Not Verified": "غير موثق",
    };

    updateProvider(provider.id, {
      verification: verificationStatus,
      verificationAr: verificationArMap[verificationStatus],
    });

    setOpenMenuId(null);

    if (selectedProvider?.id === provider.id) {
      setSelectedProvider((current) => ({
        ...current,
        verification: verificationStatus,
        verificationAr: verificationArMap[verificationStatus],
      }));
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setVerificationFilter("all");
    setStatusFilter("all");
    setPlanFilter("all");
  };

  const hasFilters =
    searchTerm ||
    typeFilter !== "all" ||
    verificationFilter !== "all" ||
    statusFilter !== "all" ||
    planFilter !== "all";

  return (
    <div className="providers-page">
      <div className="providers-header">
        <div>
          <div className="providers-title-row">
            <div className="providers-title-icon">
              <Store size={20} />
            </div>

            <div>
              <h1>Providers</h1>
              <p>Manage and monitor all service providers on the platform.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="providers-stats">
        <div className="provider-stat-card">
          <div className="provider-stat-icon total">
            <Store size={21} />
          </div>

          <div>
            <span>Total Providers</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="provider-stat-card">
          <div className="provider-stat-icon active">
            <UserCheck size={21} />
          </div>

          <div>
            <span>Active Providers</span>
            <strong>{stats.active}</strong>
          </div>
        </div>

        <div className="provider-stat-card">
          <div className="provider-stat-icon pending">
            <ShieldCheck size={21} />
          </div>

          <div>
            <span>Pending Verification</span>
            <strong>{stats.pending}</strong>
          </div>
        </div>

        <div className="provider-stat-card">
          <div className="provider-stat-icon verified">
            <Check size={21} />
          </div>

          <div>
            <span>Verified Providers</span>
            <strong>{stats.verified}</strong>
          </div>
        </div>
      </div>

      <div className="providers-toolbar">
        <div className="providers-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="providers-filters">
          <div className="provider-select">
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>

          <div className="provider-select">
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

          <div className="provider-select">
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

          <div className="provider-select">
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
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              <Filter size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="providers-results">
        Showing <strong>{filteredProviders.length}</strong> of{" "}
        <strong>{providers.length}</strong> providers
      </div>

      <div className="providers-table-card">
        <div className="providers-table-wrapper">
          <table className="providers-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Type</th>
                <th>Location</th>
                <th>Plan</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <tr key={provider.id}>
                    <td>
                      <div className="provider-info">
                        <div className="provider-avatar">
                          {provider.name.charAt(0)}
                        </div>

                        <div className="provider-name-wrapper">
                          <strong>{provider.name}</strong>
                          <span>{provider.owner}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="provider-type">{provider.typeAr}</span>
                    </td>

                    <td>
                      <span className="provider-location">
                        {provider.location}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`plan-badge ${provider.plan
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {provider.planAr}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`verification-badge ${provider.verification
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        <span className="status-dot"></span>
                        {provider.verificationAr}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          provider.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        <span className="status-dot"></span>
                        {provider.statusAr}
                      </span>
                    </td>

                    <td>
                      <span className="orders-count">
                        {provider.orders.toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span className="joined-date">{provider.joinedAt}</span>
                    </td>

                    <td>
                      <div className="provider-actions">
                        <button
                          type="button"
                          className="table-icon-btn"
                          title="View Details"
                          onClick={() =>
                            navigate(`/admin/providers/${provider.id}`)
                          }
                        >
                          <Eye size={17} />
                        </button>

                        <div className="action-menu-wrapper">
                          <button
                            type="button"
                            className="table-icon-btn"
                            title="More"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === provider.id ? null : provider.id,
                              )
                            }
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openMenuId === provider.id && (
                            <div className="provider-action-menu">
                              <button
                                type="button"
                                onClick={() => {
                                  navigate(`/admin/providers/${provider.id}`);
                                  setOpenMenuId(null);
                                }}
                              >
                                <Eye size={15} />
                                View Details
                              </button>

                              {provider.verification === "Pending" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleVerification(provider, "Verified")
                                    }
                                  >
                                    <Check size={15} />
                                    Verify
                                  </button>

                                  <button
                                    type="button"
                                    className="danger-action"
                                    onClick={() =>
                                      handleVerification(provider, "Rejected")
                                    }
                                  >
                                    <X size={15} />
                                    Reject
                                  </button>
                                </>
                              )}

                              {provider.status === "Active" ? (
                                <button
                                  type="button"
                                  className="danger-action"
                                  onClick={() => handleToggleStatus(provider)}
                                >
                                  <UserX size={15} />
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(provider)}
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
                    <div className="providers-empty-state">
                      <div className="empty-icon">
                        <Store size={24} />
                      </div>

                      <h3>No providers found</h3>

                      <p>Try changing your search or filter criteria.</p>

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

        {filteredProviders.length > 0 && (
          <div className="providers-pagination">
            <span>
              Showing 1-{filteredProviders.length} of {filteredProviders.length}
            </span>

            <div className="pagination-buttons">
              <button type="button" disabled>
                Previous
              </button>

              <button type="button" className="pagination-active">
                1
              </button>

              <button type="button" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedProvider && (
        <div
          className="provider-modal-overlay"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="provider-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="provider-modal-header">
              <div>
                <span className="modal-eyebrow">Provider Details</span>

                <h2>{selectedProvider.name}</h2>

                <p>{selectedProvider.owner}</p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedProvider(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="provider-modal-body">
              <div className="modal-provider-profile">
                <div className="modal-provider-avatar">
                  {selectedProvider.name.charAt(0)}
                </div>

                <div>
                  <strong>{selectedProvider.name}</strong>
                  <span>{selectedProvider.typeAr}</span>
                </div>
              </div>

              <div className="provider-details-grid">
                <div className="provider-detail-item">
                  <span>Owner</span>
                  <strong>{selectedProvider.owner}</strong>
                </div>

                <div className="provider-detail-item">
                  <span>Provider Type</span>
                  <strong>{selectedProvider.typeAr}</strong>
                </div>

                <div className="provider-detail-item">
                  <span>Email</span>
                  <strong>{selectedProvider.email}</strong>
                </div>

                <div className="provider-detail-item">
                  <span>Phone</span>
                  <strong>{selectedProvider.phone}</strong>
                </div>

                <div className="provider-detail-item">
                  <span>Location</span>
                  <strong>{selectedProvider.location}</strong>
                </div>

                <div className="provider-detail-item">
                  <span>Plan</span>
                  <strong>{selectedProvider.planAr}</strong>
                </div>

                <div className="provider-detail-item">
                  <span>Orders</span>
                  <strong>{selectedProvider.orders.toLocaleString()}</strong>
                </div>

                <div className="provider-detail-item">
                  <span>Joined At</span>
                  <strong>{selectedProvider.joinedAt}</strong>
                </div>
              </div>

              <div className="provider-modal-status-section">
                <div>
                  <span>Verification Status</span>

                  <span
                    className={`verification-badge ${selectedProvider.verification
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    <span className="status-dot"></span>
                    {selectedProvider.verificationAr}
                  </span>
                </div>

                <div>
                  <span>Account Status</span>

                  <span
                    className={`status-badge ${
                      selectedProvider.status === "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    <span className="status-dot"></span>
                    {selectedProvider.statusAr}
                  </span>
                </div>
              </div>
            </div>

            <div className="provider-modal-footer">
              {selectedProvider.verification === "Pending" && (
                <>
                  <button
                    type="button"
                    className="modal-secondary-btn danger"
                    onClick={() =>
                      handleVerification(selectedProvider, "Rejected")
                    }
                  >
                    <X size={16} />
                    Reject
                  </button>

                  <button
                    type="button"
                    className="modal-primary-btn"
                    onClick={() =>
                      handleVerification(selectedProvider, "Verified")
                    }
                  >
                    <Check size={16} />
                    Verify Provider
                  </button>
                </>
              )}

              {selectedProvider.verification !== "Pending" && (
                <button
                  type="button"
                  className="modal-primary-btn"
                  onClick={() => setSelectedProvider(null)}
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

export default Providers;
