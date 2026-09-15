import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProviderDashboard from "../pages/provider/ProviderDashboard";

import { getAuth } from "../services/mockAuth";

function ProtectedRoute({ children, allowedRole }) {
  const auth = getAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && auth.user.role !== allowedRole) {
    if (auth.user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (auth.user.role === "provider") {
      return <Navigate to="/provider/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute allowedRole="provider">
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default Router;
