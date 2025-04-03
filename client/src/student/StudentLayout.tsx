import { useAuth } from "@/auth";
import { Navigate, Outlet } from "react-router-dom";

function StudentLayout() {
  const { user } = useAuth();
  if (user?.role !== "student") return <Navigate to="/admin" />;

  return <Outlet />;
}

export default StudentLayout;
