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
import { CreateIssueForm } from "./components/ui/CreateIssueForm";
import Notifications from "./page/Notifications/Notifications";
import { AuthProvider } from "./context/auth-context";
import ProtectedRoute from "./providers/protected-route";
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashBoard />,
          },
          {
            path: "create",
            element: <CreateIssueForm />,
          },
          {
            path: "notifications",
            element: <Notifications />,
          },
          {
            path: "/details",
            element: <DetailsForm />,
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
