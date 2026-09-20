export const providerTypes = {
  PRODUCT: "product",
  SERVICE: "service",
};

export const providerCategories = {
  RESTAURANT: "restaurant",
  PHARMACY: "pharmacy",
  CLOTHING: "clothing",
  DOCTOR: "doctor",
  PLUMBER: "plumber",
  TEACHER: "teacher",
};

export const mockProvider = {
  id: "PROV-1001",
  name: "Smart Store",
  ownerName: "Ahmed Hassan",
  businessType: providerTypes.PRODUCT,
  category: providerCategories.CLOTHING,
  status: "active",
  verificationStatus: "verified",
  plan: "Plan 3",
  rating: 4.8,
};
