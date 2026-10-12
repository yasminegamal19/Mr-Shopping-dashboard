import { apiRequest, apiDownload } from "./apiClient";

export const getProviderProfile = async () => {
  const res = await apiRequest("/provider/profile");
  return res.data;
};

// full_name, phone, description, profile_image (multipart + _method=PUT)
export const updateProviderProfile = async ({
  full_name,
  phone,
  description,
  profile_image,
}) => {
  const formData = new FormData();
  formData.append("_method", "PUT");

  if (full_name !== undefined) formData.append("full_name", full_name);
  if (phone !== undefined) formData.append("phone", phone);
  if (description !== undefined) formData.append("description", description);
  if (profile_image instanceof File) {
    formData.append("profile_image", profile_image);
  }

  const res = await apiRequest("/provider/profile", {
    method: "POST",
    body: formData,
  });

  return res.data;
};

// التاجر الخدمي: price, experience_years, is_available, availability
export const updateProviderService = async (payload) => {
  const res = await apiRequest("/provider/service", {
    method: "PUT",
    body: payload,
  });
  return res.data;
};

// تاجر المنتجات: store_name (مطلوب) + logo (اختياري)، ينشئ المتجر لو مش موجود
export const updateProviderStore = async ({ store_name, logo }) => {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("store_name", store_name);
  if (logo instanceof File) {
    formData.append("logo", logo);
  }

  const res = await apiRequest("/provider/store", {
    method: "POST",
    body: formData,
  });

  return res.data;
};

// قائمة الأوراق (للقراءة فقط)
export const getProviderDocuments = async () => {
  const res = await apiRequest("/provider/documents");
  return Array.isArray(res.data) ? res.data : [];
};

// تحميل ورقة: بيحفظ الملف على جهاز المستخدم
export const downloadProviderDocument = async (id, fallbackName = "document") => {
  const { blob, filename } = await apiDownload(
    `/provider/documents/${id}/download`,
  );

  const ext = blob.type.split("/")[1]?.split("+")[0] || "";
  const name = filename || (ext ? `${fallbackName}.${ext}` : fallbackName);

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};