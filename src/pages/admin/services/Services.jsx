import { useMemo, useState } from "react";
import {
  ChevronDown,
  Edit3,
  Eye,
  FileText,
  MoreVertical,
  Plus,
  Search,
  Settings2,
  ToggleLeft,
  ToggleRight,
  X,
  Workflow,
} from "lucide-react";
import "./Services.css";

const initialServices = [
  {
    id: 1,
    name: "Doctor Consultation",
    nameAr: "كشف طبي",
    category: "Doctors & Clinics",
    providers: 18,
    requiredData: ["Patient Name", "Medical History", "Appointment Date"],
    requiredDocuments: ["Medical Report"],
    flowType: "Appointment",
    status: "Published",
    createdAt: "2026-08-18",
  },
  {
    id: 2,
    name: "Private Tutoring",
    nameAr: "درس خصوصي",
    category: "Teachers",
    providers: 24,
    requiredData: ["Student Name", "Subject", "Preferred Time"],
    requiredDocuments: [],
    flowType: "Booking",
    status: "Published",
    createdAt: "2026-08-14",
  },
  {
    id: 3,
    name: "Plumbing Service",
    nameAr: "خدمة سباكة",
    category: "Plumbers",
    providers: 12,
    requiredData: ["Problem Description", "Service Location", "Preferred Time"],
    requiredDocuments: [],
    flowType: "Request & Approval",
    status: "Published",
    createdAt: "2026-08-11",
  },
  {
    id: 4,
    name: "Home Visit",
    nameAr: "زيارة منزلية",
    category: "Doctors & Clinics",
    providers: 9,
    requiredData: ["Patient Name", "Location", "Preferred Time"],
    requiredDocuments: ["Medical Report"],
    flowType: "Appointment",
    status: "Published",
    createdAt: "2026-08-06",
  },
  {
    id: 5,
    name: "Pharmacy Consultation",
    nameAr: "استشارة صيدلية",
    category: "Pharmacies",
    providers: 14,
    requiredData: ["Customer Name", "Question / Request"],
    requiredDocuments: [],
    flowType: "Request",
    status: "Draft",
    createdAt: "2026-08-03",
  },
  {
    id: 6,
    name: "Home Maintenance",
    nameAr: "صيانة منزلية",
    category: "Shops",
    providers: 7,
    requiredData: ["Problem Description", "Location"],
    requiredDocuments: [],
    flowType: "Request & Approval",
    status: "Published",
    createdAt: "2026-07-29",
  },
];

const categories = [
  "All",
  "Doctors & Clinics",
  "Teachers",
  "Plumbers",
  "Pharmacies",
  "Shops",
];

const flowTypes = ["Appointment", "Booking", "Request", "Request & Approval"];

const emptyForm = {
  name: "",
  nameAr: "",
  category: "",
  flowType: "",
  requiredData: "",
  requiredDocuments: "",
};

