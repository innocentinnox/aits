import { useAuth } from "@/auth";
import { rolenavigator } from "@/icons/Svg";
import AppLayout from "@/layouts/AppLayout";
import { Navigate, Outlet } from "react-router-dom";

function AdminLayout() {
  const { user } = useAuth();

  return user?.role === "registrar" ? (
    <Outlet />
  ) : (
    <Navigate to={`/${rolenavigator(user?.role)}`} />
  );
}

export default AdminLayout;
