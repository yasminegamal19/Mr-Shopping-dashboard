import { apiRequest, ApiError } from "./apiClient";
import { saveAuth, logout } from "./authStorage";
import { normalizePhone } from "../utils/phone";

const ALLOWED_ROLES = ["admin", "provider"];

const toFailure = (err) => {
  if (err instanceof ApiError) {
    const firstError = Object.values(err.errors || {})[0]?.[0];
    return { success: false, message: firstError || err.message };
  }
  return { success: false, message: "Unexpected error occurred." };
};

export const loginUser = async (phone, password) => {
  try {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      auth: false,
      body: {
        phone: normalizePhone(phone),
        password,
        device_name: "web-dashboard",
      },
    });

    const { user, token, token_type } = res.data;

    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        success: false,
        message: "This dashboard is only available for admins and providers.",
      };
    }

    saveAuth({ user, token, tokenType: token_type });

    return { success: true, user, token };
  } catch (err) {
    return toFailure(err);
  }
};

export const logoutUser = async () => {
  try {
    await apiRequest("/auth/logout", { method: "POST", redirectOn401: false });
  } catch {
  } finally {
    logout();
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await apiRequest("/auth/forgot-password", {
      method: "POST",
      auth: false,
      body: { email: email.trim() },
    });

    return {
      success: true,
      message: res.message,
      debugOtp: res.data?.debug_otp, 
    };
  } catch (err) {
    return toFailure(err);
  }
};

export const resetPassword = async ({
  email,
  otp,
  password,
  passwordConfirmation,
}) => {
  try {
    const res = await apiRequest("/auth/reset-password", {
      method: "POST",
      auth: false,
      body: {
        email: email.trim(),
        otp,
        password,
        password_confirmation: passwordConfirmation,
      },
    });

    return { success: true, message: res.message };
  } catch (err) {
    return toFailure(err);
  }
};

export { getAuth, isAuthenticated, logout } from "./authStorage";
