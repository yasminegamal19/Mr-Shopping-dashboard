import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Truck,
  BriefcaseBusiness,
  CalendarDays,
  CreditCard,
  Wallet,
  Star,
  Tag,
  Tags,
  BarChart3,
  MessageCircle,
  Bell,
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
    key: "payments",
    label: "Payments",
    path: "/provider/payments",
    icon: CreditCard,
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
    key: "offers",
    label: "Offers",
    path: "/provider/offers",
    icon: Tag,
  },
  {
    key: "reports",
    label: "Reports",
    path: "/provider/reports",
    icon: BarChart3,
  },
  {
    key: "chat",
    label: "Chat",
    path: "/provider/chat",
    icon: MessageCircle,
  },
  {
    key: "notifications",
    label: "Notifications",
    path: "/provider/notifications",
    icon: Bell,
  },
  {
    key: "settings",
    label: "Settings",
    path: "/provider/settings",
    icon: Settings,
  },
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
  {
    key: "inventory",
    label: "Inventory",
    path: "/provider/inventory",
    icon: Boxes,
  },
  {
    key: "delivery",
    label: "Delivery",
    path: "/provider/delivery",
    icon: Truck,
  },
];

const serviceModules = [
  {
    key: "requests",
    label: "Requests",
    path: "/provider/requests",
    icon: BriefcaseBusiness,
  },
  {
    key: "services",
    label: "Services",
    path: "/provider/services",
    icon: BriefcaseBusiness,
  },
  {
    key: "bookings",
    label: "Bookings",
    path: "/provider/bookings",
    icon: CalendarDays,
  },
  {
    key: "schedule",
    label: "Schedule",
    path: "/provider/schedule",
    icon: CalendarDays,
  },
];

export const getProviderModules = (providerType) => {
  if (!providerType) {
    return commonModules;
  }

  const businessModules =
    providerType === "product" ? productModules : serviceModules;

  return [...commonModules, ...businessModules, ...commonAfterBusinessModules];
};
