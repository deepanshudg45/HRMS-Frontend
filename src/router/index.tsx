import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/loginPage";
import RegisterPage from "../pages/registerPage";
import AppLayout from "../pages/appLayout";
import ProtectedRoute from "../components/protectedRoute";
import AssetsDashboard from "../features/assets/pages/AssetsDashboard";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <div>Dashboard Home</div>,
      },
      {
        path: "assets",
        element: <AssetsDashboard />,
      },
    ],
  },
]);
