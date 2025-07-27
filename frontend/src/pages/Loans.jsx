import { useEffect, useState } from "react";
import {
  solicitarPrestamo,
  getPrestamos,
  devolverPrestamo,
} from "@services/loan.service.js";
import LoanMessage from "@components/LoanMessage.jsx";

export default function Loans() {
  const [materialNombre, setMaterialNombre] = useState("");
  const [prestamos, setPrestamos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const usuario = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const emailUsuario = usuario.email || "";

  const fetchPrestamos = async () => {
    try {
      const data = await getPrestamos();

      const misPrestamos = data.filter(
        (p) =>
          p.estudianteEmail?.trim().toLowerCase() ===
          emailUsuario.trim().toLowerCase()
      );

      setPrestamos(misPrestamos);
    } catch (err) {
      console.error("Error al cargar préstamos:", err);
      setError("No se pudo cargar la lista de préstamos");
    }
  };

  const handleSolicitar = async () => {
    setMensaje("");
    setError("");

    try {
      await solicitarPrestamo(materialNombre);
      setMensaje("✅ Préstamo registrado exitosamente.");
      setMaterialNombre("");
      fetchPrestamos();
    } catch (err) {
      console.error("Error al solicitar préstamo:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al solicitar préstamo"
      );
    }
  };

  const handleDevolver = async () => {
    setMensaje("");
    setError("");

    try {
      await devolverPrestamo();
      setMensaje("✅ Préstamo devuelto correctamente.");
      fetchPrestamos();
    } catch (err) {
      console.error("Error al devolver préstamo:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al devolver préstamo"
      );
    }
  };

  useEffect(() => {
    fetchPrestamos();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-yellow-800">
        📦 Préstamos de Material
      </h1>

      <div className="mb-4 bg-yellow-50 p-4 border border-yellow-200 rounded-lg text-sm text-gray-700">
        <strong>Requisitos:</strong>
        <ul className="list-disc ml-6 mt-1">
          <li>Solo un préstamo pendiente por usuario.</li>
          <li>El material debe estar activo y con stock disponible.</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Ej. balón de fútbol"
          className="border px-3 py-2 rounded w-full"
          value={materialNombre}
          onChange={(e) => setMaterialNombre(e.target.value)}
        />
        <button
          onClick={handleSolicitar}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
        >
          Solicitar préstamo
        </button>
      </div>

      <LoanMessage mensaje={mensaje} error={error} />

      <h2 className="text-xl font-semibold mb-2">📋 Mis Préstamos</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Material</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-left">Fecha</th>
              <th className="px-3 py-2 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.length > 0 ? (
              prestamos.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{p.id}</td>
                  <td className="px-3 py-2">{p.materialNombre}</td>
                  <td className="px-3 py-2 capitalize">{p.estado}</td>
                  <td className="px-3 py-2">
                    {new Date(p.fechaHoraPrestamo).toLocaleString("es-CL")}
                  </td>
                  <td className="px-3 py-2">
                    {p.estado === "pendiente" && (
                      <button
                        onClick={handleDevolver}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Devolver
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3 text-gray-500">
                  No tienes préstamos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}




