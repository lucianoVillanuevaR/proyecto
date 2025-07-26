// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import {
  FaHome,
  FaUsers,
  FaSignOutAlt,
  FaClipboardList,
  FaBox,
  FaBookOpen,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import "@styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const usuario = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const rol = usuario.rol || usuario.role || ""; // por si acaso viene como 'role'

  const logoutSubmit = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="sidebar">
      <h2>Metodología de Desarrollo</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/home">
              <FaHome className="icon" /> Inicio
            </NavLink>
          </li>

          {rol === "administrador" && (
            <li>
              <NavLink to="/users">
                <FaUsers className="icon" /> Usuarios
              </NavLink>
            </li>
          )}

          <li>
            <NavLink to="/profile">
              <CgProfile className="icon" /> Perfil
            </NavLink>
          </li>
          <li>
            <NavLink to="/ayudantias">
              <FaBookOpen className="icon"/> Ayudantias
            </NavLink>
          </li>
          <li>
            <NavLink to="/loans">
              <FaClipboardList className="icon" /> Solicitar Préstamo
            </NavLink>
          </li>

          <li>
            <NavLink to="/materials">
              <FaBox className="icon" /> Materiales
            </NavLink>
          </li>

          <li style={{ height: "70%" }} />

          <li className="logout">
            <NavLink to="/login" onClick={logoutSubmit}>
              <FaSignOutAlt className="icon" /> Cerrar Sesión
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
