import "@/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "@/page/auth/login";
import { SignupPage } from "@/page/auth/sign-up";
import { AuthLayout } from "@/layouts/auth-layout";
import Verify from "@/page/auth/verify";
import { RequestPasswordPage } from "./page/auth/request-password-page";
import RootProvider from "./providers/root-provider";
import NewPasswordPage from "./page/auth/new-password";
import AppLayout from "./layouts/AppLayout";
import DashBoard from "./page/dashboard/DashBoard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <DashBoard />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />, // Common layout for /auth/*
    children: [
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
        path: "reset-password/verify",
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
  return <RootProvider>{<RouterProvider router={router} />}</RootProvider>;
}

export default App;
