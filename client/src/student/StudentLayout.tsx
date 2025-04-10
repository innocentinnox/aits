import { useAuth } from "@/auth";
import { rolenavigator } from "@/icons/Svg";
import { Navigate, Outlet } from "react-router-dom";

function StudentLayout() {
  const { user } = useAuth();
  return user?.role === "student" ? (
    <Outlet />
  ) : (
    <Navigate to={`/${rolenavigator(user?.role)}`} />
  );
}

export default StudentLayout;
