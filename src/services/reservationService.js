import { apiRequest } from "./apiClient";

// status: "all" | "pending" | "confirmed" | ...  |  date: "YYYY-MM-DD"
export const getReservations = async ({ status = "all", date = "" } = {}) => {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (date) params.set("date", date);

  const query = params.toString();
  const res = await apiRequest(
    `/provider/reservations${query ? `?${query}` : ""}`,
  );

  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return [];
};

export const approveReservation = async (id) => {
  const res = await apiRequest(`/provider/reservations/${id}/approve`, {
    method: "PATCH",
  });
  return res.data;
};

export const cancelReservation = async (id, reason) => {
  const res = await apiRequest(`/provider/reservations/${id}/cancel`, {
    method: "PATCH",
    body: reason ? { reason } : {},
  });
  return res.data;
};

export const deleteReservation = async (id) => {
  await apiRequest(`/provider/reservations/${id}`, { method: "DELETE" });
};
