import { useState, useEffect, useRef, useCallback } from "react";
import {
  Store,
  Clock,
  Bell,
  Lock,
  Check,
  Eye,
  EyeOff,
  Camera,
  FileText,
  Download,
  Plus,
  Trash2,
} from "lucide-react";
import { getAuth, updateAuthUser } from "../../../services/authStorage";
import {
  getProviderProfile,
  updateProviderProfile,
  updateProviderService,
  updateProviderStore,
  getProviderDocuments,
  downloadProviderDocument,
} from "../../../services/providerService";
import { ApiError } from "../../../services/apiClient";
import { normalizePhone } from "../../../utils/phone";
import { fixImageUrl } from "../../../utils/image";
import "./ProviderSettings.css";

const emptyStore = {
  name: "",
  ownerName: "",
  phone: "",
  email: "",
  address: "",
  description: "",
  category: "",
  price: "",
  experienceYears: "",
};

const documentLabels = {
  personal_id_front: "Personal ID (front)",
  personal_id_back: "Personal ID (back)",
  police_clearance: "Police clearance",
  commercial_registration: "Commercial registration",
  tax_card: "Tax card",
};

const documentStatusLabels = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

const getDocumentLabel = (type = "") =>
  documentLabels[type] ??
  type.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

// ⚠️ ترقيم الأيام المفترض (زي Carbon): 0 = Sunday ... 6 = Saturday
// لو الباك اند بيستخدم ترقيم تاني عدّلي هنا بس.
const DAY_NUMBERS = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const DEFAULT_SLOT = { from: "09:00", to: "09:45" };

const trimTime = (t) => (t ?? "").slice(0, 5); // "09:00:00" -> "09:00"

const toMinutes = (t) => {
  const [h, m] = (t || "0:0").split(":").map(Number);
  return h * 60 + m;
};

const fromMinutes = (total) => {
  const clamped = Math.min(Math.max(total, 0), 23 * 60 + 59);
  const h = String(Math.floor(clamped / 60)).padStart(2, "0");
  const m = String(clamped % 60).padStart(2, "0");
  return `${h}:${m}`;
};

let slotCounter = 0;
const newSlot = (from, to) => ({
  key: `slot-${++slotCounter}`,
  from,
  to,
});

// availability (من الـ API) -> { اليوم: [slots] }
const buildHours = (availability) => {
  const list = Array.isArray(availability) ? availability : [];
  const hours = {};

  days.forEach((d) => {
    hours[d] = list
      .filter((a) => Number(a.day_of_week) === DAY_NUMBERS[d])
      .sort((a, b) => toMinutes(a.starts_at) - toMinutes(b.starts_at))
      .map((a) => newSlot(trimTime(a.starts_at), trimTime(a.ends_at)));
  });

  return hours;
};

// الواجهة -> availability (للـ API)
const buildAvailability = (hours) =>
  days.flatMap((d) =>
    hours[d].map((s) => ({
      day_of_week: DAY_NUMBERS[d],
      starts_at: s.from,
      ends_at: s.to,
    })),
  );

// بيرجّع رسالة خطأ لو في slot غلط أو متداخل
const validateHours = (hours) => {
  for (const d of days) {
    const sorted = [...hours[d]].sort(
      (a, b) => toMinutes(a.from) - toMinutes(b.from),
    );

    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      if (!s.from || !s.to) return `${d}: fill in the start and end time`;
      if (toMinutes(s.from) >= toMinutes(s.to))
        return `${d}: end time must be after start time`;
      if (i > 0 && toMinutes(s.from) < toMinutes(sorted[i - 1].to))
        return `${d}: time slots can't overlap`;
    }
  }
  return "";
};

const formatAddress = (addr) => {
  if (!addr) return "";
  return [addr.address_details, addr.area, addr.city]
    .filter(Boolean)
    .join(", ");
};

