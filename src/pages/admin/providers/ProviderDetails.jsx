import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Store,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import "./ProviderDetails.css";

const providers = [
  {
    id: 1,
    name: "صيدلية الشفاء",
    owner: "أحمد محمد",
    type: "Pharmacy",
    typeAr: "صيدلية",
    email: "alshifa@example.com",
    phone: "01012345678",
    location: "الجيزة",
    plan: "Plan 3",
    planAr: "الخطة 3",
    verification: "Verified",
    verificationAr: "موثق",
    status: "Active",
    statusAr: "نشط",
    orders: 1250,
    joinedAt: "2026-01-12",
  },
  {
    id: 2,
    name: "مطعم البيت السوري",
    owner: "محمد خالد",
    type: "Restaurant",
    typeAr: "مطعم",
    email: "baytshami@example.com",
    phone: "01123456789",
    location: "مدينة نصر",
    plan: "Plan 2",
    planAr: "الخطة 2",
    verification: "Not Verified",
    verificationAr: "غير موثق",
    status: "Active",
    statusAr: "نشط",
    orders: 845,
    joinedAt: "2026-02-03",
  },
  {
    id: 3,
    name: "عيادة د. سارة",
    owner: "د. سارة علي",
    type: "Doctor",
    typeAr: "طبيب",
    email: "sara.clinic@example.com",
    phone: "01234567890",
    location: "المعادي",
    plan: "Plan 3",
    planAr: "الخطة 3",
    verification: "Pending",
    verificationAr: "قيد المراجعة",
    status: "Active",
    statusAr: "نشط",
    orders: 420,
    joinedAt: "2026-02-18",
  },
  {
    id: 4,
    name: "مدرسة المستقبل",
    owner: "محمود حسن",
    type: "Teacher",
    typeAr: "مدرس",
    email: "future.teacher@example.com",
    phone: "01098765432",
    location: "6 أكتوبر",
    plan: "Plan 2",
    planAr: "الخطة 2",
    verification: "Verified",
    verificationAr: "موثق",
    status: "Active",
    statusAr: "نشط",
    orders: 315,
    joinedAt: "2026-03-01",
  },
  {
    id: 5,
    name: "سباك إكسبريس",
    owner: "حسام إبراهيم",
    type: "Plumber",
    typeAr: "سباك",
    email: "plumber.express@example.com",
    phone: "01187654321",
    location: "الهرم",
    plan: "Plan 1",
    planAr: "الخطة 1",
    verification: "Pending",
    verificationAr: "قيد المراجعة",
    status: "Active",
    statusAr: "نشط",
    orders: 95,
    joinedAt: "2026-03-15",
  },
  {
    id: 6,
    name: "Fashion House",
    owner: "منة أحمد",
    type: "Clothing Store",
    typeAr: "محل ملابس",
    email: "fashion@example.com",
    phone: "01211112222",
    location: "الزمالك",
    plan: "Plan 3",
    planAr: "الخطة 3",
    verification: "Verified",
    verificationAr: "موثق",
    status: "Active",
    statusAr: "نشط",
    orders: 760,
    joinedAt: "2026-04-02",
  },
  {
    id: 7,
    name: "صيدلية الرحمة",
    owner: "خالد مصطفى",
    type: "Pharmacy",
    typeAr: "صيدلية",
    email: "rahma.pharmacy@example.com",
    phone: "01055556666",
    location: "فيصل",
    plan: "Plan 1",
    planAr: "الخطة 1",
    verification: "Rejected",
    verificationAr: "مرفوض",
    status: "Inactive",
    statusAr: "غير نشط",
    orders: 64,
    joinedAt: "2026-04-10",
  },
  {
    id: 8,
    name: "د. أحمد الطبي",
    owner: "د. أحمد سامي",
    type: "Doctor",
    typeAr: "طبيب",
    email: "ahmed.doctor@example.com",
    phone: "01144445555",
    location: "الدقي",
    plan: "Plan 2",
    planAr: "الخطة 2",
    verification: "Verified",
    verificationAr: "موثق",
    status: "Inactive",
    statusAr: "غير نشط",
    orders: 210,
    joinedAt: "2026-05-06",
  },
];

function ProviderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const provider = providers.find((item) => item.id === Number(id));

  const [status, setStatus] = useState(provider?.status || "Active");
  const [verification, setVerification] = useState(
    provider?.verification || "Pending",
  );

  if (!provider) {
    return (
      <div className="provider-not-found">
        <div className="provider-not-found-icon">
          <Store size={24} />
        </div>

        <h2>Provider Not Found</h2>

        <p>The provider you are looking for does not exist.</p>

        <button type="button" onClick={() => navigate("/admin/providers")}>
          <ArrowLeft size={16} />
          Back to Providers
        </button>
      </div>
    );
  }

  const isActive = status === "Active";
  const isVerified = verification === "Verified";
  const isPending = verification === "Pending";

  return (
    <div className="provider-details-page">
      <div className="provider-breadcrumb">
        <button type="button" onClick={() => navigate("/admin/providers")}>
          Providers
        </button>

        <ChevronRight size={14} />

        <span>{provider.name}</span>
      </div>

      <div className="provider-details-header">
        <div className="provider-details-header-left">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/admin/providers")}
          >
            <ArrowLeft size={18} />
          </button>

          <div className="provider-large-avatar">{provider.name.charAt(0)}</div>

          <div>
            <div className="provider-heading-line">
              <h1>{provider.name}</h1>

              {isVerified && (
                <span className="verified-badge">
                  <ShieldCheck size={14} />
                  Verified
                </span>
              )}
            </div>

            <p>{provider.owner}</p>

            <span className="provider-type-label">{provider.typeAr}</span>
          </div>
        </div>

        <div className="provider-header-actions">
          {isActive ? (
            <button
              type="button"
              className="provider-action secondary danger"
              onClick={() => setStatus("Inactive")}
            >
              <UserX size={16} />
              Deactivate
            </button>
          ) : (
            <button
              type="button"
              className="provider-action secondary"
              onClick={() => setStatus("Active")}
            >
              <UserCheck size={16} />
              Activate
            </button>
          )}

          {isPending && (
            <>
              <button
                type="button"
                className="provider-action reject"
                onClick={() => setVerification("Rejected")}
              >
                <X size={16} />
                Reject
              </button>

              <button
                type="button"
                className="provider-action primary"
                onClick={() => setVerification("Verified")}
              >
                <Check size={16} />
                Verify
              </button>
            </>
          )}
        </div>
      </div>

      <div className="provider-details-layout">
        <div className="provider-details-main">
          <section className="details-card">
            <div className="details-card-header">
              <div>
                <h2>Provider Overview</h2>
                <p>Basic information about this provider.</p>
              </div>

              <div className="section-icon">
                <Building2 size={18} />
              </div>
            </div>

            <div className="details-info-grid">
              <div className="info-item">
                <span className="info-label">Provider Name</span>
                <strong>{provider.name}</strong>
              </div>

              <div className="info-item">
                <span className="info-label">Owner</span>
                <strong>{provider.owner}</strong>
              </div>

              <div className="info-item">
                <span className="info-label">Provider Type</span>
                <strong>{provider.typeAr}</strong>
              </div>

              <div className="info-item">
                <span className="info-label">Location</span>

                <strong className="with-icon">
                  <MapPin size={15} />
                  {provider.location}
                </strong>
              </div>

              <div className="info-item">
                <span className="info-label">Email</span>

                <strong className="with-icon">
                  <Mail size={15} />
                  {provider.email}
                </strong>
              </div>

              <div className="info-item">
                <span className="info-label">Phone</span>

                <strong className="with-icon">
                  <Phone size={15} />
                  {provider.phone}
                </strong>
              </div>

              <div className="info-item">
                <span className="info-label">Joined Date</span>

                <strong className="with-icon">
                  <CalendarDays size={15} />
                  {provider.joinedAt}
                </strong>
              </div>

              <div className="info-item">
                <span className="info-label">Total Orders</span>

                <strong className="with-icon">
                  <Package size={15} />
                  {provider.orders.toLocaleString()}
                </strong>
              </div>
            </div>
          </section>

          <section className="details-card">
            <div className="details-card-header">
              <div>
                <h2>Business Information</h2>
                <p>Service information associated with this provider.</p>
              </div>

              <div className="section-icon">
                <Store size={18} />
              </div>
            </div>

            <div className="business-information">
              <div className="business-row">
                <div>
                  <span>Service Category</span>
                  <strong>{provider.typeAr}</strong>
                </div>

                <span className="category-chip">{provider.type}</span>
              </div>

              <div className="business-row">
                <div>
                  <span>Business Location</span>
                  <strong>{provider.location}</strong>
                </div>

                <MapPin size={18} />
              </div>

              <div className="business-row">
                <div>
                  <span>Current Plan</span>
                  <strong>{provider.planAr}</strong>
                </div>

                <span
                  className={`plan-chip ${provider.plan
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {provider.plan}
                </span>
              </div>
            </div>
          </section>

          <section className="details-card">
            <div className="details-card-header">
              <div>
                <h2>Verification Documents</h2>
                <p>Documents submitted by the provider for review.</p>
              </div>

              <div className="section-icon">
                <FileText size={18} />
              </div>
            </div>

            <div className="documents-placeholder">
              <div className="document-icon">
                <FileText size={20} />
              </div>

              <div>
                <strong>Document Management</strong>

                <p>
                  Submitted provider documents will appear here when the
                  verification API is connected.
                </p>
              </div>

              <span className="coming-soon-badge">API Pending</span>
            </div>
          </section>
        </div>

        <aside className="provider-details-sidebar">
          <section className="details-card status-card">
            <div className="details-card-header">
              <div>
                <h2>Account Status</h2>
                <p>Current provider account state.</p>
              </div>
            </div>

            <div className={`large-status ${isActive ? "active" : "inactive"}`}>
              <span className="status-indicator"></span>

              <div>
                <strong>{isActive ? "Active" : "Inactive"}</strong>

                <span>
                  {isActive
                    ? "Provider can receive orders."
                    : "Provider cannot receive new orders."}
                </span>
              </div>
            </div>
          </section>

          <section className="details-card status-card">
            <div className="details-card-header">
              <div>
                <h2>Verification</h2>
                <p>Provider verification status.</p>
              </div>
            </div>

            <div
              className={`large-verification ${verification
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              <ShieldCheck size={21} />

              <div>
                <strong>
                  {verification === "Verified"
                    ? "Verified"
                    : verification === "Pending"
                      ? "Pending Review"
                      : "Rejected"}
                </strong>

                <span>
                  {verification === "Verified"
                    ? "Provider has been verified."
                    : verification === "Pending"
                      ? "Provider is waiting for review."
                      : "Provider verification was rejected."}
                </span>
              </div>
            </div>

            {isPending && (
              <div className="verification-actions">
                <button
                  type="button"
                  className="verification-reject"
                  onClick={() => setVerification("Rejected")}
                >
                  Reject
                </button>

                <button
                  type="button"
                  className="verification-approve"
                  onClick={() => setVerification("Verified")}
                >
                  Verify
                </button>
              </div>
            )}
          </section>

          <section className="details-card plan-details-card">
            <div className="details-card-header">
              <div>
                <h2>Subscription Plan</h2>
                <p>Current provider plan.</p>
              </div>
            </div>

            <div className="plan-details-content">
              <div className="plan-number">
                {provider.plan.replace("Plan ", "")}
              </div>

              <div>
                <strong>{provider.planAr}</strong>

                <span>
                  {provider.plan === "Plan 1"
                    ? "20 orders limit"
                    : provider.plan === "Plan 2"
                      ? "Unlimited orders"
                      : "Unlimited orders + Verified"}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default ProviderDetails;
