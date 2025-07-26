import { useState, useEffect } from "react";
import LoanForm from "../components/LoanForm";
import LoanTable from "../components/LoanTable";
import LoanMessage from "../components/LoanMessage";
import LoanRequirements from "../components/LoanRequirements";

export default function Loans() {
  const [materialNombre, setMaterialNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [rol, setRol] = useState("");
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
      if (payload && (payload.rol || payload.role)) {
        const rolDetectado = payload.rol || payload.role;
        setRol(rolDetectado);
        if (rolDetectado === "administrador") {
          fetchPrestamos(token);
        }
      } else {
        setError("No se pudo obtener el rol del usuario.");
      }
    } catch (err) {
      console.error("Token inválido:", err);
      setError("Error al leer el token.");
    }
  }, []);

  const fetchPrestamos = async (token) => {
    try {
      const res = await fetch("http://localhost:3000/api/prestamos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPrestamos(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Error al obtener préstamos:", err);
      setError("Error al obtener la lista de préstamos.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/prestamos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ materialNombre }),
      });

      const contentType = res.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Respuesta inesperada:", text);
        throw new Error("Respuesta del servidor no válida");
      }

      if (!res.ok) throw new Error(data.message);

      setMensaje(data.message || "Préstamo creado exitosamente");
      setMaterialNombre("");
      if (rol === "administrador") fetchPrestamos(token);
    } catch (err) {
      setError(err.message || "Error inesperado");
    }
  };

  const devolverPrestamo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/prestamos/devolver", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMensaje("Préstamo devuelto correctamente.");
      fetchPrestamos(token);
    } catch (err) {
      console.error("Error al devolver:", err);
      setError(err.message);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Solicitar Préstamo</h1>
      <LoanRequirements />
      {(rol === "estudiante" || rol === "administrador") && (
        <LoanForm
          materialNombre={materialNombre}
          setMaterialNombre={setMaterialNombre}
          handleSubmit={handleSubmit}
        />
      )}
      {rol === "administrador" && (
        <LoanTable prestamos={prestamos} devolverPrestamo={devolverPrestamo} />
      )}
      <LoanMessage mensaje={mensaje} error={error} />
    </>
  );
}