function Services() {
  const [services, setServices] = useState(initialServices);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenuId, setOpenMenuId] = useState(null);

  const [selectedService, setSelectedService] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);

  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const stats = useMemo(() => {
    const total = services.length;

    const published = services.filter(
      (service) => service.status === "Published",
    ).length;

    const drafts = services.filter(
      (service) => service.status === "Draft",
    ).length;

    const totalProviders = services.reduce(
      (sum, service) => sum + service.providers,
      0,
    );

    return {
      total,
      published,
      drafts,
      totalProviders,
    };
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        service.name.toLowerCase().includes(search) ||
        service.nameAr.includes(searchTerm) ||
        service.category.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "All" || service.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || service.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, searchTerm, categoryFilter, statusFilter]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData(emptyForm);
    setShowFormModal(true);
    setOpenMenuId(null);
  };

  const openEditModal = (service) => {
    setEditingService(service);

    setFormData({
      name: service.name,
      nameAr: service.nameAr,
      category: service.category,
      flowType: service.flowType,
      requiredData: service.requiredData.join("\n"),
      requiredDocuments: service.requiredDocuments.join("\n"),
    });

    setShowFormModal(true);
    setOpenMenuId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.nameAr.trim() ||
      !formData.category ||
      !formData.flowType
    ) {
      return;
    }

    const requiredData = formData.requiredData
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const requiredDocuments = formData.requiredDocuments
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (editingService) {
      setServices((prev) =>
        prev.map((service) =>
          service.id === editingService.id
            ? {
                ...service,
                name: formData.name.trim(),
                nameAr: formData.nameAr.trim(),
                category: formData.category,
                flowType: formData.flowType,
                requiredData,
                requiredDocuments,
              }
            : service,
        ),
      );
    } else {
      const newService = {
        id: Date.now(),
        name: formData.name.trim(),
        nameAr: formData.nameAr.trim(),
        category: formData.category,
        providers: 0,
        requiredData,
        requiredDocuments,
        flowType: formData.flowType,
        status: "Draft",
        createdAt: new Date().toISOString().split("T")[0],
      };

      setServices((prev) => [newService, ...prev]);
    }

    setShowFormModal(false);
    setEditingService(null);
    setFormData(emptyForm);
  };

  const toggleStatus = (id) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
              ...service,
              status: service.status === "Published" ? "Draft" : "Published",
            }
          : service,
      ),
    );

    setOpenMenuId(null);
  };

  const openDetails = (service) => {
    setSelectedService(service);
    setShowDetailsModal(true);
    setOpenMenuId(null);
  };

  const closeMenus = () => {
    setOpenMenuId(null);
  };

  return (
    <div className="services-page" onClick={closeMenus}>
   

      <div className="page-header">
        <div>
          <h1>Services</h1>
          <p>Create and manage service flows across the platform.</p>
        </div>

        <button className="primary-button" onClick={openAddModal}>
          <Plus size={18} />
          Add Service
        </button>
      </div>


      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Settings2 size={21} />
          </div>

          <div>
            <span className="stat-label">Total Services</span>

            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <ToggleRight size={21} />
          </div>

          <div>
            <span className="stat-label">Published</span>

            <strong>{stats.published}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <ToggleLeft size={21} />
          </div>

          <div>
            <span className="stat-label">Drafts</span>

            <strong>{stats.drafts}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Workflow size={21} />
          </div>

          <div>
            <span className="stat-label">Providers Using Services</span>

            <strong>{stats.totalProviders}</strong>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="filters-row">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filters-group">
            <div className="filter-wrapper">
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              <ChevronDown size={16} />
            </div>

            <div className="filter-wrapper">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Status</option>

                <option value="Published">Published</option>

                <option value="Draft">Draft</option>
              </select>

              <ChevronDown size={16} />
            </div>
          </div>
        </div>

     

        <div className="table-wrapper">
          <table className="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Providers</th>
                <th>Required Data</th>
                <th>Flow</th>
                <th>Status</th>
                <th>Created Date</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="service-cell">
                        <div className="service-avatar">
                          <Settings2 size={18} />
                        </div>

                        <div>
                          <strong>{service.name}</strong>

                          <span>{service.nameAr}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="category-text">{service.category}</span>
                    </td>

                    <td>
                      <strong className="providers-count">
                        {service.providers}
                      </strong>
                    </td>

                    <td>
                      <div className="data-count">
                        <span>{service.requiredData.length}</span>

                        <small>fields</small>
                      </div>
                    </td>

                    <td>
                      <span className="flow-badge">
                        <Workflow size={13} />
                        {service.flowType}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          service.status === "Published" ? "published" : "draft"
                        }`}
                      >
                        <span className="status-dot" />
                        {service.status}
                      </span>
                    </td>

                    <td>
                      <span className="date-cell">{service.createdAt}</span>
                    </td>

                    <td className="actions-cell">
                      <button
                        className="icon-button"
                        onClick={(event) => {
                          event.stopPropagation();

                          setOpenMenuId(
                            openMenuId === service.id ? null : service.id,
                          );
                        }}
                        aria-label={`Actions for ${service.name}`}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === service.id && (
                        <div
                          className="actions-menu"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button onClick={() => openDetails(service)}>
                            <Eye size={16} />
                            View Details
                          </button>

                          <button onClick={() => openEditModal(service)}>
                            <Edit3 size={16} />
                            Edit Service
                          </button>

                          <button onClick={() => toggleStatus(service.id)}>
                            {service.status === "Published" ? (
                              <>
                                <ToggleLeft size={16} />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <ToggleRight size={16} />
                                Publish
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <Settings2 size={24} />
                      </div>

                      <h3>No services found</h3>

                      <p>Try changing your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredServices.length > 0 && (
          <div className="pagination">
            <span>
              Showing {filteredServices.length} of {services.length} services
            </span>

            <div className="pagination-buttons">
              <button disabled>Previous</button>

              <button className="current-page">1</button>

              <button disabled>Next</button>
            </div>
          </div>
        )}
      </div>

      {showDetailsModal && selectedService && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="modal-card details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">Service Configuration</span>

                <h2>{selectedService.name}</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowDetailsModal(false)}
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <div className="service-detail-header">
              <div className="large-service-avatar">
                <Settings2 size={25} />
              </div>

              <div>
                <h3>{selectedService.name}</h3>

                <span>{selectedService.nameAr}</span>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <span>Category</span>
                <strong>{selectedService.category}</strong>
              </div>

              <div className="detail-item">
                <span>Flow Type</span>
                <strong>{selectedService.flowType}</strong>
              </div>

              <div className="detail-item">
                <span>Providers</span>
                <strong>{selectedService.providers}</strong>
              </div>

              <div className="detail-item">
                <span>Status</span>
                <strong>{selectedService.status}</strong>
              </div>

              <div className="detail-item">
                <span>Created Date</span>
                <strong>{selectedService.createdAt}</strong>
              </div>
            </div>

            <div className="configuration-section">
              <div className="configuration-title">
                <Settings2 size={17} />

                <span>Required Data</span>
              </div>

              {selectedService.requiredData.length > 0 ? (
                <div className="configuration-list">
                  {selectedService.requiredData.map((item, index) => (
                    <div className="configuration-item" key={index}>
                      <span className="item-number">{index + 1}</span>

                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No required data configured.</p>
              )}
            </div>

            <div className="configuration-section">
              <div className="configuration-title">
                <FileText size={17} />

                <span>Required Documents</span>
              </div>

              {selectedService.requiredDocuments.length > 0 ? (
                <div className="configuration-list">
                  {selectedService.requiredDocuments.map((item, index) => (
                    <div className="configuration-item" key={index}>
                      <span className="item-number">{index + 1}</span>

                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No required documents configured.</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>

              <button
                className="primary-button"
                onClick={() => {
                  setShowDetailsModal(false);
                  openEditModal(selectedService);
                }}
              >
                <Edit3 size={17} />
                Edit Service
              </button>
            </div>
          </div>
        </div>
      )}

      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div
            className="modal-card form-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">
                  {editingService ? "Update Service" : "New Service"}
                </span>

                <h2>{editingService ? "Edit Service" : "Add Service"}</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowFormModal(false)}
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="service-name">Service Name</label>

                  <input
                    id="service-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Doctor Consultation"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="service-name-ar">Arabic Name</label>

                  <input
                    id="service-name-ar"
                    name="nameAr"
                    type="text"
                    placeholder="مثال: كشف طبي"
                    value={formData.nameAr}
                    onChange={handleFormChange}
                    required
                    dir="rtl"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="service-category">Category</label>

                  <div className="select-field">
                    <select
                      id="service-category"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select category</option>

                      {categories
                        .filter((category) => category !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>

                    <ChevronDown size={16} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="service-flow">Flow Type</label>

                  <div className="select-field">
                    <select
                      id="service-flow"
                      name="flowType"
                      value={formData.flowType}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select flow</option>

                      {flowTypes.map((flow) => (
                        <option key={flow} value={flow}>
                          {flow}
                        </option>
                      ))}
                    </select>

                    <ChevronDown size={16} />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="required-data">Required Data</label>

                  <textarea
                    id="required-data"
                    name="requiredData"
                    rows="5"
                    placeholder={
                      "Enter one field per line\nPatient Name\nAppointment Date\nLocation"
                    }
                    value={formData.requiredData}
                    onChange={handleFormChange}
                  />

                  <small>Add one required field per line.</small>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="required-documents">Required Documents</label>

                  <textarea
                    id="required-documents"
                    name="requiredDocuments"
                    rows="4"
                    placeholder={
                      "Enter one document per line\nMedical Report\nNational ID"
                    }
                    value={formData.requiredDocuments}
                    onChange={handleFormChange}
                  />

                  <small>
                    Leave empty if the service does not require documents.
                  </small>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowFormModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {editingService ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;
