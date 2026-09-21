import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import "./Plans.css";

const initialPlans = [
  {
    id: 1,
    name: "Starter",
    description: "Basic plan for providers starting on the platform.",
    price: 299,
    billing: "Monthly",
    ordersLimit: 20,
    verified: false,
    subscribers: 84,
    status: "Active",
    features: [
      "Up to 20 orders",
      "Provider dashboard",
      "Order management",
      "Basic reports",
    ],
    createdAt: "12 Aug 2026",
  },
  {
    id: 2,
    name: "Business",
    description: "Unlimited orders for growing providers.",
    price: 599,
    billing: "Monthly",
    ordersLimit: null,
    verified: false,
    subscribers: 156,
    status: "Active",
    features: [
      "Unlimited orders",
      "Provider dashboard",
      "Order management",
      "Reports & earnings",
      "Offers management",
    ],
    createdAt: "12 Aug 2026",
  },
  {
    id: 3,
    name: "Business Verified",
    description: "Unlimited orders with verified provider status.",
    price: 899,
    billing: "Monthly",
    ordersLimit: null,
    verified: true,
    subscribers: 92,
    status: "Active",
    features: [
      "Unlimited orders",
      "Verified badge",
      "Provider dashboard",
      "Order management",
      "Reports & earnings",
      "Offers management",
    ],
    createdAt: "12 Aug 2026",
  },
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  billing: "Monthly",
  ordersLimit: "",
  verified: false,
  features: "",
};

