// src/components/ProtectedRoute.jsx
import { useAuth } from "@/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!user && !loading) {
    // If not authenticated, redirect to login.
    // Pass the current location so you can navigate back after logging in.

    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user && !user?.college) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // User is authenticated; render child routes.
  return <Outlet />;
};

export default ProtectedRoute;
