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
} from "lucide-react";
import { updateAuthUser } from "../../../services/authStorage";
import {
  getProviderProfile,
  updateProviderProfile,
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
};

// تحويل response الـ GET /provider/profile لشكل الفورم
// ⚠️ أسماء الحقول تخمين لحد ما نشوف الـ response الحقيقي
const mapProfile = (data) => {
  const d = data ?? {};
  const user = d.user ?? d.profile ?? d;
  const provider = d.provider ?? user.provider ?? {};
  const storeObj = d.store ?? provider.store ?? user.store ?? {};
  const addresses = d.addresses ?? provider.addresses ?? user.addresses ?? [];
  const addr = Array.isArray(addresses) ? addresses[0] : null;

  const address =
    typeof addr === "string"
      ? addr
      : (addr?.full_address ??
        addr?.address ??
        [addr?.street, addr?.city].filter(Boolean).join(", "));

  return {
    store: {
      name: storeObj.store_name ?? storeObj.name ?? "",
      ownerName: user.full_name ?? d.full_name ?? "",
      phone: user.phone ?? d.phone ?? "",
      email: user.email ?? d.email ?? "",
      address: address ?? "",
      description:
        user.description ??
        provider.description ??
        storeObj.description ??
        d.description ??
        "",
    },
    image: fixImageUrl(
      user.profile_image_url ?? d.profile_image_url ?? storeObj.logo_url ?? "",
    ),
  };
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

const initialHours = days.reduce((acc, d) => {
  acc[d] = { open: d !== "Friday", from: "09:00", to: "22:00" };
  return acc;
}, {});

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

const tabs = [
  { key: "store", label: "Store Info", icon: Store },
  { key: "hours", label: "Working Hours", icon: Clock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Lock },
];

const emptyPassword = { current: "", next: "", confirm: "" };

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

export default function ProviderSettings() {
  const [tab, setTab] = useState("store");
  const [store, setStore] = useState(emptyStore);
  const [storeErrors, setStoreErrors] = useState({});
  const [hours, setHours] = useState(initialHours);
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

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  // جلب البيانات من GET /provider/profile
  const loadProfile = useCallback(async () => {
    setLoadingProfile(true);
    setLoadError("");

    try {
      const data = await getProviderProfile();
      console.log("provider profile:", data); // ابعتيهولي لو حقل طلع فاضي

      const mapped = mapProfile(data);
      setStore(mapped.store);
      setImagePreview(mapped.image);
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

  const setStoreField = (key, value) => {
    setStore((p) => ({ ...p, [key]: value }));
    setStoreErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleImage = (e) => {
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

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const saveStore = async (e) => {
    e.preventDefault();

    const err = {};
    if (!store.ownerName.trim()) err.ownerName = "Owner name is required";
    if (store.phone.replace(/\D/g, "").length < 10)
      err.phone = "Enter a valid phone number";
    setStoreErrors(err);
    if (Object.keys(err).length) return;

    setSavingStore(true);
    try {
      await updateProviderProfile({
        full_name: store.ownerName,
        phone: normalizePhone(store.phone),
        description: store.description,
        profile_image: imageFile,
      });

      setImageFile(null);

      // نجيب البيانات من الـ endpoint تاني عشان نعرض اللي اتحفظ فعلاً
      try {
        const fresh = mapProfile(await getProviderProfile());
        setStore(fresh.store);
        setImagePreview(fresh.image);

        // نحدّث الاسم والصورة اللي بيظهروا في الـ Header
        updateAuthUser({
          full_name: fresh.store.ownerName,
          phone: fresh.store.phone,
        });
      } catch {
        updateAuthUser({
          full_name: store.ownerName,
          phone: normalizePhone(store.phone),
        });
      }

      showToast("Store info saved");
    } catch (error) {
      if (error instanceof ApiError) {
        const apiErrors = error.errors || {};
        setStoreErrors({
          ownerName: apiErrors.full_name?.[0],
          phone: apiErrors.phone?.[0],
          description: apiErrors.description?.[0],
        });
        showToast(
          error.status === 500
            ? "Server error. Please try again later."
            : error.message,
        );
      } else {
        showToast("Unexpected error occurred");
      }
    } finally {
      setSavingStore(false);
    }
  };

  const setDay = (day, patch) =>
    setHours((p) => ({ ...p, [day]: { ...p[day], ...patch } }));

  const saveHours = () => {
    const invalid = days.find(
      (d) => hours[d].open && hours[d].from >= hours[d].to,
    );
    if (invalid) {
      showToast(`${invalid}: closing time must be after opening time`);
      return;
    }
    showToast("Working hours saved");
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

  return (
    <div className="provider-settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your store, working hours and account preferences.</p>
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
                <h3>Store Info</h3>
                <span>This information is visible to your customers.</span>
              </div>

              <div className="store-logo-row">
                <div className="store-logo">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "inherit",
                      }}
                    />
                  ) : (
                    store.name.charAt(0) || "S"
                  )}
                </div>
                <div>
                  <strong>Profile image</strong>
                  <label className="st-link-btn" style={{ cursor: "pointer" }}>
                    <Camera size={16} /> Change image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImage}
                      hidden
                    />
                  </label>
                </div>
              </div>

              <div className="st-grid">
                <div className="st-field">
                  <label htmlFor="s-name">Store name</label>
                  <input
                    id="s-name"
                    value={store.name}
                    readOnly
                    className="readonly"
                  />
                </div>

                <div className="st-field">
                  <label htmlFor="s-owner">Owner name</label>
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

          {tab === "hours" && (
            <div>
              <div className="panel-title">
                <h3>Working Hours</h3>
                <span>Set when your store accepts orders.</span>
              </div>

              <ul className="hours-list">
                {days.map((d) => (
                  <li key={d} className={hours[d].open ? "" : "closed"}>
                    <div className="hours-day">
                      <Switch
                        checked={hours[d].open}
                        onChange={(e) => setDay(d, { open: e.target.checked })}
                        label={`Toggle ${d}`}
                      />
                      <strong>{d}</strong>
                    </div>

                    {hours[d].open ? (
                      <div className="hours-times">
                        <input
                          type="time"
                          value={hours[d].from}
                          onChange={(e) => setDay(d, { from: e.target.value })}
                          aria-label={`${d} opening time`}
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={hours[d].to}
                          onChange={(e) => setDay(d, { to: e.target.value })}
                          aria-label={`${d} closing time`}
                        />
                      </div>
                    ) : (
                      <span className="hours-closed">Closed</span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="panel-footer">
                <button
                  type="button"
                  className="st-btn-primary"
                  onClick={saveHours}
                >
                  Save Changes
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