// تحويل response الـ GET /provider/profile لشكل الصفحة
const mapProfile = (data) => {
  const d = data ?? {};
  const user = d.user ?? {};
  const addresses = Array.isArray(d.addresses) ? d.addresses : [];
  const addr = addresses.find((a) => a.is_default) ?? addresses[0];
  const service = d.service ?? null;

  return {
    isService: d.provider_type === "service",
    hasStore: !!d.store,
    store: {
      name: d.store?.store_name ?? "",
      ownerName: user.full_name ?? "",
      phone: user.phone ?? "",
      email: user.email ?? "",
      address: formatAddress(addr),
      description: d.description ?? "",
      category: d.category?.name ?? "",
      price: service?.price != null ? String(service.price) : "",
      experienceYears:
        service?.experience_years != null
          ? String(service.experience_years)
          : "",
    },
    image: fixImageUrl(user.profile_image_url ?? ""),
    logo: fixImageUrl(d.store?.logo_url ?? ""),
    service: {
      exists: !!service,
      price: service?.price ?? null,
      experienceYears: service?.experience_years ?? null,
    },
    available: service?.is_available ?? true,
    hours: buildHours(service?.availability),
  };
};

// تحديث بيانات الـ Header والـ Sidebar المخزّنة
const syncHeader = (data) => {
  const user = data?.user ?? {};
  const current = getAuth()?.user?.provider ?? {};

  updateAuthUser({
    full_name: user.full_name,
    phone: user.phone,
    profile_image_url: user.profile_image_url,
    provider: {
      ...current,
      store: data?.store ?? current.store ?? null,
      approval_status: data?.approval_status ?? current.approval_status,
    },
  });
};

const initialNotifications = {
  newOrder: true,
  orderStatus: true,
  lowStock: true,
  reviews: false,
  promotions: false,
  email: true,
};

const notificationItems = [
  {
    key: "newOrder",
    title: "New orders",
    desc: "Get notified when a customer places an order.",
  },
  {
    key: "orderStatus",
    title: "Order updates",
    desc: "Status changes and cancellations.",
  },
  {
    key: "lowStock",
    title: "Low stock alerts",
    desc: "When a product is about to run out.",
  },
  {
    key: "reviews",
    title: "New reviews",
    desc: "When customers rate your products.",
  },
  {
    key: "promotions",
    title: "Promotions & news",
    desc: "Tips and updates from Shopping Mr.",
  },
  {
    key: "email",
    title: "Email notifications",
    desc: "Also receive notifications by email.",
  },
];

const allTabs = [
  { key: "store", label: "Store Info", icon: Store },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "hours", label: "Working Hours", icon: Clock, serviceOnly: true },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Lock },
];

const emptyPassword = { current: "", next: "", confirm: "" };

const getErrorMessage = (err) =>
  err instanceof ApiError && err.status === 500
    ? "Server error. Please try again later."
    : (err?.message ?? "Something went wrong.");

function Switch({ checked, onChange, label }) {
  return (
    <label className="st-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <span className="st-switch-slider" />
    </label>
  );
}

function ImageRow({ title, preview, fallback, onChange, error, buttonLabel }) {
  return (
    <div className="store-logo-row">
      <div className="store-logo">
        {preview ? (
          <img
            src={preview}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "inherit",
            }}
          />
        ) : (
          fallback
        )}
      </div>
      <div>
        <strong>{title}</strong>
        <label className="st-link-btn" style={{ cursor: "pointer" }}>
          <Camera size={16} /> {buttonLabel}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onChange}
            hidden
          />
        </label>
        {error && <small className="st-image-error">{error}</small>}
      </div>
    </div>
  );
}

