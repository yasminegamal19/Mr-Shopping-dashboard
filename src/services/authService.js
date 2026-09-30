import { apiRequest, ApiError } from "./apiClient";
import { saveAuth } from "./authStorage";

const ALLOWED_ROLES = ["admin", "provider"];

const normalizePhone = (phone) => {
  const cleaned = phone.replace(/[\s-]/g, "");
  if (/^01\d{9}$/.test(cleaned)) return `+2${cleaned}`;
  return cleaned;
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
    if (err instanceof ApiError) {
      const firstError = Object.values(err.errors || {})[0]?.[0];
      return { success: false, message: firstError || err.message };
    }
    return { success: false, message: "Unexpected error occurred." };
  }
};

export { logout, getAuth, isAuthenticated } from "./authStorage";
