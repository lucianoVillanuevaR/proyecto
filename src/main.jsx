"use strict";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Páginas
import Root from "@pages/Root";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Register from "@pages/Register";
import Error404 from "@pages/Error404";
import Users from "@pages/Users";
import Profile from "@pages/Profile";
import Loans from "@pages/Loans";
import Materials from "@pages/Materials"; // ✅ IMPORTADO

// Componentes
import ProtectedRoute from "@components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: "/home", element: <Home /> },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      { path: "/profile", element: <Profile /> },
      {
        path: "/loans",
        element: (
          <ProtectedRoute allowedRoles={["estudiante", "administrador"]}>
            <Loans />
          </ProtectedRoute>
        ),
      },
      {
        path: "/materials", // ✅ NUEVA RUTA
        element: (
          <ProtectedRoute allowedRoles={["estudiante", "administrador"]}>
            <Materials />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
