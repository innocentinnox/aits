import "@/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/page/auth/login";
import Home from "@/page/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    index: true,

  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
