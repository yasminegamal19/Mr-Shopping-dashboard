import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import Users from "../pages/admin/users/Users";
import Providers from "../pages/admin/providers/Providers";
import ProviderDetails from "../pages/admin/providers/ProviderDetails";
import Delivery from "../pages/admin/delivery/Delivery";
import Categories from "../pages/admin/categories/Categories";
import Products from "../pages/admin/products/Products";
import Services from "../pages/admin/services/Services";
import Orders from "../pages/admin/orders/Orders";
import Payments from "../pages/admin/payments/Payments";
import Plans from "../pages/admin/plans/Plans";
import Offers from "../pages/admin/offers/Offers";
import Complaints from "../pages/admin/complaints/Complaints";

import ProviderLayout from "../layouts/ProviderLayout/ProviderLayout";
import ProviderOrders from "../pages/provider/orders/ProviderOrders";
import ProviderProducts from "../pages/provider/products/ProviderProducts";
import ProviderSettings from "../pages/provider/settings/ProviderSettings";
import ProviderEarnings from "../pages/provider/earnings/ProviderEarnings";
import ProviderReviews from "../pages/provider/reviews/ProviderReviews";
import ProviderCustomers from "../pages/provider/customers/ProviderCustomers";

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
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="providers" element={<Providers />} />
        <Route path="providers/:id" element={<ProviderDetails />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products" element={<Products />} />
        <Route path="services" element={<Services />} />
        <Route path="orders" element={<Orders />} />
        <Route path="payments" element={<Payments />} />
        <Route path="plans" element={<Plans />} />
        <Route path="offers" element={<Offers />} />
        <Route path="complaints" element={<Complaints />} />
      </Route>

      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRole="provider">
            <ProviderLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/provider/dashboard" replace />} />
        <Route path="dashboard" element={<ProviderDashboard />} />
        <Route path="orders" element={<ProviderOrders />} />
        <Route path="products" element={<ProviderProducts />} />
        <Route path="settings" element={<ProviderSettings />} />
        <Route path="earnings" element={<ProviderEarnings />} />
        <Route path="reviews" element={<ProviderReviews />} />
        <Route path="customers" element={<ProviderCustomers />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default Router;
