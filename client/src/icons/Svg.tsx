import {
  Bell,
  BellElectric,
  BellOff,
  ChartBarStacked,
  ChartNoAxesCombined,
  CircleHelp,
  Disc,
  FilePlus2,
  FileText,
  History,
  House,
  LogOut,
  MessageCircleQuestion,
  Paperclip,
} from "lucide-react";

export const STUDENT_NAV_ITEMS = [
  { name: "dashboard", path: "", icon: <House /> },
  { name: "create", path: "create", icon: <FilePlus2 /> },
  { name: "notifications", path: "notifications", icon: <Bell /> },
  { name: "logout", path: "logout", icon: <LogOut /> },
];

export const ADMIN_NAV_ITEMS = [
  { name: "dashboard", path: "", icon: <House /> },
  { name: "statistics", path: "statistics", icon: <ChartBarStacked /> },
  { name: "notifications", path: "notifications", icon: <Bell /> },
  { name: "logout", path: "logout", icon: <LogOut /> },
];
