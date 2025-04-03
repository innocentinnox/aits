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
import Statistics from "./page/dashboard/stat/Statistics";
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
            children: [
              {
                path: "",
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
          },
          {
            path: "/lecturer",
            element: <AdminLayout />,
            children: [
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
                path: "",
                element: <DashBoard />,
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
  // Not found can't be dashboard
  // {
  //   path: "*",
  //   element: <Navigate to="/dashboard" replace />, // 404
  // },
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
