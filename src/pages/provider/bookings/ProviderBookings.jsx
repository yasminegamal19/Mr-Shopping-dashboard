import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  CalendarDays,
  Clock,
  Check,
  X,
  Trash2,
  CircleCheck,
  CircleX,
  Hourglass,
} from "lucide-react";
import {
  getReservations,
  approveReservation,
  cancelReservation,
  deleteReservation,
} from "../../../services/reservationService";
import { ApiError } from "../../../services/apiClient";
import "./ProviderBookings.css";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
];

const statusLabel = (s = "") =>
  STATUS_FILTERS.find((f) => f.value === s)?.label ??
  s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

const getErrorMessage = (err) =>
  err instanceof ApiError && err.status === 500
    ? "Server error. Please try again later."
    : (err?.message ?? "Something went wrong.");

// "18:00:00" -> "06:00 PM"
const formatTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h)) return t;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${String(m || 0).padStart(2, "0")} ${suffix}`;
};

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(`${d}T00:00:00`);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatEGP = (n) =>
  n == null || n === "" ? "-" : `EGP ${Number(n).toLocaleString()}`;

// ⚠️ أسماء حقول العميل تخمين لحد ما نشوف response حقيقي
const mapReservation = (r) => {
  const client = r.client ?? r.customer ?? r.user ?? {};
  return {
    id: r.id,
    status: r.status ?? "",
    date: r.reservation_date ?? r.date ?? "",
    time: r.display_time ?? formatTime(r.slot_time ?? r.time),
    rawTime: r.slot_time ?? r.time ?? "",
    price: r.price ?? r.service?.price,
    notes: r.notes ?? "",
    clientName:
      client.full_name ??
      client.name ??
      r.client_name ??
      r.customer_name ??
      "Customer",
    clientPhone: client.phone ?? r.client_phone ?? r.customer_phone ?? "",
    cancelReason: r.cancellation_reason ?? r.cancel_reason ?? "",
  };
};

const canApprove = (s) => s === "pending";
const canCancel = (s) => s === "pending" || s === "confirmed";

export default function ProviderBookings() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");

  const [busyId, setBusyId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [reason, setReason] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const list = await getReservations({ status, date });
      if (list[0]) console.log("reservation sample:", list[0]); // ابعتيهولي
      setReservations(list.map(mapReservation));
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status, date]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !busyId) {
        setCancelTarget(null);
        setDeleteTarget(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busyId]);

  // الأحدث أول (بالتاريخ ثم الوقت)
  const sorted = useMemo(
    () =>
      [...reservations].sort((a, b) =>
        `${b.date} ${b.rawTime}`.localeCompare(`${a.date} ${a.rawTime}`),
      ),
    [reservations],
  );

  const summary = useMemo(
    () => ({
      total: reservations.length,
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
    }),
    [reservations],
  );

  const runAction = async (id, action, successMsg) => {
    setBusyId(id);
    try {
      await action();
      showToast(successMsg);
      await load();
      return true;
    } catch (err) {
      showToast(getErrorMessage(err));
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const handleApprove = (r) =>
    runAction(r.id, () => approveReservation(r.id), "Reservation approved");

  const openCancel = (r) => {
    setReason("");
    setCancelTarget(r);
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    const ok = await runAction(
      cancelTarget.id,
      () => cancelReservation(cancelTarget.id, reason.trim()),
      "Reservation cancelled",
    );
    if (ok) setCancelTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const ok = await runAction(
      deleteTarget.id,
      () => deleteReservation(deleteTarget.id),
      "Reservation deleted",
    );
    if (ok) setDeleteTarget(null);
  };

  const hasFilters = status !== "all" || date;

  return (
    <div className="provider-bookings">
      <div className="rv-header">
        <div>
          <h1>Bookings</h1>
          <p>Review and manage appointments booked with you.</p>
        </div>
      </div>

      <section className="rv-summary">
        <div className="rv-summary-card">
          <div className="rv-summary-icon tone-primary">
            <CalendarDays size={22} />
          </div>
          <div>
            <span>Total bookings</span>
            <strong>{summary.total}</strong>
          </div>
        </div>

        <div className="rv-summary-card">
          <div className="rv-summary-icon tone-warning">
            <Hourglass size={22} />
          </div>
          <div>
            <span>Pending</span>
            <strong>{summary.pending}</strong>
          </div>
        </div>

        <div className="rv-summary-card">
          <div className="rv-summary-icon tone-success">
            <CircleCheck size={22} />
          </div>
          <div>
            <span>Confirmed</span>
            <strong>{summary.confirmed}</strong>
          </div>
        </div>
      </section>

      <section className="rv-card">
        <div className="rv-toolbar">
          <div className="rv-tabs" role="tablist">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={status === f.value}
                className={`rv-tab ${status === f.value ? "active" : ""}`}
                onClick={() => setStatus(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="rv-date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Filter by date"
            />
            {date && (
              <button
                type="button"
                className="rv-clear"
                onClick={() => setDate("")}
                aria-label="Clear date"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="rv-table-wrap">
          <table className="rv-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Date & time</th>
                <th>Price</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="rv-empty">
                    Loading bookings...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={5} className="rv-empty">
                    <p>{loadError}</p>
                    <button
                      type="button"
                      className="rv-btn-primary"
                      onClick={load}
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="rv-empty">
                    {hasFilters
                      ? "No bookings match your filters."
                      : "No bookings yet."}
                  </td>
                </tr>
              ) : (
                sorted.map((r) => {
                  const busy = busyId === r.id;

                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="rv-client">
                          <div className="rv-avatar">
                            {r.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{r.clientName}</strong>
                            {r.clientPhone && <span>{r.clientPhone}</span>}
                            {r.notes && (
                              <span className="rv-notes" title={r.notes}>
                                “{r.notes}”
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="rv-when">
                          <strong>{formatDate(r.date)}</strong>
                          <span>
                            <Clock size={13} /> {r.time}
                          </span>
                        </div>
                      </td>

                      <td className="rv-price">{formatEGP(r.price)}</td>

                      <td>
                        <span className={`rv-status ${r.status}`}>
                          {statusLabel(r.status)}
                        </span>
                        {r.cancelReason && (
                          <small className="rv-reason" title={r.cancelReason}>
                            {r.cancelReason}
                          </small>
                        )}
                      </td>

                      <td>
                        <div className="rv-actions">
                          {canApprove(r.status) && (
                            <button
                              type="button"
                              className="rv-act approve"
                              onClick={() => handleApprove(r)}
                              disabled={busy}
                            >
                              <Check size={15} />
                              Approve
                            </button>
                          )}

                          {canCancel(r.status) && (
                            <button
                              type="button"
                              className="rv-act cancel"
                              onClick={() => openCancel(r)}
                              disabled={busy}
                            >
                              <CircleX size={15} />
                              Cancel
                            </button>
                          )}

                          <button
                            type="button"
                            className="rv-icon-btn danger"
                            onClick={() => setDeleteTarget(r)}
                            disabled={busy}
                            aria-label="Delete booking"
                            title="Delete"
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

      {cancelTarget && (
        <div
          className="rv-overlay"
          onClick={() => !busyId && setCancelTarget(null)}
        >
          <div
            className="rv-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Cancel this booking?</h3>
            <p>
              {cancelTarget.clientName} · {formatDate(cancelTarget.date)} ·{" "}
              {cancelTarget.time}
            </p>

            <div className="rv-field">
              <label htmlFor="rv-reason">Reason (optional)</label>
              <textarea
                id="rv-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Emergency surgery scheduled"
                maxLength={500}
              />
            </div>

            <div className="rv-modal-actions">
              <button
                type="button"
                className="rv-btn-secondary"
                onClick={() => setCancelTarget(null)}
                disabled={!!busyId}
              >
                Keep booking
              </button>
              <button
                type="button"
                className="rv-btn-danger"
                onClick={confirmCancel}
                disabled={!!busyId}
              >
                {busyId ? "Cancelling..." : "Cancel booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="rv-overlay"
          onClick={() => !busyId && setDeleteTarget(null)}
        >
          <div
            className="rv-modal"
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete booking?</h3>
            <p>
              The booking of <strong>{deleteTarget.clientName}</strong> on{" "}
              {formatDate(deleteTarget.date)} will be permanently deleted. This
              can't be undone.
            </p>

            <div className="rv-modal-actions">
              <button
                type="button"
                className="rv-btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={!!busyId}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rv-btn-danger"
                onClick={confirmDelete}
                disabled={!!busyId}
              >
                {busyId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="rv-toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
