import { apiRequest } from "./apiClient";

export const getCategories = async () => {
  const res = await apiRequest("/provider/categories");
  return Array.isArray(res.data) ? res.data : [];
};

export const createCategory = async ({ name, is_active, sort_order }) => {
  const res = await apiRequest("/provider/categories", {
    method: "POST",
    body: { name, is_active, sort_order },
  });
  return res.data;
};

export const updateCategory = async (id, { name, is_active, sort_order }) => {
  const res = await apiRequest(`/provider/categories/${id}`, {
    method: "PUT",
    body: { name, is_active, sort_order },
  });
  return res.data;
};

export const deleteCategory = async (id) => {
  await apiRequest(`/provider/categories/${id}`, { method: "DELETE" });
};
