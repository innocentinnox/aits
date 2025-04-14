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
  { name: "dashboard", path: "admin/dashboard", icon: <House /> },
  { name: "statistics", path: "admin/statistics", icon: <ChartBarStacked /> },
  { name: "notifications", path: "admin/notifications", icon: <Bell /> },
  { name: "logout", path: "admin/logout", icon: <LogOut /> },
];

export function rolenavigator(role: string | undefined) {
  switch (role) {
    case "student":
      return "";
    case "lecturer":
      return "lecturer";
    case "registrar":
      return "registrar";
  }
}
