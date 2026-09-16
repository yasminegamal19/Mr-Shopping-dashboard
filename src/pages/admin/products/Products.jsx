import { useMemo, useState } from "react";
import {
  ChevronDown,
  Edit3,
  Eye,
  Package,
  Plus,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  MoreVertical,
} from "lucide-react";
import "./Products.css";

const initialProducts = [
  {
    id: 1,
    name: "Premium Burger",
    category: "Restaurants",
    provider: "Burger House",
    price: 185,
    stock: 42,
    status: "Active",
    createdAt: "2026-08-20",
    description:
      "Premium beef burger served with fresh vegetables and signature sauce.",
  },
  {
    id: 2,
    name: "Classic Pizza",
    category: "Restaurants",
    provider: "Pizza Corner",
    price: 220,
    stock: 18,
    status: "Active",
    createdAt: "2026-08-18",
    description: "Classic pizza with mozzarella cheese and fresh toppings.",
  },
  {
    id: 3,
    name: "Medical Face Mask",
    category: "Pharmacies",
    provider: "Care Pharmacy",
    price: 75,
    stock: 120,
    status: "Active",
    createdAt: "2026-08-15",
    description: "High-quality disposable medical face masks.",
  },
  {
    id: 4,
    name: "Summer T-Shirt",
    category: "Clothing",
    provider: "Urban Wear",
    price: 350,
    stock: 64,
    status: "Active",
    createdAt: "2026-08-12",
    description: "Comfortable casual summer T-shirt.",
  },
  {
    id: 5,
    name: "Leather Wallet",
    category: "Accessories",
    provider: "Classic Accessories",
    price: 490,
    stock: 7,
    status: "Active",
    createdAt: "2026-08-10",
    description: "Classic leather wallet with multiple card slots.",
  },
  {
    id: 6,
    name: "Wireless Headphones",
    category: "Shops",
    provider: "Tech Store",
    price: 1299,
    stock: 0,
    status: "Out of Stock",
    createdAt: "2026-08-07",
    description: "Wireless headphones with Bluetooth connectivity.",
  },
  {
    id: 7,
    name: "Running Shoes",
    category: "Clothing",
    provider: "Sport Zone",
    price: 980,
    stock: 23,
    status: "Active",
    createdAt: "2026-08-05",
    description: "Lightweight running shoes for everyday training.",
  },
  {
    id: 8,
    name: "School Backpack",
    category: "Shops",
    provider: "Daily Shop",
    price: 650,
    stock: 0,
    status: "Out of Stock",
    createdAt: "2026-08-01",
    description: "Durable backpack suitable for school and daily use.",
  },
];

const categories = [
  "All",
  "Restaurants",
  "Doctors & Clinics",
  "Pharmacies",
  "Clothing",
  "Accessories",
  "Teachers",
  "Plumbers",
  "Shops",
];

const emptyForm = {
  name: "",
  category: "",
  provider: "",
  price: "",
  stock: "",
  description: "",
};

