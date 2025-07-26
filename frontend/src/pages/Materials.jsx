// src/pages/Materials.jsx
import { useEffect, useState } from "react";
import { getAllMaterials } from "@services/material.service.js";

export default function Materials() {
  const [materiales, setMateriales] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAllMaterials();
        setMateriales(data || []);
      } catch (err) {
        console.error("Error al obtener materiales:", err);
        setError(err.message || "Error al obtener materiales");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          📦 Materiales Disponibles
        </h1>
        <p className="text-gray-600">Cargando materiales...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📦 Materiales Disponibles
      </h1>

      {error && (
        <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded-lg mb-4">
          <strong>Error:</strong> {error}
          {error.includes("permisos") && (
            <p className="mt-2 text-sm">
              Contacta al administrador para obtener acceso a los materiales.
            </p>
          )}
          {error.includes("sesión") && (
            <p className="mt-2 text-sm">
              <button 
                onClick={() => window.location.href = '/login'} 
                className="text-blue-600 underline"
              >
                Ir a iniciar sesión
              </button>
            </p>
          )}
        </div>
      )}

      {materiales.length === 0 ? (
        <p className="text-gray-600">No hay materiales registrados.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materiales.map((mat) => (
            <div
              key={mat.id}
              className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2 capitalize">
                {mat.nombre}
              </h2>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tipo:</span> {mat.tipo}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Disponibles:</span>{" "}
                {mat.cantidadDisponible}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
