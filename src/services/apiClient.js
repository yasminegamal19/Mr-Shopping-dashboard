import { getAuth } from "./authStorage";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export async function apiRequest(
  path,
  { method = "GET", body, lang = "en", auth = true } = {},
) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": lang,
  };

  if (auth) {
    const token = getAuth()?.token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Cannot reach the server. Please try again.", 0);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.status === false) {
    throw new ApiError(
      data.message || "Something went wrong.",
      response.status,
      data.errors || {},
    );
  }

  return data;
}
