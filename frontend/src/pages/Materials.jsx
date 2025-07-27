// src/pages/Materials.jsx
import { useEffect, useState } from "react";
import { getAllMaterials } from "@services/material.service.js";

export default function Materials() {
  const [materiales, setMateriales] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllMaterials();
        setMateriales(data);
      } catch (err) {
        console.error(err);
        setError("Error al obtener materiales");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📦 Materiales Disponibles
      </h1>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      {materiales.length === 0 ? (
        <p className="text-gray-600">No hay materiales disponibles.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Disponible</th>
              <th className="px-4 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((mat, index) => (
              <tr key={mat.id} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{mat.nombre}</td>
                <td className="px-4 py-2">{mat.tipo}</td>
                <td className="px-4 py-2">{mat.cantidadTotal}</td>
                <td className="px-4 py-2">{mat.cantidadDisponible}</td>
                <td className="px-4 py-2">{mat.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}



