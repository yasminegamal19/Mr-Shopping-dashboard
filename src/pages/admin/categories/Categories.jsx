import { useMemo, useState } from "react";
import {
  ChevronDown,
  Edit3,
  Eye,
  FolderTree,
  MoreVertical,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import "./Categories.css";

const initialCategories = [
  {
    id: 1,
    name: "Restaurants",
    nameAr: "مطاعم",
    services: 8,
    providers: 42,
    status: "Active",
    createdAt: "2026-08-12",
    description: "Restaurants and food ordering services.",
  },
  {
    id: 2,
    name: "Doctors & Clinics",
    nameAr: "أطباء وعيادات",
    services: 6,
    providers: 35,
    status: "Active",
    createdAt: "2026-08-10",
    description: "Medical services, doctors and clinics.",
  },
  {
    id: 3,
    name: "Pharmacies",
    nameAr: "صيدليات",
    services: 4,
    providers: 28,
    status: "Active",
    createdAt: "2026-08-08",
    description: "Pharmacies and medicine-related services.",
  },
  {
    id: 4,
    name: "Clothing",
    nameAr: "ملابس",
    services: 5,
    providers: 51,
    status: "Active",
    createdAt: "2026-08-05",
    description: "Clothing stores and fashion products.",
  },
  {
    id: 5,
    name: "Accessories",
    nameAr: "إكسسوارات",
    services: 3,
    providers: 24,
    status: "Active",
    createdAt: "2026-08-02",
    description: "Accessories and related products.",
  },
  {
    id: 6,
    name: "Teachers",
    nameAr: "مدرسين",
    services: 4,
    providers: 31,
    status: "Hidden",
    createdAt: "2026-07-28",
    description: "Private teachers and educational services.",
  },
  {
    id: 7,
    name: "Plumbers",
    nameAr: "سباكين",
    services: 2,
    providers: 18,
    status: "Active",
    createdAt: "2026-07-24",
    description: "Plumbing and home maintenance services.",
  },
  {
    id: 8,
    name: "Shops",
    nameAr: "متاجر",
    services: 7,
    providers: 67,
    status: "Active",
    createdAt: "2026-07-20",
    description: "General shops and local businesses.",
  },
];

const emptyForm = {
  name: "",
  nameAr: "",
  description: "",
};

function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const stats = useMemo(() => {
    const total = categories.length;

    const active = categories.filter(
      (category) => category.status === "Active",
    ).length;

    const hidden = categories.filter(
      (category) => category.status === "Hidden",
    ).length;

    const totalServices = categories.reduce(
      (sum, category) => sum + category.services,
      0,
    );

    return {
      total,
      active,
      hidden,
      totalServices,
    };
  }, [categories]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.nameAr.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setShowFormModal(true);
    setOpenMenuId(null);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      nameAr: category.nameAr,
      description: category.description,
    });

    setShowFormModal(true);
    setOpenMenuId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.nameAr.trim()) {
      return;
    }

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                name: formData.name.trim(),
                nameAr: formData.nameAr.trim(),
                description: formData.description.trim(),
              }
            : category,
        ),
      );
    } else {
      const newCategory = {
        id: Date.now(),
        name: formData.name.trim(),
        nameAr: formData.nameAr.trim(),
        services: 0,
        providers: 0,
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
        description: formData.description.trim(),
      };

      setCategories((prev) => [newCategory, ...prev]);
    }

    setShowFormModal(false);
    setEditingCategory(null);
    setFormData(emptyForm);
  };

  const toggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? {
              ...category,
              status: category.status === "Active" ? "Hidden" : "Active",
            }
          : category,
      ),
    );

    setOpenMenuId(null);
  };

  const openDetails = (category) => {
    setSelectedCategory(category);
    setShowDetailsModal(true);
    setOpenMenuId(null);
  };

  const closeAllMenus = () => {
    setOpenMenuId(null);
  };

  return (
    <div className="categories-page" onClick={closeAllMenus}>
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Manage the categories available across the platform.</p>
        </div>

        <button className="primary-button" onClick={openAddModal}>
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FolderTree size={21} />
          </div>

          <div>
            <span className="stat-label">Total Categories</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <ToggleRight size={21} />
          </div>

          <div>
            <span className="stat-label">Active Categories</span>
            <strong>{stats.active}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <ToggleLeft size={21} />
          </div>

          <div>
            <span className="stat-label">Hidden Categories</span>
            <strong>{stats.hidden}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FolderTree size={21} />
          </div>

          <div>
            <span className="stat-label">Total Services</span>
            <strong>{stats.totalServices}</strong>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="filters-row">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filter-wrapper">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Hidden">Hidden</option>
            </select>

            <ChevronDown size={16} />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Services</th>
                <th>Providers</th>
                <th>Status</th>
                <th>Created Date</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <div className="category-cell">
                        <div className="category-avatar">
                          <FolderTree size={18} />
                        </div>

                        <div>
                          <strong>{category.name}</strong>
                          <span>{category.nameAr}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="number-cell">{category.services}</span>
                    </td>

                    <td>
                      <span className="number-cell">{category.providers}</span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          category.status === "Active" ? "active" : "hidden"
                        }`}
                      >
                        <span className="status-dot" />
                        {category.status}
                      </span>
                    </td>

                    <td>
                      <span className="date-cell">{category.createdAt}</span>
                    </td>

                    <td className="actions-cell">
                      <button
                        className="icon-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenuId(
                            openMenuId === category.id ? null : category.id,
                          );
                        }}
                        aria-label={`Actions for ${category.name}`}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === category.id && (
                        <div
                          className="actions-menu"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button onClick={() => openDetails(category)}>
                            <Eye size={16} />
                            View Details
                          </button>

                          <button onClick={() => openEditModal(category)}>
                            <Edit3 size={16} />
                            Edit Category
                          </button>

                          <button onClick={() => toggleStatus(category.id)}>
                            {category.status === "Active" ? (
                              <>
                                <ToggleLeft size={16} />
                                Hide Category
                              </>
                            ) : (
                              <>
                                <ToggleRight size={16} />
                                Activate Category
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
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <FolderTree size={24} />
                      </div>

                      <h3>No categories found</h3>

                      <p>Try changing your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredCategories.length > 0 && (
          <div className="pagination">
            <span>
              Showing {filteredCategories.length} of {categories.length}{" "}
              categories
            </span>

            <div className="pagination-buttons">
              <button disabled>Previous</button>
              <button className="current-page">1</button>
              <button disabled>Next</button>
            </div>
          </div>
        )}
      </div>

      {showDetailsModal && selectedCategory && (
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
                <span className="modal-eyebrow">Category Details</span>
                <h2>{selectedCategory.name}</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowDetailsModal(false)}
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <div className="category-detail-header">
              <div className="large-category-avatar">
                <FolderTree size={25} />
              </div>

              <div>
                <h3>{selectedCategory.name}</h3>
                <span>{selectedCategory.nameAr}</span>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <span>Services</span>
                <strong>{selectedCategory.services}</strong>
              </div>

              <div className="detail-item">
                <span>Providers</span>
                <strong>{selectedCategory.providers}</strong>
              </div>

              <div className="detail-item">
                <span>Status</span>
                <strong>{selectedCategory.status}</strong>
              </div>

              <div className="detail-item">
                <span>Created Date</span>
                <strong>{selectedCategory.createdAt}</strong>
              </div>
            </div>

            <div className="description-section">
              <span>Description</span>
              <p>
                {selectedCategory.description || "No description available."}
              </p>
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
                  openEditModal(selectedCategory);
                }}
              >
                <Edit3 size={17} />
                Edit Category
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
                  {editingCategory ? "Update Category" : "New Category"}
                </span>

                <h2>{editingCategory ? "Edit Category" : "Add Category"}</h2>
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
                  <label htmlFor="category-name">Category Name</label>

                  <input
                    id="category-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Restaurants"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category-name-ar">Arabic Name</label>

                  <input
                    id="category-name-ar"
                    name="nameAr"
                    type="text"
                    placeholder="مثال: مطاعم"
                    value={formData.nameAr}
                    onChange={handleFormChange}
                    required
                    dir="rtl"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="category-description">Description</label>

                  <textarea
                    id="category-description"
                    name="description"
                    rows="4"
                    placeholder="Write a short description for this category..."
                    value={formData.description}
                    onChange={handleFormChange}
                  />
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
                  {editingCategory ? "Save Changes" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
