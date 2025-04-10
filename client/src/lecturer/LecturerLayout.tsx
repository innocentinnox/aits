import { useAuth } from "@/auth";
import { rolenavigator } from "@/icons/Svg";
import { Navigate, Outlet } from "react-router-dom";

function LecturerLayout() {
  const { user } = useAuth();

  return user?.role === "lecturer" ? (
    <Outlet />
  ) : (
    <Navigate to={`/${rolenavigator(user?.role)}`} />
  );
}

export default LecturerLayout;
