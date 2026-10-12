import { getAuth } from "../../services/authStorage";

export const getProviderDisplay = () => {
  const user = getAuth()?.user;
  const fullName = user?.full_name ?? "Provider";

  return {
    ownerName: fullName,
    subtitle:
      user?.provider?.store?.store_name ??
      user?.provider?.provider_category?.name ??
      "",
    initial: fullName.trim().charAt(0).toUpperCase() || "P",
  };
};