function Products() {
  const [products, setProducts] = useState(initialProducts);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenuId, setOpenMenuId] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const stats = useMemo(() => {
    const total = products.length;

    const active = products.filter(
      (product) => product.status === "Active",
    ).length;

    const outOfStock = products.filter((product) => product.stock === 0).length;

    const totalCategories = new Set(products.map((product) => product.category))
      .size;

    return {
      total,
      active,
      outOfStock,
      totalCategories,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.provider.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowFormModal(true);
    setOpenMenuId(null);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      category: product.category,
      provider: product.provider,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    });

    setShowFormModal(true);
    setOpenMenuId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.provider.trim() ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      return;
    }

    const price = Number(formData.price);
    const stock = Number(formData.stock);

    const status = stock === 0 ? "Out of Stock" : "Active";

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name: formData.name.trim(),
                category: formData.category,
                provider: formData.provider.trim(),
                price,
                stock,
                status,
                description: formData.description.trim(),
              }
            : product,
        ),
      );
    } else {
      const newProduct = {
        id: Date.now(),
        name: formData.name.trim(),
        category: formData.category,
        provider: formData.provider.trim(),
        price,
        stock,
        status,
        createdAt: new Date().toISOString().split("T")[0],
        description: formData.description.trim(),
      };

      setProducts((prev) => [newProduct, ...prev]);
    }

    setShowFormModal(false);
    setEditingProduct(null);
    setFormData(emptyForm);
  };

  const toggleStatus = (id) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) {
          return product;
        }

        if (product.stock === 0) {
          return product;
        }

        return {
          ...product,
          status: product.status === "Active" ? "Inactive" : "Active",
        };
      }),
    );

    setOpenMenuId(null);
  };

  const deleteProduct = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    setProducts((prev) => prev.filter((product) => product.id !== id));

    setOpenMenuId(null);
  };

  const openDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
    setOpenMenuId(null);
  };

  const closeMenus = () => {
    setOpenMenuId(null);
  };

  return (
    <div className="products-page" onClick={closeMenus}>

      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage products listed by providers across the platform.</p>
        </div>

        <button className="primary-button" onClick={openAddModal}>
          <Plus size={18} />
          Add Product
        </button>
      </div>


      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={21} />
          </div>

          <div>
            <span className="stat-label">Total Products</span>

            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <ToggleRight size={21} />
          </div>

          <div>
            <span className="stat-label">Active Products</span>

            <strong>{stats.active}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <Package size={21} />
          </div>

          <div>
            <span className="stat-label">Out of Stock</span>

            <strong>{stats.outOfStock}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FolderIcon />
          </div>

          <div>
            <span className="stat-label">Categories</span>

            <strong>{stats.totalCategories}</strong>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="filters-row">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search products, providers..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Provider</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Created Date</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-avatar">
                          <Package size={18} />
                        </div>

                        <div>
                          <strong>{product.name}</strong>

                          <span>#{product.id.toString().padStart(4, "0")}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="category-text">{product.category}</span>
                    </td>

                    <td>
                      <span className="provider-text">{product.provider}</span>
                    </td>

                    <td>
                      <strong className="price-text">
                        {product.price.toLocaleString()} EGP
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`stock-text ${
                          product.stock === 0
                            ? "empty"
                            : product.stock <= 10
                              ? "low"
                              : ""
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          product.status === "Active"
                            ? "active"
                            : product.status === "Out of Stock"
                              ? "out-stock"
                              : "inactive"
                        }`}
                      >
                        <span className="status-dot" />

                        {product.status}
                      </span>
                    </td>

                    <td>
                      <span className="date-cell">{product.createdAt}</span>
                    </td>

                    <td className="actions-cell">
                      <button
                        className="icon-button"
                        onClick={(event) => {
                          event.stopPropagation();

                          setOpenMenuId(
                            openMenuId === product.id ? null : product.id,
                          );
                        }}
                        aria-label={`Actions for ${product.name}`}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === product.id && (
                        <div
                          className="actions-menu"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button onClick={() => openDetails(product)}>
                            <Eye size={16} />
                            View Details
                          </button>

                          <button onClick={() => openEditModal(product)}>
                            <Edit3 size={16} />
                            Edit Product
                          </button>

                          {product.stock > 0 && (
                            <button onClick={() => toggleStatus(product.id)}>
                              {product.status === "Active" ? (
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
                          )}

                          <button
                            className="danger-action"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 size={16} />
                            Delete Product
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
                        <Package size={24} />
                      </div>

                      <h3>No products found</h3>

                      <p>Try changing your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredProducts.length > 0 && (
          <div className="pagination">
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>

            <div className="pagination-buttons">
              <button disabled>Previous</button>

              <button className="current-page">1</button>

              <button disabled>Next</button>
            </div>
          </div>
        )}
      </div>

      {showDetailsModal && selectedProduct && (
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
                <span className="modal-eyebrow">Product Details</span>

                <h2>{selectedProduct.name}</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowDetailsModal(false)}
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <div className="product-detail-header">
              <div className="large-product-avatar">
                <Package size={26} />
              </div>

              <div>
                <h3>{selectedProduct.name}</h3>

                <span>{selectedProduct.provider}</span>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <span>Category</span>
                <strong>{selectedProduct.category}</strong>
              </div>

              <div className="detail-item">
                <span>Provider</span>
                <strong>{selectedProduct.provider}</strong>
              </div>

              <div className="detail-item">
                <span>Price</span>
                <strong>{selectedProduct.price.toLocaleString()} EGP</strong>
              </div>

              <div className="detail-item">
                <span>Stock</span>
                <strong>{selectedProduct.stock}</strong>
              </div>

              <div className="detail-item">
                <span>Status</span>
                <strong>{selectedProduct.status}</strong>
              </div>

              <div className="detail-item">
                <span>Created Date</span>
                <strong>{selectedProduct.createdAt}</strong>
              </div>
            </div>

            <div className="description-section">
              <span>Description</span>

              <p>
                {selectedProduct.description || "No description available."}
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
                  openEditModal(selectedProduct);
                }}
              >
                <Edit3 size={17} />
                Edit Product
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
                  {editingProduct ? "Update Product" : "New Product"}
                </span>

                <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
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
                  <label htmlFor="product-name">Product Name</label>

                  <input
                    id="product-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Classic Pizza"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="product-category">Category</label>

                  <div className="select-field">
                    <select
                      id="product-category"
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
                  <label htmlFor="product-provider">Provider</label>

                  <input
                    id="product-provider"
                    name="provider"
                    type="text"
                    placeholder="e.g. Burger House"
                    value={formData.provider}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="product-price">Price</label>

                  <div className="input-with-suffix">
                    <input
                      id="product-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={formData.price}
                      onChange={handleFormChange}
                      required
                    />

                    <span>EGP</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="product-stock">Stock</label>

                  <input
                    id="product-stock"
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="product-description">Description</label>

                  <textarea
                    id="product-description"
                    name="description"
                    rows="4"
                    placeholder="Write a short description..."
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
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
function FolderIcon() {
  return <Package size={21} />;
}

export default Products;