export default function ProviderSettings() {
  const [tab, setTab] = useState("store");
  const [store, setStore] = useState(emptyStore);
  const [isService, setIsService] = useState(false);
  const [hasStore, setHasStore] = useState(false);
  const [storeErrors, setStoreErrors] = useState({});
  const [notifications, setNotifications] = useState(initialNotifications);
  const [password, setPassword] = useState(emptyPassword);
  const [passErrors, setPassErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savingStore, setSavingStore] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  // بيانات الخدمة (للتاجر الخدمي)
  const [serviceSaved, setServiceSaved] = useState({
    exists: false,
    price: null,
    experienceYears: null,
  });
  const [available, setAvailable] = useState(true);
  const [hours, setHours] = useState(() => buildHours([]));
  const [savingHours, setSavingHours] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docsLoaded, setDocsLoaded] = useState(false);
  const [docsError, setDocsError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  // form: يحدّث فورم البيانات | hoursPart: يحدّث مواعيد العمل
  const applyProfile = (data, { form = true, hoursPart = true } = {}) => {
    const mapped = mapProfile(data);

    setIsService(mapped.isService);
    setHasStore(mapped.hasStore);
    setServiceSaved(mapped.service);

    if (form) {
      setStore(mapped.store);
      setImagePreview(mapped.image);
      setLogoPreview(mapped.logo);
    }

    if (hoursPart) {
      setAvailable(mapped.available);
      setHours(mapped.hours);
    }

    syncHeader(data);
  };

  const loadProfile = useCallback(async () => {
    setLoadingProfile(true);
    setLoadError("");

    try {
      const data = await getProviderProfile();
      applyProfile(data);
    } catch (err) {
      setLoadError(
        err instanceof ApiError && err.status === 500
          ? "Server error while loading your profile. Please try again later."
          : (err.message ?? "Could not load your profile."),
      );
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // جلب الأوراق أول ما يفتح تاب Documents
  const loadDocuments = useCallback(async () => {
    setDocsLoading(true);
    setDocsError("");

    try {
      const list = await getProviderDocuments();
      setDocuments(list);
      setDocsLoaded(true);
    } catch (err) {
      setDocsError(
        err instanceof ApiError && err.status === 500
          ? "Server error while loading your documents. Please try again later."
          : (err.message ?? "Could not load your documents."),
      );
    } finally {
      setDocsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "documents" && !docsLoaded && !docsLoading) {
      loadDocuments();
    }
  }, [tab, docsLoaded, docsLoading, loadDocuments]);

  const handleDownload = async (doc) => {
    if (downloadingId) return;
    setDownloadingId(doc.id);
    try {
      await downloadProviderDocument(doc.id, doc.document_type);
    } catch (err) {
      showToast(getErrorMessage(err));
    } finally {
      setDownloadingId(null);
    }
  };

  const setStoreField = (key, value) => {
    setStore((p) => ({ ...p, [key]: value }));
    setStoreErrors((p) => ({ ...p, [key]: undefined }));
  };

  const pickImage = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Only JPG, PNG or WEBP images are allowed");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showToast("Image must be less than 4MB");
      return;
    }

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const saveStore = async (e) => {
    e.preventDefault();

    const err = {};
    if (!store.ownerName.trim()) err.ownerName = "Owner name is required";
    if (store.phone.replace(/\D/g, "").length < 10)
      err.phone = "Enter a valid phone number";

    if (isService) {
      const price = Number(store.price);
      const years = Number(store.experienceYears);
      if (store.price === "" || Number.isNaN(price) || price < 0)
        err.price = "Enter a valid price";
      if (
        store.experienceYears === "" ||
        !Number.isInteger(years) ||
        years < 0
      )
        err.experienceYears = "Enter a valid number of years";
    } else {
      if (hasStore && !store.name.trim()) err.name = "Store name is required";
      if (store.name.trim().length > 255) err.name = "Max 255 characters";
    }

    setStoreErrors(err);
    if (Object.keys(err).length) return;

    setSavingStore(true);
    try {
      let latest = await updateProviderProfile({
        full_name: store.ownerName,
        phone: normalizePhone(store.phone),
        description: store.description,
        profile_image: imageFile,
      });

      if (isService) {
        // السعر والخبرة. وبنبعت is_available الحالي عشان ما يتغيّرش
        latest = await updateProviderService({
          price: Number(store.price),
          experience_years: Number(store.experienceYears),
          is_available: available,
        });
      } else if (hasStore || store.name.trim()) {
        // اسم المتجر واللوجو (وينشئ المتجر لو مش موجود)
        latest = await updateProviderStore({
          store_name: store.name.trim(),
          logo: logoFile,
        });
      }

      setImageFile(null);
      setLogoFile(null);
      if (latest) applyProfile(latest, { form: true, hoursPart: false });
      showToast(
        !isService && !hasStore && store.name.trim()
          ? "Store created"
          : "Changes saved",
      );
    } catch (error) {
      if (error instanceof ApiError) {
        const apiErrors = error.errors || {};
        setStoreErrors({
          name: apiErrors.store_name?.[0],
          logo: apiErrors.logo?.[0],
          ownerName: apiErrors.full_name?.[0],
          phone: apiErrors.phone?.[0],
          description: apiErrors.description?.[0],
          price: apiErrors.price?.[0],
          experienceYears: apiErrors.experience_years?.[0],
        });
      }
      showToast(getErrorMessage(error));
    } finally {
      setSavingStore(false);
    }
  };

  // ---------- مواعيد العمل (slots) ----------
  const addSlot = (day) =>
    setHours((prev) => {
      const list = prev[day];
      let slot;

      if (list.length === 0) {
        slot = newSlot(DEFAULT_SLOT.from, DEFAULT_SLOT.to);
      } else {
        const last = list[list.length - 1];
        const duration = Math.max(
          toMinutes(last.to) - toMinutes(last.from),
          15,
        );
        const start = toMinutes(last.to) + 15; // 15 دقيقة راحة
        slot = newSlot(fromMinutes(start), fromMinutes(start + duration));
      }

      return { ...prev, [day]: [...list, slot] };
    });

  const updateSlot = (day, key, patch) =>
    setHours((prev) => ({
      ...prev,
      [day]: prev[day].map((s) => (s.key === key ? { ...s, ...patch } : s)),
    }));

  const removeSlot = (day, key) =>
    setHours((prev) => ({
      ...prev,
      [day]: prev[day].filter((s) => s.key !== key),
    }));

  // تشغيل/إيقاف اليوم: التشغيل بيضيف slot افتراضي
  const toggleDay = (day, open) =>
    setHours((prev) => ({
      ...prev,
      [day]: open ? [newSlot(DEFAULT_SLOT.from, DEFAULT_SLOT.to)] : [],
    }));

  // حفظ مواعيد العمل + سويتش "بقبل حجوزات" (للتاجر الخدمي)
  const saveHours = async () => {
    const problem = validateHours(hours);
    if (problem) {
      showToast(problem);
      return;
    }

    if (serviceSaved.price == null || serviceSaved.experienceYears == null) {
      showToast("Save your price and experience in Profile Info first");
      return;
    }

    setSavingHours(true);
    try {
      const latest = await updateProviderService({
        price: serviceSaved.price,
        experience_years: serviceSaved.experienceYears,
        is_available: available,
        availability: buildAvailability(hours),
      });

      if (latest) applyProfile(latest, { form: false, hoursPart: true });
      showToast("Working hours saved");
    } catch (error) {
      showToast(getErrorMessage(error));
    } finally {
      setSavingHours(false);
    }
  };

  const saveNotifications = () => {
    showToast("Notification preferences saved");
  };

  const setPassField = (key, value) => {
    setPassword((p) => ({ ...p, [key]: value }));
    setPassErrors((p) => ({ ...p, [key]: undefined }));
  };

  const savePassword = (e) => {
    e.preventDefault();
    const err = {};
    if (!password.current) err.current = "Enter your current password";
    if (password.next.length < 8) err.next = "At least 8 characters";
    if (password.confirm !== password.next)
      err.confirm = "Passwords don't match";
    setPassErrors(err);
    if (Object.keys(err).length) return;
    setPassword(emptyPassword);
    showToast("Password updated");
  };

  if (loadingProfile) {
    return (
      <div className="provider-settings">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="provider-settings">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>{loadError}</p>
        </div>
        <div>
          <button
            type="button"
            className="st-btn-primary"
            onClick={loadProfile}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = allTabs.filter((t) => !t.serviceOnly || isService);
  const avatarFallback =
    (store.name || store.ownerName).charAt(0).toUpperCase() || "S";

  return (
    <div className="provider-settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your profile, documents and account preferences.</p>
      </div>

      <div className="settings-layout">
        <nav className="settings-tabs">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                className={`settings-tab ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                <Icon size={18} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        <section className="settings-panel">
          {tab === "store" && (
            <form onSubmit={saveStore} noValidate>
              <div className="panel-title">
                <h3>{isService ? "Profile Info" : "Store Info"}</h3>
                <span>This information is visible to your customers.</span>
              </div>

              {!isService && (
                <ImageRow
                  title="Store logo"
                  preview={logoPreview}
                  fallback={store.name.charAt(0).toUpperCase() || "S"}
                  buttonLabel="Change logo"
                  error={storeErrors.logo}
                  onChange={(e) => pickImage(e, setLogoFile, setLogoPreview)}
                />
              )}

              <ImageRow
                title="Profile image"
                preview={imagePreview}
                fallback={avatarFallback}
                buttonLabel="Change image"
                onChange={(e) => pickImage(e, setImageFile, setImagePreview)}
              />

              <div className="st-grid">
                {!isService && (
                  <div className="st-field">
                    <label htmlFor="s-name">Store name</label>
                    <input
                      id="s-name"
                      value={store.name}
                      onChange={(e) => setStoreField("name", e.target.value)}
                      className={storeErrors.name ? "invalid" : ""}
                      placeholder="e.g. Tech Haven Store"
                    />
                    {storeErrors.name && <small>{storeErrors.name}</small>}
                    {!hasStore && !storeErrors.name && (
                      <span className="st-hint">
                        Your store isn't created yet. Enter a name and save to
                        create it.
                      </span>
                    )}
                  </div>
                )}

                {isService && (
                  <div className="st-field">
                    <label htmlFor="s-category">Specialty</label>
                    <input
                      id="s-category"
                      value={store.category}
                      readOnly
                      className="readonly"
                    />
                  </div>
                )}

                <div className="st-field">
                  <label htmlFor="s-owner">
                    {isService ? "Full name" : "Owner name"}
                  </label>
                  <input
                    id="s-owner"
                    value={store.ownerName}
                    onChange={(e) => setStoreField("ownerName", e.target.value)}
                    className={storeErrors.ownerName ? "invalid" : ""}
                  />
                  {storeErrors.ownerName && (
                    <small>{storeErrors.ownerName}</small>
                  )}
                </div>

                <div className="st-field">
                  <label htmlFor="s-phone">Phone</label>
                  <input
                    id="s-phone"
                    value={store.phone}
                    onChange={(e) => setStoreField("phone", e.target.value)}
                    className={storeErrors.phone ? "invalid" : ""}
                  />
                  {storeErrors.phone && <small>{storeErrors.phone}</small>}
                </div>

                <div className="st-field">
                  <label htmlFor="s-email">Email</label>
                  <input
                    id="s-email"
                    type="email"
                    value={store.email}
                    readOnly
                    className="readonly"
                  />
                </div>

                {isService && (
                  <>
                    <div className="st-field">
                      <label htmlFor="s-price">Service price (EGP)</label>
                      <input
                        id="s-price"
                        type="number"
                        min="0"
                        value={store.price}
                        onChange={(e) => setStoreField("price", e.target.value)}
                        className={storeErrors.price ? "invalid" : ""}
                      />
                      {storeErrors.price && <small>{storeErrors.price}</small>}
                    </div>

                    <div className="st-field">
                      <label htmlFor="s-exp">Years of experience</label>
                      <input
                        id="s-exp"
                        type="number"
                        min="0"
                        value={store.experienceYears}
                        onChange={(e) =>
                          setStoreField("experienceYears", e.target.value)
                        }
                        className={storeErrors.experienceYears ? "invalid" : ""}
                      />
                      {storeErrors.experienceYears && (
                        <small>{storeErrors.experienceYears}</small>
                      )}
                    </div>
                  </>
                )}

                <div className="st-field full">
                  <label htmlFor="s-address">Address</label>
                  <input
                    id="s-address"
                    value={store.address}
                    readOnly
                    className="readonly"
                    placeholder="Addresses are managed separately"
                  />
                </div>

                <div className="st-field full">
                  <label htmlFor="s-desc">Description</label>
                  <textarea
                    id="s-desc"
                    rows={4}
                    value={store.description}
                    onChange={(e) =>
                      setStoreField("description", e.target.value)
                    }
                    className={storeErrors.description ? "invalid" : ""}
                  />
                  {storeErrors.description && (
                    <small>{storeErrors.description}</small>
                  )}
                </div>
              </div>

              <div className="panel-footer">
                <button
                  type="submit"
                  className="st-btn-primary"
                  disabled={savingStore}
                >
                  {savingStore ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {tab === "documents" && (
            <div>
              <div className="panel-title">
                <h3>Documents</h3>
                <span>
                  Documents submitted for your account. You can download them
                  but not edit them.
                </span>
              </div>

              {docsLoading && <p className="doc-state">Loading documents...</p>}

              {!docsLoading && docsError && (
                <div className="doc-state">
                  <p>{docsError}</p>
                  <button
                    type="button"
                    className="st-btn-primary"
                    onClick={loadDocuments}
                  >
                    Retry
                  </button>
                </div>
              )}

              {!docsLoading && !docsError && documents.length === 0 && (
                <p className="doc-state">No documents found.</p>
              )}

              {!docsLoading && !docsError && documents.length > 0 && (
                <ul className="doc-list">
                  {documents.map((doc) => (
                    <li key={doc.id}>
                      <div className="doc-info">
                        <div className="doc-icon">
                          <FileText size={18} />
                        </div>
                        <div>
                          <strong>{getDocumentLabel(doc.document_type)}</strong>
                          <span className={`doc-status ${doc.status}`}>
                            {documentStatusLabels[doc.status] ?? doc.status}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="doc-download"
                        onClick={() => handleDownload(doc)}
                        disabled={downloadingId === doc.id}
                      >
                        <Download size={16} />
                        {downloadingId === doc.id
                          ? "Downloading..."
                          : "Download"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "hours" && isService && (
            <div>
              <div className="panel-title">
                <h3>Working Hours</h3>
                <span>
                  Add one or more time slots for each day. Customers can only
                  book free slots inside these times.
                </span>
              </div>

              <ul className="notif-list">
                <li>
                  <div>
                    <strong>Accepting bookings</strong>
                    <span>Turn off to pause new appointments.</span>
                  </div>
                  <Switch
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    label="Accepting bookings"
                  />
                </li>
              </ul>

              <ul className="hours-list">
                {days.map((d) => {
                  const slots = hours[d];
                  const isOpen = slots.length > 0;

                  return (
                    <li
                      key={d}
                      className={`hours-day-row ${isOpen ? "" : "closed"}`}
                    >
                      <div className="hours-day">
                        <Switch
                          checked={isOpen}
                          onChange={(e) => toggleDay(d, e.target.checked)}
                          label={`Toggle ${d}`}
                        />
                        <strong>{d}</strong>
                      </div>

                      {isOpen ? (
                        <div className="slots">
                          {slots.map((s) => (
                            <div className="slot-row" key={s.key}>
                              <input
                                type="time"
                                value={s.from}
                                onChange={(e) =>
                                  updateSlot(d, s.key, { from: e.target.value })
                                }
                                aria-label={`${d} slot start`}
                              />
                              <span>to</span>
                              <input
                                type="time"
                                value={s.to}
                                onChange={(e) =>
                                  updateSlot(d, s.key, { to: e.target.value })
                                }
                                aria-label={`${d} slot end`}
                              />
                              <button
                                type="button"
                                className="slot-remove"
                                onClick={() => removeSlot(d, s.key)}
                                aria-label={`Remove ${d} slot`}
                                title="Remove slot"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            className="st-link-btn"
                            onClick={() => addSlot(d)}
                          >
                            <Plus size={15} /> Add slot
                          </button>
                        </div>
                      ) : (
                        <span className="hours-closed">Closed</span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="panel-footer">
                <button
                  type="button"
                  className="st-btn-primary"
                  onClick={saveHours}
                  disabled={savingHours}
                >
                  {savingHours ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div>
              <div className="panel-title">
                <h3>Notifications</h3>
                <span>Choose what you want to be notified about.</span>
              </div>

              <ul className="notif-list">
                {notificationItems.map((n) => (
                  <li key={n.key}>
                    <div>
                      <strong>{n.title}</strong>
                      <span>{n.desc}</span>
                    </div>
                    <Switch
                      checked={notifications[n.key]}
                      onChange={(e) =>
                        setNotifications((p) => ({
                          ...p,
                          [n.key]: e.target.checked,
                        }))
                      }
                      label={n.title}
                    />
                  </li>
                ))}
              </ul>

              <div className="panel-footer">
                <button
                  type="button"
                  className="st-btn-primary"
                  onClick={saveNotifications}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {tab === "security" && (
            <form onSubmit={savePassword} noValidate>
              <div className="panel-title">
                <h3>Security</h3>
                <span>Update your password to keep your account safe.</span>
              </div>

              <div className="st-grid single">
                {[
                  { key: "current", label: "Current password" },
                  { key: "next", label: "New password" },
                  { key: "confirm", label: "Confirm new password" },
                ].map((f) => (
                  <div className="st-field" key={f.key}>
                    <label htmlFor={`p-${f.key}`}>{f.label}</label>
                    <div className="st-password">
                      <input
                        id={`p-${f.key}`}
                        type={showPass ? "text" : "password"}
                        value={password[f.key]}
                        onChange={(e) => setPassField(f.key, e.target.value)}
                        className={passErrors[f.key] ? "invalid" : ""}
                        autoComplete={
                          f.key === "current"
                            ? "current-password"
                            : "new-password"
                        }
                      />
                    </div>
                    {passErrors[f.key] && <small>{passErrors[f.key]}</small>}
                  </div>
                ))}

                <button
                  type="button"
                  className="st-link-btn"
                  onClick={() => setShowPass((s) => !s)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPass ? "Hide passwords" : "Show passwords"}
                </button>
              </div>

              <div className="panel-footer">
                <button type="submit" className="st-btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          )}
        </section>
      </div>

      {toast && (
        <div className="st-toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}