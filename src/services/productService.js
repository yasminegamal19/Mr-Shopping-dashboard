import { apiRequest } from "./apiClient";

// بيرجّع { items, meta } من الـ response المقسّم لصفحات
export const getProducts = async ({
  page = 1,
  search,
  categoryId,
  isActive,
} = {}) => {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  if (categoryId) params.set("category_id", String(categoryId));
  if (isActive !== undefined && isActive !== "")
    params.set("is_active", isActive ? "1" : "0");

  const res = await apiRequest(`/provider/products?${params.toString()}`);
  const payload = res.data ?? {};
  return {
    items: Array.isArray(payload.data) ? payload.data : [],
    meta: payload.meta ?? {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: 15,
    },
  };
};

const appendIf = (fd, key, value) => {
  if (value !== undefined && value !== null && value !== "")
    fd.append(key, value);
};

// ⚠️ افتراض: multipart مع images[]. لو الباك اند عامله مختلف عدّلي هنا بس.
export const createProduct = async ({ images = [], is_active, ...fields }) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => appendIf(fd, k, v));
  fd.append("is_active", is_active ? "1" : "0");
  images.forEach((file) => fd.append("images[]", file));

  const res = await apiRequest("/provider/products", {
    method: "POST",
    body: fd,
  });
  return res.data;
};

export const updateProduct = async (id, payload) => {
  const res = await apiRequest(`/provider/products/${id}`, {
    method: "PUT",
    body: payload,
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  await apiRequest(`/provider/products/${id}`, { method: "DELETE" });
};

// ⚠️ افتراض: الملف في حقل "image"
export const uploadProductImage = async (id, file) => {
  const fd = new FormData();
  fd.append("image", file);
  const res = await apiRequest(`/provider/products/${id}/images`, {
    method: "POST",
    body: fd,
  });
  return res.data;
};

export const setPrimaryProductImage = async (id, imageId) => {
  const res = await apiRequest(
    `/provider/products/${id}/images/${imageId}/primary`,
    {
      method: "PATCH",
    },
  );
  return res.data;
};

export const deleteProductImage = async (id, imageId) => {
  await apiRequest(`/provider/products/${id}/images/${imageId}`, {
    method: "DELETE",
  });
};
