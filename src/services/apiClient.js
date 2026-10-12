import { getAuth, logout } from "./authStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api-proxy/api";

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export async function apiRequest(
  path,
  { method = "GET", body, lang = "en", auth = true, redirectOn401 = true } = {},
) {
  const isFormData = body instanceof FormData;

  const headers = {
    Accept: "application/json",
    "Accept-Language": lang,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAuth()?.token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the server. Please try again.", 0);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.status === false) {
    if (response.status === 401 && auth && redirectOn401) {
      logout();
      window.location.href = "/login";
    }

    throw new ApiError(
      data.message || "Something went wrong.",
      response.status,
      data.errors || {},
    );
  }

  return data;
}

// تحميل ملف محمي بالـ token. بيرجّع { blob, filename }
export async function apiDownload(path, lang = "en") {
  const token = getAuth()?.token;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        Accept: "*/*",
        "Accept-Language": lang,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new ApiError("Cannot reach the server. Please try again.", 0);
  }

  if (!response.ok) {
    if (response.status === 401) {
      logout();
      window.location.href = "/login";
    }
    const err = await response.json().catch(() => ({}));
    throw new ApiError(
      err.message || "Could not download the file.",
      response.status,
      err.errors || {},
    );
  }

  const disposition = response.headers.get("content-disposition") || "";
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  const filename = match ? decodeURIComponent(match[1]) : null;

  return { blob: await response.blob(), filename };
}
