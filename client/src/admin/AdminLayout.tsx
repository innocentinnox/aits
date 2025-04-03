import { useAuth } from "@/auth";
import AppLayout from "@/layouts/AppLayout";
import { Navigate, Outlet } from "react-router-dom";

function AdminLayout() {
  const { user } = useAuth();
  if (user?.role !== "department_head") return <Navigate to="/" />;

  return <Outlet />;
}

export default AdminLayout;
