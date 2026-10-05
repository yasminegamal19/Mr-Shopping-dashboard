import { apiRequest } from "./apiClient";

export const getProviderProfile = async () => {
  const res = await apiRequest("/provider/profile");
  return res.data;
};

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
