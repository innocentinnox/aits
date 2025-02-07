import "@/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/page/auth/login";
import Home from "@/page/home";
import AppLayout from "./layouts/AppLayout";
import Menu from "./layouts/Menu";
import PopMenu from "./layouts/PopMenu";

const router = createBrowserRouter([
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        path: "/app/",
        element: <div> Dashboard</div>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
