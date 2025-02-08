import "@/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/page/auth/login";
import AppLayout from "./layouts/AppLayout";

import DashBoard from "./page/dashboard/DashBoard";

const router = createBrowserRouter([
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        path: "/app",
        element: <DashBoard />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
