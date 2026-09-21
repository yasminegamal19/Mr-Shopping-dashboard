import { useMemo, useState, useEffect } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
  AlertTriangle,
  PackageX,
} from "lucide-react";
import "./ProviderProducts.css";

const initialProducts = [
  {
    id: 1,
    name: "Fresh Milk 1L",
    category: "Dairy",
    price: 45,
    stock: 120,
    active: true,
    description: "Full cream fresh milk.",
  },
  {
    id: 2,
    name: "Arabic Bread Pack",
    category: "Bakery",
    price: 15,
    stock: 8,
    active: true,
    description: "Pack of 6 fresh loaves.",
  },
  {
    id: 3,
    name: "Olive Oil 500ml",
    category: "Pantry",
    price: 240,
    stock: 42,
    active: true,
    description: "Extra virgin olive oil.",
  },
  {
    id: 4,
    name: "Chicken Breast 1kg",
    category: "Meat",
    price: 165,
    stock: 0,
    active: false,
    description: "Fresh boneless chicken breast.",
  },
  {
    id: 5,
    name: "White Cheese 500g",
    category: "Dairy",
    price: 70,
    stock: 25,
    active: true,
    description: "Egyptian white cheese.",
  },
  {
    id: 6,
    name: "Basmati Rice 2kg",
    category: "Pantry",
    price: 130,
    stock: 6,
    active: true,
    description: "Long grain basmati rice.",
  },
];

const categories = [
  "Dairy",
  "Bakery",
  "Pantry",
  "Meat",
  "Vegetables",
  "Beverages",
];
const LOW_STOCK = 10;

const emptyForm = {
  name: "",
  category: categories[0],
  price: "",
  stock: "",
  description: "",
  active: true,
};

const getStockStatus = (stock) => {
  if (stock === 0) return "out";
  if (stock <= LOW_STOCK) return "low";
  return "in";
};

const stockLabels = { in: "In stock", low: "Low stock", out: "Out of stock" };
const formatEGP = (n) => `EGP ${Number(n).toLocaleString()}`;

export default function ProviderProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const [modal, setModal] = useState(null); 
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const summary = useMemo(
    () => ({
      total: products.length,
      low: products.filter((p) => getStockStatus(p.stock) === "low").length,
      out: products.filter((p) => getStockStatus(p.stock) === "out").length,
    }),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchQuery = !q || p.name.toLowerCase().includes(q);
      const matchCategory = category === "all" || p.category === category;
      const matchStock =
        stockFilter === "all" || getStockStatus(p.stock) === stockFilter;
      return matchQuery && matchCategory && matchStock;
    });
  }, [products, query, category, stockFilter]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setModal(null);
        setDeleteTarget(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setModal({ mode: "add" });
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      description: p.description,
      active: p.active,
    });
    setErrors({});
    setModal({ mode: "edit", id: p.id });
  };

  const closeModal = () => setModal(null);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (form.price === "" || Number(form.price) <= 0)
      e.price = "Enter a valid price";
    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    )
      e.stock = "Enter a valid stock quantity";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
      active: form.active,
    };

    if (modal.mode === "add") {
      setProducts((prev) => [{ id: Date.now(), ...payload }, ...prev]);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === modal.id ? { ...p, ...payload } : p)),
      );
    }
    closeModal();
  };

  const toggleActive = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    );
  };

  const confirmDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="provider-products">
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>Manage your catalog, prices and stock.</p>
        </div>

        <button
          type="button"
          className="products-btn-primary"
          onClick={openAdd}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <section className="products-summary">
        <div className="products-summary-card">
          <div className="products-summary-icon tone-primary">
            <Package size={22} />
          </div>
          <div>
            <span>Total products</span>
            <strong>{summary.total}</strong>
          </div>
        </div>

        <div className="products-summary-card">
          <div className="products-summary-icon tone-warning">
            <AlertTriangle size={22} />
          </div>
          <div>
            <span>Low stock</span>
            <strong>{summary.low}</strong>
          </div>
        </div>

        <div className="products-summary-card">
          <div className="products-summary-icon tone-danger">
            <PackageX size={22} />
          </div>
          <div>
            <span>Out of stock</span>
            <strong>{summary.out}</strong>
          </div>
        </div>
      </section>

      <section className="products-card">
        <div className="products-toolbar">
          <div className="products-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="products-filters">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All stock</option>
              <option value="in">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>
        </div>

        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Active</th>
                <th aria-label="Actions" />
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="products-empty">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const status = getStockStatus(p.stock);

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="product-cell">
                          <div className="product-thumb">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <strong>{p.name}</strong>
                            <span>{p.description}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="category-chip">{p.category}</span>
                      </td>

                      <td className="product-price">{formatEGP(p.price)}</td>

                      <td>
                        <div className="stock-cell">
                          <span className={`stock-badge ${status}`}>
                            {stockLabels[status]}
                          </span>
                          <small>{p.stock} units</small>
                        </div>
                      </td>

                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={p.active}
                            onChange={() => toggleActive(p.id)}
                            aria-label={`Toggle ${p.name}`}
                          />
                          <span className="switch-slider" />
                        </label>
                      </td>

                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label="Edit"
                            onClick={() => openEdit(p)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="icon-btn danger"
                            aria-label="Delete"
                            onClick={() => setDeleteTarget(p)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modal && (
        <div className="pm-overlay" onClick={closeModal}>
          <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pm-header">
              <h3>{modal.mode === "add" ? "Add Product" : "Edit Product"}</h3>
              <button
                type="button"
                className="icon-btn"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form className="pm-form" onSubmit={handleSubmit} noValidate>
              <div className="pm-field">
                <label htmlFor="pname">Product name</label>
                <input
                  id="pname"
                  type="text"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={errors.name ? "invalid" : ""}
                  placeholder="e.g. Fresh Milk 1L"
                />
                {errors.name && (
                  <small className="pm-error">{errors.name}</small>
                )}
              </div>

              <div className="pm-row">
                <div className="pm-field">
                  <label htmlFor="pcat">Category</label>
                  <select
                    id="pcat"
                    value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pm-field">
                  <label htmlFor="pprice">Price (EGP)</label>
                  <input
                    id="pprice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                    className={errors.price ? "invalid" : ""}
                  />
                  {errors.price && (
                    <small className="pm-error">{errors.price}</small>
                  )}
                </div>

                <div className="pm-field">
                  <label htmlFor="pstock">Stock</label>
                  <input
                    id="pstock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) => setField("stock", e.target.value)}
                    className={errors.stock ? "invalid" : ""}
                  />
                  {errors.stock && (
                    <small className="pm-error">{errors.stock}</small>
                  )}
                </div>
              </div>

              <div className="pm-field">
                <label htmlFor="pdesc">Description</label>
                <textarea
                  id="pdesc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Short description..."
                />
              </div>

              <div className="pm-switch-row">
                <div>
                  <strong>Active</strong>
                  <span>Visible to customers when active</span>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setField("active", e.target.checked)}
                  />
                  <span className="switch-slider" />
                </label>
              </div>

              <div className="pm-actions">
                <button
                  type="button"
                  className="products-btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="products-btn-primary">
                  {modal.mode === "add" ? "Add Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="pm-overlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="pm-modal pm-confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pm-confirm-icon">
              <Trash2 size={22} />
            </div>
            <h3>Delete product?</h3>
            <p>
              <strong>{deleteTarget.name}</strong> will be permanently removed.
              This action can't be undone.
            </p>

            <div className="pm-actions center">
              <button
                type="button"
                className="products-btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="products-btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
