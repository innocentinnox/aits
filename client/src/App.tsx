import "@/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/page/auth/login";
import Home from "@/page/home";
import AppLayout from "./layouts/AppLayout";

const router = createBrowserRouter([
  {
    path: "/app",
    element: <AppLayout />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
