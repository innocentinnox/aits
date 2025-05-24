import "@/App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { LoginPage } from "@/page/auth/login";
import { SignupPage } from "@/page/auth/sign-up";
import { AuthLayout } from "@/layouts/auth-layout";
import Verify from "@/page/auth/verify";
import { RequestPasswordPage } from "./page/auth/request-password-page";
import RootProvider from "./providers/root-provider";
import NewPasswordPage from "./page/auth/new-password";
import AppLayout from "./layouts/AppLayout";
import DashBoard from "./page/dashboard/DashBoard";
import DetailsForm from "./page/Details/Details";
import Notifications from "./page/Notifications/Notifications";
import { AuthProvider } from "./context/auth-context";
import ProtectedRoute from "./providers/protected-route";
import OnboardingPage from "./page/auth/onboarding";
import AdminLayout from "./admin/AdminLayout";
import Statistics from "./admin/stat/Statistics";
import DashboardAdmin from "./admin/dashboard/DashboardAdmin";
import DashboardLecturer from "./lecturer/dashboard/DashboardLecturer";
import StudentLayout from "./student/StudentLayout";
import LecturerLayout from "./lecturer/LecturerLayout";
import RoleNavigator from "./admin/AdminLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <StudentLayout />,
            children: [
              {
                path: "",
                element: <DashBoard />,
              },
              {
                path: "dashboard",
                element: <DashBoard />,
              },
              {
                path: "notifications",
                element: <Notifications />,
              },
              {
                path: "details",
                element: <DetailsForm />,
              },
            ],
          }, {
            path: "/lecturer",
            element: <LecturerLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="dashboard" replace />,
              },
              {
                path: "dashboard",
                element: <DashboardLecturer />,
              },
              {
                path: "",
                element: <DashBoard />,
              },
              {
                path: "notifications",
                element: <Notifications />,
              },
            ],
          },
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="dashboard" replace />,
              },
              {
                path: "dashboard",
                element: <DashboardAdmin />,
              },
              {
                path: "statistics",
                element: <Statistics />,
              },
              {
                path: "notifications",
                element: <Notifications />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "verify",
        element: <Verify />,
      },
      {
        path: "reset-password",
        element: <RequestPasswordPage />,
      },
      {
        path: "reset-password/confirm",
        element: <Verify />,
      },
      {
        path: "reset-password/new-password",
        element: <NewPasswordPage />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" />, // 404
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />, // 404
  },
]);

function App() {
  return (
    <AuthProvider>
      <RootProvider>
        <RouterProvider router={router} />
      </RootProvider>
    </AuthProvider>
  );
}

export default App;
