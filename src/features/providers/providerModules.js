import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  BriefcaseBusiness,
  CalendarDays,
  Wallet,
  Star,
  Settings,
  User2,
} from "lucide-react";

const commonModules = [
  {
    key: "overview",
    label: "Overview",
    path: "/provider",
    icon: LayoutDashboard,
  },
];

const commonAfterBusinessModules = [
  {
    key: "customers",
    label: "Customers",
    path: "/provider/customers",
    icon: User2,
  },
  {
    key: "earnings",
    label: "Earnings",
    path: "/provider/earnings",
    icon: Wallet,
  },
  {
    key: "reviews",
    label: "Reviews",
    path: "/provider/reviews",
    icon: Star,
  },
  {
    key: "settings",
    label: "Settings",
    path: "/provider/settings",
    icon: Settings,
  },
  // فعّليهم لما تعملي صفحاتهم + routes ليهم في router.jsx:
  // payments, offers, reports, chat, notifications
];

const productModules = [
  {
    key: "categories",
    label: "Categories",
    path: "/provider/categories",
    icon: Tags,
  },
  {
    key: "products",
    label: "Products",
    path: "/provider/products",
    icon: Package,
  },
  {
    key: "orders",
    label: "Orders",
    path: "/provider/orders",
    icon: ShoppingBag,
  },
  // فعّليهم لاحقاً: inventory, delivery
];

const serviceModules = [
  {
    key: "bookings",
    label: "Bookings",
    path: "/provider/bookings",
    icon: CalendarDays,
  },
  {
    key: "services",
    label: "Services",
    path: "/provider/services",
    icon: BriefcaseBusiness,
  },
  // requests, schedule
];

export const getProviderModules = (providerType) => {
  if (!providerType) {
    return commonModules;
  }

  const businessModules =
    providerType === "product" ? productModules : serviceModules;

  return [...commonModules, ...businessModules, ...commonAfterBusinessModules];
};
