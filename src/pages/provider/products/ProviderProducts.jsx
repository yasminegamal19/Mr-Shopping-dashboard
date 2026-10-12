import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
  AlertTriangle,
  PackageX,
  ImagePlus,
  Star,
  Check,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  setPrimaryProductImage,
  deleteProductImage,
} from "../../../services/productService";
import { getCategories } from "../../../services/categoryService";
import { ApiError } from "../../../services/apiClient";
import "./ProviderProducts.css";

const LOW_STOCK = 10;
const MAX_IMAGE = 4 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const emptyForm = {
  name: "",
  category_id: "",
  price: "",
  discount_price: "",
  stock: "",
  description: "",
  is_active: true,
};

const getStockStatus = (stock) => {
  if (stock === 0) return "out";
  if (stock <= LOW_STOCK) return "low";
  return "in";
};

const stockLabels = { in: "In stock", low: "Low stock", out: "Out of stock" };
const formatEGP = (n) => `EGP ${Number(n).toLocaleString()}`;

const getErrorMessage = (err) =>
  err instanceof ApiError && err.status === 500
    ? "Server error. Please try again later."
    : (err?.message ?? "Something went wrong.");

export default function ProviderProducts() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const [modal, setModal] = useState(null); // { mode: "add" | "edit", id? }
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // صور المنتج
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]); // [{ file, preview }]
  const [imageBusyId, setImageBusyId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  // debounce للبحث
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { items, meta: m } = await getProducts({
        page,
        search: debouncedSearch,
        categoryId: categoryFilter === "all" ? undefined : categoryFilter,
      });
      setProducts(items);
      setMeta(m);
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) {
        setModal(null);
        setDeleteTarget(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [saving]);

  // فلتر المخزون بيتطبّق على الصفحة الحالية (الـ API مفيهوش فلتر للمخزون)
  const visible = useMemo(
    () =>
      stockFilter === "all"
        ? products
        : products.filter((p) => getStockStatus(p.stock) === stockFilter),
    [products, stockFilter],
  );

  const summary = useMemo(
    () => ({
      total: meta.total ?? products.length,
      low: products.filter((p) => getStockStatus(p.stock) === "low").length,
      out: products.filter((p) => getStockStatus(p.stock) === "out").length,
    }),
    [products, meta.total],
  );

  // ---------- Modal ----------
  const clearNewFiles = () => {
    newFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    setNewFiles([]);
  };

  const openAdd = () => {
    clearNewFiles();
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? "" });
    setExistingImages([]);
    setErrors({});
    setModal({ mode: "add" });
  };

  const openEdit = (p) => {
    clearNewFiles();
    setForm({
      name: p.name,
      category_id: p.category?.id ?? "",
      price: String(p.price),
      discount_price: p.discount_price != null ? String(p.discount_price) : "",
      stock: String(p.stock),
      description: p.description ?? "",
      is_active: p.is_active,
    });
    setExistingImages(p.images ?? []);
    setErrors({});
    setModal({ mode: "edit", id: p.id });
  };

  const closeModal = () => {
    if (saving) return;
    clearNewFiles();
    setModal(null);
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handlePickImages = (e) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";

    const accepted = [];
    for (const file of files) {
      if (!IMAGE_TYPES.includes(file.type)) {
        showToast("Only JPG, PNG or WEBP images are allowed");
        continue;
      }
      if (file.size > MAX_IMAGE) {
        showToast("Each image must be less than 4MB");
        continue;
      }
      accepted.push({ file, preview: URL.createObjectURL(file) });
    }
    setNewFiles((prev) => [...prev, ...accepted]);
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.category_id) e.category_id = "Choose a category";
    if (form.price === "" || Number(form.price) <= 0)
      e.price = "Enter a valid price";
    if (form.discount_price !== "") {
      const d = Number(form.discount_price);
      if (Number.isNaN(d) || d < 0)
        e.discount_price = "Enter a valid discount price";
      else if (d >= Number(form.price))
        e.discount_price = "Must be less than the price";
    }
    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    )
      e.stock = "Enter a valid stock quantity";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const base = {
      category_id: Number(form.category_id),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      is_active: form.is_active,
    };
    const discount =
      form.discount_price === "" ? null : Number(form.discount_price);

    setSaving(true);
    try {
      if (modal.mode === "add") {
        await createProduct({
          ...base,
          discount_price: discount ?? undefined,
          images: newFiles.map((f) => f.file),
        });
        showToast("Product added");
        setPage(1);
      } else {
        await updateProduct(modal.id, { ...base, discount_price: discount });

        // الصور الجديدة بتترفع واحدة واحدة
        let failed = 0;
        for (const f of newFiles) {
          try {
            await uploadProductImage(modal.id, f.file);
          } catch {
            failed += 1;
          }
        }
        showToast(
          failed
            ? `Saved, but ${failed} image(s) failed to upload`
            : "Product updated",
        );
      }

      clearNewFiles();
      setModal(null);
      await loadProducts();
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) {
        const e422 = error.errors || {};
        setErrors({
          name: e422.name?.[0],
          category_id: e422.category_id?.[0],
          price: e422.price?.[0],
          discount_price: e422.discount_price?.[0],
          stock: e422.stock?.[0],
        });
        showToast(error.message);
      } else {
        showToast(getErrorMessage(error));
      }
    } finally {
      setSaving(false);
    }
  };

  // ---------- صور المنتج الموجودة (في وضع التعديل) ----------
  const syncImages = async (productId) => {
    // نجيب المنتج من القائمة المحدّثة
    const { items } = await getProducts({
      page,
      search: debouncedSearch,
      categoryId: categoryFilter === "all" ? undefined : categoryFilter,
    });
    setProducts(items);
    const updated = items.find((p) => p.id === productId);
    setExistingImages(updated?.images ?? []);
  };

  const handleSetPrimary = async (img) => {
    if (imageBusyId || img.is_primary) return;
    setImageBusyId(img.id);
    try {
      await setPrimaryProductImage(modal.id, img.id);
      await syncImages(modal.id);
      showToast("Primary image updated");
    } catch (err) {
      showToast(getErrorMessage(err));
    } finally {
      setImageBusyId(null);
    }
  };

  const handleDeleteImage = async (img) => {
    if (imageBusyId) return;
    setImageBusyId(img.id);
    try {
      await deleteProductImage(modal.id, img.id);
      await syncImages(modal.id);
      showToast("Image deleted");
    } catch (err) {
      showToast(getErrorMessage(err));
    } finally {
      setImageBusyId(null);
    }
  };

  // ---------- Toggle active ----------
  const toggleActive = async (p) => {
    if (togglingId) return;
    setTogglingId(p.id);
    try {
      const updated = await updateProduct(p.id, {
        category_id: p.category?.id,
        name: p.name,
        description: p.description ?? "",
        price: p.price,
        discount_price: p.discount_price ?? null,
        stock: p.stock,
        is_active: !p.is_active,
      });
      setProducts((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
      showToast(updated.is_active ? "Product activated" : "Product hidden");
    } catch (err) {
      showToast(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  // ---------- Delete ----------
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      showToast("Product deleted");

      // لو الصفحة بقت فاضية نرجع صفحة
      if (products.length === 1 && page > 1) setPage((p) => p - 1);
      else await loadProducts();
    } catch (err) {
      showToast(getErrorMessage(err));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters =
    debouncedSearch || categoryFilter !== "all" || stockFilter !== "all";
  const noCategories = categories.length === 0;

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
          disabled={loading && products.length === 0}
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
            <span>Low stock (this page)</span>
            <strong>{summary.low}</strong>
          </div>
        </div>

        <div className="products-summary-card">
          <div className="products-summary-icon tone-danger">
            <PackageX size={22} />
          </div>
          <div>
            <span>Out of stock (this page)</span>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="products-filters">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="products-empty">
                    Loading products...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={6} className="products-empty">
                    <p>{loadError}</p>
                    <button
                      type="button"
                      className="products-btn-primary"
                      onClick={loadProducts}
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="products-empty">
                    {hasFilters
                      ? "No products match your filters."
                      : "No products yet. Add your first product."}
                  </td>
                </tr>
              ) : (
                visible.map((p) => {
                  const status = getStockStatus(p.stock);
                  const image = p.primary_image?.image_url;

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="product-cell">
                          <div className="product-thumb">
                            {image ? (
                              <img src={image} alt={p.name} />
                            ) : (
                              p.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <strong>{p.name}</strong>
                            <span>{p.description}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="category-chip">
                          {p.category?.name ?? "-"}
                        </span>
                      </td>

                      <td className="product-price">
                        {p.discount_price != null ? (
                          <>
                            <span>{formatEGP(p.discount_price)}</span>
                            <small className="product-old-price">
                              {formatEGP(p.price)}
                            </small>
                          </>
                        ) : (
                          formatEGP(p.price)
                        )}
                      </td>

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
                            checked={p.is_active}
                            disabled={togglingId === p.id}
                            onChange={() => toggleActive(p)}
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

        {!loading && !loadError && meta.last_page > 1 && (
          <div className="products-pagination">
            <span>
              Page {meta.current_page} of {meta.last_page} · {meta.total}{" "}
              products
            </span>
            <div>
              <button
                type="button"
                className="products-btn-secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.current_page <= 1}
              >
                Previous
              </button>
              <button
                type="button"
                className="products-btn-secondary"
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={meta.current_page >= meta.last_page}
              >
                Next
              </button>
            </div>
          </div>
        )}
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
              {noCategories && (
                <p className="pm-warning">
                  You have no categories yet. Create a category first from the
                  Categories page.
                </p>
              )}

              <div className="pm-field">
                <label htmlFor="pname">Product name</label>
                <input
                  id="pname"
                  type="text"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={errors.name ? "invalid" : ""}
                  placeholder="e.g. Wireless Headphones"
                />
                {errors.name && (
                  <small className="pm-error">{errors.name}</small>
                )}
              </div>

              <div className="pm-field">
                <label htmlFor="pcat">Category</label>
                <select
                  id="pcat"
                  value={form.category_id}
                  onChange={(e) => setField("category_id", e.target.value)}
                  className={errors.category_id ? "invalid" : ""}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <small className="pm-error">{errors.category_id}</small>
                )}
              </div>

              <div className="pm-row">
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
                  <label htmlFor="pdisc">Discount price</label>
                  <input
                    id="pdisc"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.discount_price}
                    onChange={(e) => setField("discount_price", e.target.value)}
                    className={errors.discount_price ? "invalid" : ""}
                    placeholder="Optional"
                  />
                  {errors.discount_price && (
                    <small className="pm-error">{errors.discount_price}</small>
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

              <div className="pm-field">
                <label>Images</label>

                <div className="pm-images">
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className={`pm-image ${img.is_primary ? "primary" : ""}`}
                    >
                      <img src={img.image_url} alt="" />
                      {img.is_primary && (
                        <span className="pm-image-badge">Primary</span>
                      )}
                      <div className="pm-image-actions">
                        {!img.is_primary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(img)}
                            disabled={!!imageBusyId}
                            aria-label="Set as primary"
                            title="Set as primary"
                          >
                            <Star size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img)}
                          disabled={!!imageBusyId}
                          aria-label="Delete image"
                          title="Delete image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {newFiles.map((f, i) => (
                    <div key={f.preview} className="pm-image new">
                      <img src={f.preview} alt="" />
                      <span className="pm-image-badge new">New</span>
                      <div className="pm-image-actions">
                        <button
                          type="button"
                          onClick={() => removeNewFile(i)}
                          aria-label="Remove"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <label className="pm-image-add">
                    <ImagePlus size={20} />
                    <span>Add</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handlePickImages}
                      hidden
                    />
                  </label>
                </div>
                <small className="pm-hint">
                  JPG, PNG or WEBP, up to 4MB each.
                </small>
              </div>

              <div className="pm-switch-row">
                <div>
                  <strong>Active</strong>
                  <span>Visible to customers when active</span>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setField("is_active", e.target.checked)}
                  />
                  <span className="switch-slider" />
                </label>
              </div>

              <div className="pm-actions">
                <button
                  type="button"
                  className="products-btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="products-btn-primary"
                  disabled={saving || noCategories}
                >
                  {saving
                    ? "Saving..."
                    : modal.mode === "add"
                      ? "Add Product"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="pm-overlay"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
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
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="products-btn-danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="pm-toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
