import { useState, useEffect, useRef } from "react";
import { Store, Clock, Bell, Lock, Check, Eye, EyeOff } from "lucide-react";
import { mockProvider } from "../../../features/providers/providerConfig";
import "./ProviderSettings.css";

const initialStore = {
  name: mockProvider.name,
  ownerName: mockProvider.ownerName,
  phone: "0100 123 4567",
  email: "provider@shoppingmr.com",
  address: "12 Tahrir St, Giza",
  description: "Fresh groceries delivered to your door.",
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
  const [store, setStore] = useState(initialStore);
  const [storeErrors, setStoreErrors] = useState({});
  const [hours, setHours] = useState(initialHours);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [password, setPassword] = useState(emptyPassword);
  const [passErrors, setPassErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  const setStoreField = (key, value) => {
    setStore((p) => ({ ...p, [key]: value }));
    setStoreErrors((p) => ({ ...p, [key]: undefined }));
  };

  const saveStore = (e) => {
    e.preventDefault();
    const err = {};
    if (!store.name.trim()) err.name = "Store name is required";
    if (!store.ownerName.trim()) err.ownerName = "Owner name is required";
    if (!/^\S+@\S+\.\S+$/.test(store.email)) err.email = "Enter a valid email";
    if (store.phone.replace(/\D/g, "").length < 10)
      err.phone = "Enter a valid phone number";
    setStoreErrors(err);
    if (Object.keys(err).length) return;
    showToast("Store info saved");
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
                <div className="store-logo">{store.name.charAt(0) || "S"}</div>
                <div>
                  <strong>Store logo</strong>
                  <span>
                    Logo upload will be available once the API is connected.
                  </span>
                </div>
              </div>

              <div className="st-grid">
                <div className="st-field">
                  <label htmlFor="s-name">Store name</label>
                  <input
                    id="s-name"
                    value={store.name}
                    onChange={(e) => setStoreField("name", e.target.value)}
                    className={storeErrors.name ? "invalid" : ""}
                  />
                  {storeErrors.name && <small>{storeErrors.name}</small>}
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
                    onChange={(e) => setStoreField("email", e.target.value)}
                    className={storeErrors.email ? "invalid" : ""}
                  />
                  {storeErrors.email && <small>{storeErrors.email}</small>}
                </div>

                <div className="st-field full">
                  <label htmlFor="s-address">Address</label>
                  <input
                    id="s-address"
                    value={store.address}
                    onChange={(e) => setStoreField("address", e.target.value)}
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
                  />
                </div>
              </div>

              <div className="panel-footer">
                <button type="submit" className="st-btn-primary">
                  Save Changes
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
