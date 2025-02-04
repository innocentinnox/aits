import { useState } from "react";
import "@/App.css";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/pages/auth/login";

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