function Plans() {
  const [plans, setPlans] = useState(initialPlans);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenu, setOpenMenu] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [modalType, setModalType] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        plan.name.toLowerCase().includes(searchValue) ||
        plan.description.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || plan.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [plans, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPlans.length / itemsPerPage),
  );

  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalSubscribers = plans.reduce(
    (total, plan) => total + plan.subscribers,
    0,
  );

  const activePlans = plans.filter((plan) => plan.status === "Active").length;

  const monthlyRevenue = plans.reduce(
    (total, plan) => total + plan.price * plan.subscribers,
    0,
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const openViewModal = (plan) => {
    setSelectedPlan(plan);
    setModalType("view");
    setOpenMenu(null);
  };

  const openEditModal = (plan) => {
    setSelectedPlan(plan);

    setForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billing: plan.billing,
      ordersLimit: plan.ordersLimit ?? "",
      verified: plan.verified,
      features: plan.features.join("\n"),
    });

    setModalType("edit");
    setOpenMenu(null);
  };

  const openAddModal = () => {
    setSelectedPlan(null);
    setForm(emptyForm);
    setModalType("add");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPlan(null);
    setForm(emptyForm);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price) {
      return;
    }

    const planData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      billing: form.billing,
      ordersLimit: form.ordersLimit === "" ? null : Number(form.ordersLimit),
      verified: form.verified,
      features: form.features
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean),
    };

    if (modalType === "add") {
      const newPlan = {
        id: Date.now(),
        ...planData,
        subscribers: 0,
        status: "Active",
        createdAt: "20 Sep 2026",
      };

      setPlans((prev) => [newPlan, ...prev]);
    }

    if (modalType === "edit" && selectedPlan) {
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === selectedPlan.id
            ? {
                ...plan,
                ...planData,
              }
            : plan,
        ),
      );
    }

    closeModal();
  };

  const togglePlanStatus = (planId) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              status: plan.status === "Active" ? "Inactive" : "Active",
            }
          : plan,
      ),
    );

    setOpenMenu(null);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="plans-page">
      <div className="plans-header">
        <div>
          <h1>Plans</h1>
          <p>Manage provider subscription plans and their features.</p>
        </div>

        <button className="primary-btn" onClick={openAddModal}>
          <Plus size={18} />
          Add Plan
        </button>
      </div>

      <div className="plans-stats">
        <div className="plan-stat-card">
          <div className="stat-icon purple">
            <ShieldCheck size={20} />
          </div>

          <div>
            <span>Total Plans</span>
            <strong>{plans.length}</strong>
          </div>
        </div>

        <div className="plan-stat-card">
          <div className="stat-icon green">
            <Check size={20} />
          </div>

          <div>
            <span>Active Plans</span>
            <strong>{activePlans}</strong>
          </div>
        </div>

        <div className="plan-stat-card">
          <div className="stat-icon blue">
            <Eye size={20} />
          </div>

          <div>
            <span>Total Subscribers</span>
            <strong>{totalSubscribers.toLocaleString()}</strong>
          </div>
        </div>

        <div className="plan-stat-card">
          <div className="stat-icon orange">
            <span className="currency-symbol">$</span>
          </div>

          <div>
            <span>Monthly Revenue</span>
            <strong>${monthlyRevenue.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div className="plans-toolbar">
        <div className="plans-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search plans..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="plans-filter">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {(search || statusFilter !== "All") && (
          <button className="clear-filter-btn" onClick={resetFilters}>
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      <div className="plans-table-card">
        <div className="table-wrapper">
          <table className="plans-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Price</th>
                <th>Orders Limit</th>
                <th>Verified</th>
                <th>Subscribers</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {paginatedPlans.length > 0 ? (
                paginatedPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <div className="plan-name-cell">
                        <div className="plan-avatar">{plan.name.charAt(0)}</div>

                        <div>
                          <strong>{plan.name}</strong>
                          <span>{plan.description}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="price-cell">
                        <strong>${plan.price}</strong>
                        <span>/{plan.billing.toLowerCase()}</span>
                      </div>
                    </td>

                    <td>
                      <span className="orders-limit">
                        {plan.ordersLimit
                          ? `${plan.ordersLimit} orders`
                          : "Unlimited"}
                      </span>
                    </td>

                    <td>
                      {plan.verified ? (
                        <span className="verified-badge">
                          <ShieldCheck size={15} />
                          Verified
                        </span>
                      ) : (
                        <span className="not-verified">Not included</span>
                      )}
                    </td>

                    <td>
                      <span className="subscribers-count">
                        {plan.subscribers.toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          plan.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        <span className="status-dot" />
                        {plan.status}
                      </span>
                    </td>

                    <td>
                      <span className="created-date">{plan.createdAt}</span>
                    </td>

                    <td>
                      <div className="action-wrapper">
                        <button
                          className="action-btn"
                          onClick={() =>
                            setOpenMenu(openMenu === plan.id ? null : plan.id)
                          }
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenu === plan.id && (
                          <div className="action-menu">
                            <button onClick={() => openViewModal(plan)}>
                              <Eye size={16} />
                              View Details
                            </button>

                            <button onClick={() => openEditModal(plan)}>
                              <Edit size={16} />
                              Edit Plan
                            </button>

                            <button onClick={() => togglePlanStatus(plan.id)}>
                              {plan.status === "Active" ? (
                                <>
                                  <ToggleLeft size={16} />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <ToggleRight size={16} />
                                  Activate
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <Search size={22} />
                      </div>

                      <h3>No plans found</h3>
                      <p>Try changing your search or filter.</p>

                      <button className="secondary-btn" onClick={resetFilters}>
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredPlans.length > 0 && (
          <div className="plans-pagination">
            <span>
              Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
              <strong>
                {Math.min(currentPage * itemsPerPage, filteredPlans.length)}
              </strong>{" "}
              of <strong>{filteredPlans.length}</strong> plans
            </span>

            <div className="pagination-buttons">
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                <ChevronLeft size={17} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>

      {modalType === "view" && selectedPlan && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-label">Plan Details</span>
                <h2>{selectedPlan.name}</h2>
              </div>

              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="plan-detail-content">
              <div className="detail-main">
                <div className="detail-price">
                  <span>Plan Price</span>
                  <strong>
                    ${selectedPlan.price}
                    <small>/{selectedPlan.billing.toLowerCase()}</small>
                  </strong>
                </div>

                <div className="detail-status-row">
                  <span
                    className={`status-badge ${
                      selectedPlan.status === "Active" ? "active" : "inactive"
                    }`}
                  >
                    <span className="status-dot" />
                    {selectedPlan.status}
                  </span>

                  {selectedPlan.verified && (
                    <span className="verified-badge">
                      <ShieldCheck size={15} />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="detail-description">
                <h4>Description</h4>
                <p>{selectedPlan.description}</p>
              </div>

              <div className="detail-grid">
                <div>
                  <span>Orders Limit</span>
                  <strong>
                    {selectedPlan.ordersLimit
                      ? `${selectedPlan.ordersLimit} orders`
                      : "Unlimited"}
                  </strong>
                </div>

                <div>
                  <span>Subscribers</span>
                  <strong>{selectedPlan.subscribers.toLocaleString()}</strong>
                </div>

                <div>
                  <span>Billing</span>
                  <strong>{selectedPlan.billing}</strong>
                </div>

                <div>
                  <span>Created</span>
                  <strong>{selectedPlan.createdAt}</strong>
                </div>
              </div>

              <div className="features-section">
                <h4>Plan Features</h4>

                <div className="features-list">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index}>
                      <Check size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={closeModal}>
                Close
              </button>

              <button
                className="primary-btn"
                onClick={() => openEditModal(selectedPlan)}
              >
                <Edit size={17} />
                Edit Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {(modalType === "add" || modalType === "edit") && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="plan-modal form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-label">
                  {modalType === "add" ? "Create New" : "Update"}
                </span>

                <h2>{modalType === "add" ? "Add Plan" : "Edit Plan"}</h2>
              </div>

              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-content">
                <div className="form-row">
                  <div className="form-group">
                    <label>Plan Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Business"
                      value={form.name}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Price</label>

                    <div className="input-with-prefix">
                      <span>$</span>

                      <input
                        type="number"
                        name="price"
                        min="0"
                        placeholder="599"
                        value={form.price}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Billing Period</label>

                    <select
                      name="billing"
                      value={form.billing}
                      onChange={handleFormChange}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Orders Limit</label>

                    <input
                      type="number"
                      name="ordersLimit"
                      min="1"
                      placeholder="Leave empty for unlimited"
                      value={form.ordersLimit}
                      onChange={handleFormChange}
                    />

                    <small>
                      Leave empty if the plan allows unlimited orders.
                    </small>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>

                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Describe the plan..."
                    value={form.description}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label>Features</label>

                  <textarea
                    name="features"
                    rows="5"
                    placeholder={
                      "One feature per line\nUnlimited orders\nReports & earnings\nOffers management"
                    }
                    value={form.features}
                    onChange={handleFormChange}
                  />

                  <small>Add one feature per line.</small>
                </div>

                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    name="verified"
                    checked={form.verified}
                    onChange={handleFormChange}
                  />

                  <span className="custom-checkbox">
                    <Check size={13} />
                  </span>

                  <span>Include Verified badge</span>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {modalType === "add" ? "Create Plan" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Plans;
