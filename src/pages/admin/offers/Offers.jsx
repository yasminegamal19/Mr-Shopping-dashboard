import { useMemo, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Tag,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import "./Offers.css";

const initialOffers = [
  {
    id: 1,
    name: "Summer Sale",
    code: "SUMMER25",
    provider: "Smart Store",
    type: "Provider",
    discountType: "Percentage",
    discountValue: 25,
    usageLimit: 500,
    usedCount: 184,
    startDate: "01 Sep 2026",
    endDate: "30 Sep 2026",
    status: "Active",
    createdAt: "28 Aug 2026",
  },
  {
    id: 2,
    name: "Fresh Market Deal",
    code: "FRESH15",
    provider: "Fresh Market",
    type: "Provider",
    discountType: "Percentage",
    discountValue: 15,
    usageLimit: 300,
    usedCount: 126,
    startDate: "10 Sep 2026",
    endDate: "25 Sep 2026",
    status: "Active",
    createdAt: "08 Sep 2026",
  },
  {
    id: 3,
    name: "Doctor Consultation Offer",
    code: "DOCTOR100",
    provider: "Dr. Sara Clinic",
    type: "Service",
    discountType: "Fixed",
    discountValue: 100,
    usageLimit: 100,
    usedCount: 73,
    startDate: "05 Sep 2026",
    endDate: "30 Sep 2026",
    status: "Active",
    createdAt: "03 Sep 2026",
  },
  {
    id: 4,
    name: "Back to School",
    code: "SCHOOL20",
    provider: "Learn Academy",
    type: "Service",
    discountType: "Percentage",
    discountValue: 20,
    usageLimit: 250,
    usedCount: 250,
    startDate: "01 Aug 2026",
    endDate: "31 Aug 2026",
    status: "Expired",
    createdAt: "27 Jul 2026",
  },
  {
    id: 5,
    name: "Fashion Weekend",
    code: "FASHION30",
    provider: "Fashion House",
    type: "Product",
    discountType: "Percentage",
    discountValue: 30,
    usageLimit: 150,
    usedCount: 48,
    startDate: "20 Sep 2026",
    endDate: "22 Sep 2026",
    status: "Scheduled",
    createdAt: "15 Sep 2026",
  },
  {
    id: 6,
    name: "Pharmacy Care",
    code: "CARE50",
    provider: "Green Pharmacy",
    type: "Product",
    discountType: "Fixed",
    discountValue: 50,
    usageLimit: 200,
    usedCount: 91,
    startDate: "12 Sep 2026",
    endDate: "28 Sep 2026",
    status: "Active",
    createdAt: "10 Sep 2026",
  },
];

const emptyForm = {
  name: "",
  code: "",
  provider: "",
  type: "Product",
  discountType: "Percentage",
  discountValue: "",
  usageLimit: "",
  startDate: "",
  endDate: "",
};

function Offers() {
  const [offers, setOffers] = useState(initialOffers);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [openMenu, setOpenMenu] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const value = search.toLowerCase().trim();

      const matchesSearch =
        !value ||
        offer.name.toLowerCase().includes(value) ||
        offer.code.toLowerCase().includes(value) ||
        offer.provider.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "All" || offer.status === statusFilter;

      const matchesType = typeFilter === "All" || offer.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [offers, search, statusFilter, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOffers.length / itemsPerPage),
  );

  const paginatedOffers = filteredOffers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const activeOffers = offers.filter(
    (offer) => offer.status === "Active",
  ).length;

  const scheduledOffers = offers.filter(
    (offer) => offer.status === "Scheduled",
  ).length;

  const totalUsage = offers.reduce(
    (total, offer) => total + offer.usedCount,
    0,
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setCurrentPage(1);
  };

  const openViewModal = (offer) => {
    setSelectedOffer(offer);
    setModalType("view");
    setOpenMenu(null);
  };

  const openEditModal = (offer) => {
    setSelectedOffer(offer);

    setForm({
      name: offer.name,
      code: offer.code,
      provider: offer.provider,
      type: offer.type,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      usageLimit: offer.usageLimit,
      startDate: offer.startDate,
      endDate: offer.endDate,
    });

    setModalType("edit");
    setOpenMenu(null);
  };

  const openAddModal = () => {
    setSelectedOffer(null);
    setForm(emptyForm);
    setModalType("add");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedOffer(null);
    setForm(emptyForm);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.code.trim() ||
      !form.provider.trim() ||
      !form.discountValue
    ) {
      return;
    }

    const offerData = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      provider: form.provider.trim(),
      type: form.type,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      usageLimit: Number(form.usageLimit) || 0,
      usedCount:
        modalType === "edit" && selectedOffer ? selectedOffer.usedCount : 0,
      startDate: form.startDate || "20 Sep 2026",
      endDate: form.endDate || "30 Sep 2026",
    };

    if (modalType === "add") {
      setOffers((prev) => [
        {
          id: Date.now(),
          ...offerData,
          status: "Scheduled",
          createdAt: "20 Sep 2026",
        },
        ...prev,
      ]);
    }

    if (modalType === "edit" && selectedOffer) {
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === selectedOffer.id
            ? {
                ...offer,
                ...offerData,
              }
            : offer,
        ),
      );
    }

    closeModal();
  };

  const toggleOfferStatus = (offerId) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === offerId
          ? {
              ...offer,
              status: offer.status === "Active" ? "Scheduled" : "Active",
            }
          : offer,
      ),
    );

    setOpenMenu(null);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getDiscountText = (offer) => {
    return offer.discountType === "Percentage"
      ? `${offer.discountValue}%`
      : `$${offer.discountValue}`;
  };

  return (
    <div className="offers-page">
      <div className="offers-header">
        <div>
          <h1>Offers</h1>
          <p>Manage platform offers and promotional campaigns.</p>
        </div>

        <button className="primary-btn" onClick={openAddModal}>
          <Plus size={18} />
          Add Offer
        </button>
      </div>

      <div className="offers-stats">
        <div className="offer-stat-card">
          <div className="offer-stat-icon purple">
            <Tag size={20} />
          </div>

          <div>
            <span>Total Offers</span>
            <strong>{offers.length}</strong>
          </div>
        </div>

        <div className="offer-stat-card">
          <div className="offer-stat-icon green">
            <ToggleRight size={20} />
          </div>

          <div>
            <span>Active Offers</span>
            <strong>{activeOffers}</strong>
          </div>
        </div>

        <div className="offer-stat-card">
          <div className="offer-stat-icon blue">
            <Calendar size={20} />
          </div>

          <div>
            <span>Scheduled</span>
            <strong>{scheduledOffers}</strong>
          </div>
        </div>

        <div className="offer-stat-card">
          <div className="offer-stat-icon orange">
            <span className="usage-symbol">#</span>
          </div>

          <div>
            <span>Total Usage</span>
            <strong>{totalUsage.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div className="offers-toolbar">
        <div className="offers-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search offers, codes or providers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Types</option>
          <option value="Product">Product</option>
          <option value="Service">Service</option>
          <option value="Provider">Provider</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Expired">Expired</option>
        </select>

        {(search || statusFilter !== "All" || typeFilter !== "All") && (
          <button className="clear-filter-btn" onClick={resetFilters}>
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      <div className="offers-table-card">
        <div className="table-wrapper">
          <table className="offers-table">
            <thead>
              <tr>
                <th>Offer</th>
                <th>Provider</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Usage</th>
                <th>Period</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {paginatedOffers.length > 0 ? (
                paginatedOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td>
                      <div className="offer-name-cell">
                        <div className="offer-avatar">
                          <Tag size={17} />
                        </div>

                        <div>
                          <strong>{offer.name}</strong>
                          <span>{offer.code}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="provider-name">{offer.provider}</span>
                    </td>

                    <td>
                      <span
                        className={`type-badge ${offer.type.toLowerCase()}`}
                      >
                        {offer.type}
                      </span>
                    </td>

                    <td>
                      <span className="discount-value">
                        {getDiscountText(offer)}
                      </span>
                    </td>

                    <td>
                      <div className="usage-cell">
                        <div className="usage-text">
                          <span>{offer.usedCount}</span>
                          <small>/ {offer.usageLimit || "∞"}</small>
                        </div>

                        {offer.usageLimit > 0 && (
                          <div className="usage-bar">
                            <span
                              style={{
                                width: `${Math.min(
                                  (offer.usedCount / offer.usageLimit) * 100,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="period-cell">
                        <span>{offer.startDate}</span>
                        <small>to {offer.endDate}</small>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`offer-status ${offer.status.toLowerCase()}`}
                      >
                        <span className="status-dot" />
                        {offer.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-wrapper">
                        <button
                          className="action-btn"
                          onClick={() =>
                            setOpenMenu(openMenu === offer.id ? null : offer.id)
                          }
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenu === offer.id && (
                          <div className="action-menu">
                            <button onClick={() => openViewModal(offer)}>
                              <Eye size={16} />
                              View Details
                            </button>

                            <button onClick={() => openEditModal(offer)}>
                              <Edit size={16} />
                              Edit Offer
                            </button>

                            <button onClick={() => toggleOfferStatus(offer.id)}>
                              {offer.status === "Active" ? (
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
                        <Tag size={22} />
                      </div>

                      <h3>No offers found</h3>

                      <p>Try changing your search or filters.</p>

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

        {filteredOffers.length > 0 && (
          <div className="offers-pagination">
            <span>
              Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
              <strong>
                {Math.min(currentPage * itemsPerPage, filteredOffers.length)}
              </strong>{" "}
              of <strong>{filteredOffers.length}</strong> offers
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

      {modalType === "view" && selectedOffer && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="offer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-label">Offer Details</span>

                <h2>{selectedOffer.name}</h2>
              </div>

              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="offer-detail-content">
              <div className="offer-detail-top">
                <div className="big-offer-icon">
                  <Tag size={24} />
                </div>

                <div>
                  <span className="detail-code">{selectedOffer.code}</span>

                  <strong>{getDiscountText(selectedOffer)} OFF</strong>
                </div>
              </div>

              <div className="detail-status-row">
                <span
                  className={`offer-status ${selectedOffer.status.toLowerCase()}`}
                >
                  <span className="status-dot" />
                  {selectedOffer.status}
                </span>

                <span
                  className={`type-badge ${selectedOffer.type.toLowerCase()}`}
                >
                  {selectedOffer.type}
                </span>
              </div>

              <div className="detail-grid">
                <div>
                  <span>Provider</span>
                  <strong>{selectedOffer.provider}</strong>
                </div>

                <div>
                  <span>Discount Type</span>
                  <strong>{selectedOffer.discountType}</strong>
                </div>

                <div>
                  <span>Usage</span>
                  <strong>
                    {selectedOffer.usedCount} /{" "}
                    {selectedOffer.usageLimit || "Unlimited"}
                  </strong>
                </div>

                <div>
                  <span>Created</span>
                  <strong>{selectedOffer.createdAt}</strong>
                </div>

                <div>
                  <span>Start Date</span>
                  <strong>{selectedOffer.startDate}</strong>
                </div>

                <div>
                  <span>End Date</span>
                  <strong>{selectedOffer.endDate}</strong>
                </div>
              </div>

              <div className="detail-usage">
                <div>
                  <span>Offer Usage</span>

                  <strong>
                    {selectedOffer.usageLimit
                      ? `${Math.round(
                          (selectedOffer.usedCount / selectedOffer.usageLimit) *
                            100,
                        )}%`
                      : "Unlimited"}
                  </strong>
                </div>

                {selectedOffer.usageLimit > 0 && (
                  <div className="large-usage-bar">
                    <span
                      style={{
                        width: `${Math.min(
                          (selectedOffer.usedCount / selectedOffer.usageLimit) *
                            100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={closeModal}>
                Close
              </button>

              <button
                className="primary-btn"
                onClick={() => openEditModal(selectedOffer)}
              >
                <Edit size={17} />
                Edit Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {(modalType === "add" || modalType === "edit") && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="offer-modal form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-label">
                  {modalType === "add" ? "Create New" : "Update"}
                </span>

                <h2>{modalType === "add" ? "Add Offer" : "Edit Offer"}</h2>
              </div>

              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-content">
                <div className="form-row">
                  <div className="form-group">
                    <label>Offer Name</label>

                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Summer Sale"
                      value={form.name}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Promo Code</label>

                    <input
                      type="text"
                      name="code"
                      placeholder="e.g. SUMMER25"
                      value={form.code}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Provider</label>

                    <input
                      type="text"
                      name="provider"
                      placeholder="Provider name"
                      value={form.provider}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Offer Type</label>

                    <select
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                    >
                      <option value="Product">Product</option>
                      <option value="Service">Service</option>
                      <option value="Provider">Provider</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Discount Type</label>

                    <select
                      name="discountType"
                      value={form.discountType}
                      onChange={handleFormChange}
                    >
                      <option value="Percentage">Percentage</option>
                      <option value="Fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Discount Value</label>

                    <input
                      type="number"
                      name="discountValue"
                      min="0"
                      placeholder="25"
                      value={form.discountValue}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Usage Limit</label>

                  <input
                    type="number"
                    name="usageLimit"
                    min="0"
                    placeholder="Leave empty for unlimited"
                    value={form.usageLimit}
                    onChange={handleFormChange}
                  />

                  <small>Leave empty or use 0 for unlimited usage.</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>

                    <input
                      type="text"
                      name="startDate"
                      placeholder="e.g. 20 Sep 2026"
                      value={form.startDate}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>

                    <input
                      type="text"
                      name="endDate"
                      placeholder="e.g. 30 Sep 2026"
                      value={form.endDate}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
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
                  {modalType === "add" ? "Create Offer" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Offers;
