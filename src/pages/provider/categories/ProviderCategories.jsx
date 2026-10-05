import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check, Tags } from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryService";
import { ApiError } from "../../../services/apiClient";
import "./ProviderCategories.css";

const emptyForm = { name: "", is_active: true, sort_order: 1 };

const sortCategories = (list) =>
  [...list].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);

const getErrorMessage = (err) =>
  err instanceof ApiError && err.status === 500
    ? "Server error. Please try again later."
    : (err?.message ?? "Something went wrong.");

export default function ProviderCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

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

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const list = await getCategories();
      setCategories(sortCategories(list));
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreate = () => {
    const nextOrder =
      categories.reduce((max, c) => Math.max(max, c.sort_order ?? 0), 0) + 1;
    setForm({ name: "", is_active: true, sort_order: nextOrder });
    setFormErrors({});
    setModal({ mode: "create" });
  };

  const openEdit = (c) => {
    setForm({
      name: c.name,
      is_active: c.is_active,
      sort_order: c.sort_order,
    });
    setFormErrors({});
    setModal({ mode: "edit", id: c.id });
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
  };

  const setField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setFormErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = {};
    if (!form.name.trim()) err.name = "Category name is required";
    if (form.name.trim().length > 255) err.name = "Max 255 characters";
    const order = Number(form.sort_order);
    if (!Number.isInteger(order) || order < 0)
      err.sort_order = "Enter a valid number (0 or more)";
    setFormErrors(err);
    if (Object.keys(err).length) return;

    const payload = {
      name: form.name.trim(),
      is_active: form.is_active,
      sort_order: order,
    };

    setSaving(true);
    try {
      if (modal.mode === "create") {
        const created = await createCategory(payload);
        setCategories((prev) => sortCategories([...prev, created]));
        showToast("Category added");
      } else {
        const updated = await updateCategory(modal.id, payload);
        setCategories((prev) =>
          sortCategories(prev.map((c) => (c.id === modal.id ? updated : c))),
        );
        showToast("Category updated");
      }
      setModal(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) {
        const e422 = error.errors || {};
        setFormErrors({
          name: e422.name?.[0],
          sort_order: e422.sort_order?.[0],
        });
        if (!e422.name && !e422.sort_order) showToast(error.message);
      } else {
        showToast(getErrorMessage(error));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (c) => {
    if (togglingId) return;
    setTogglingId(c.id);
    try {
      const updated = await updateCategory(c.id, {
        name: c.name,
        is_active: !c.is_active,
        sort_order: c.sort_order,
      });
      setCategories((prev) => prev.map((x) => (x.id === c.id ? updated : x)));
      showToast(updated.is_active ? "Category activated" : "Category hidden");
    } catch (error) {
      showToast(getErrorMessage(error));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("Category deleted");
    } catch (error) {
      showToast(getErrorMessage(error));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="provider-categories">
      <div className="pc-header">
        <div>
          <h1>Categories</h1>
          <p>Organize your store products into categories.</p>
        </div>
        <button
          type="button"
          className="pc-btn-primary"
          onClick={openCreate}
          disabled={loading || !!loadError}
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <section className="pc-panel">
        {loading && <p className="pc-state">Loading categories...</p>}

        {!loading && loadError && (
          <div className="pc-state">
            <p>{loadError}</p>
            <button
              type="button"
              className="pc-btn-primary"
              onClick={loadCategories}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !loadError && categories.length === 0 && (
          <div className="pc-empty">
            <Tags size={36} />
            <strong>No categories yet</strong>
            <span>
              Create your first category to start organizing products.
            </span>
            <button
              type="button"
              className="pc-btn-primary"
              onClick={openCreate}
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>
        )}

        {!loading && !loadError && categories.length > 0 && (
          <div className="pc-table-wrap">
            <table className="pc-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Active</th>
                  <th className="pc-actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className={c.is_active ? "" : "inactive"}>
                    <td>{c.sort_order}</td>
                    <td className="pc-name">{c.name}</td>
                    <td className="pc-slug">{c.slug}</td>
                    <td>
                      <label className="pc-switch">
                        <input
                          type="checkbox"
                          checked={c.is_active}
                          disabled={togglingId === c.id}
                          onChange={() => handleToggle(c)}
                          aria-label={`Toggle ${c.name}`}
                        />
                        <span className="pc-switch-slider" />
                      </label>
                    </td>
                    <td className="pc-actions-col">
                      <div className="pc-actions">
                        <button
                          type="button"
                          className="pc-icon-btn"
                          onClick={() => openEdit(c)}
                          aria-label={`Edit ${c.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="pc-icon-btn danger"
                          onClick={() => setDeleteTarget(c)}
                          aria-label={`Delete ${c.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal && (
        <div className="pc-overlay" onClick={closeModal}>
          <div
            className="pc-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pc-modal-header">
              <h3>
                {modal.mode === "create" ? "Add Category" : "Edit Category"}
              </h3>
              <button
                type="button"
                className="pc-icon-btn"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="pc-field">
                <label htmlFor="c-name">Category name</label>
                <input
                  id="c-name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={formErrors.name ? "invalid" : ""}
                  placeholder="e.g. Clothes"
                  autoFocus
                />
                {formErrors.name && <small>{formErrors.name}</small>}
              </div>

              <div className="pc-field">
                <label htmlFor="c-order">Sort order</label>
                <input
                  id="c-order"
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={(e) => setField("sort_order", e.target.value)}
                  className={formErrors.sort_order ? "invalid" : ""}
                />
                {formErrors.sort_order && (
                  <small>{formErrors.sort_order}</small>
                )}
              </div>

              <div className="pc-field-row">
                <div>
                  <strong>Active</strong>
                  <span>Inactive categories are hidden from customers.</span>
                </div>
                <label className="pc-switch">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setField("is_active", e.target.checked)}
                    aria-label="Active"
                  />
                  <span className="pc-switch-slider" />
                </label>
              </div>

              <div className="pc-modal-footer">
                <button
                  type="button"
                  className="pc-btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pc-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : modal.mode === "create"
                      ? "Add Category"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="pc-overlay"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="pc-modal small"
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pc-modal-header">
              <h3>Delete category?</h3>
            </div>
            <p className="pc-confirm-text">
              <strong>{deleteTarget.name}</strong> will be permanently deleted.
              This action cannot be undone.
            </p>
            <div className="pc-modal-footer">
              <button
                type="button"
                className="pc-btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="pc-btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="pc-toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
