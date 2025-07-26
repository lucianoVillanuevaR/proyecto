"use strict";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "@pages/Root";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Register from "@pages/Register";
import Error404 from "@pages/Error404";
import Users from "@pages/Users";
import Profile from "@pages/Profile";
import Loans from "@pages/Loans";       
import Materials from "@pages/Materials"; 
import Ayudantias from '@pages/Ayudantias';
import CreateAyudantia from '@pages/CreateAyudantia';


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
      {
        path: "/loans",
        element: (
          <ProtectedRoute allowedRoles={["estudiante", "administrador"]}>
            <Loans />
          </ProtectedRoute>
        ),
      },
      {
        path: "/materials",
        element: (
          <ProtectedRoute allowedRoles={["estudiante", "administrador"]}>
            <Materials />
          </ProtectedRoute>
        ),
      },
      { path: "/profile", element: <Profile /> },
      {
        path: "/ayudantias",
        element: <Ayudantias />,
      },
      {
        path: "/ayudantias/create",
        element: <CreateAyudantia />,
      }
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);


