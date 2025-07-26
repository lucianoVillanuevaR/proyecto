import { useEffect, useState } from "react";

export default function Materials() {
  const [materiales, setMateriales] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/materiales", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setMateriales(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMateriales();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Materiales</h1>
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      {materiales.length === 0 ? (
        <p>No hay materiales registrados.</p>
      ) : (
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Nombre</th>
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Disponibles</th>
              <th className="border px-2 py-1">Estado</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((mat) => (
              <tr key={mat.id}>
                <td className="border px-2 py-1">{mat.id}</td>
                <td className="border px-2 py-1">{mat.nombre}</td>
                <td className="border px-2 py-1">{mat.tipo}</td>
                <td className="border px-2 py-1">{mat.cantidadTotal}</td>
                <td className="border px-2 py-1">{mat.cantidadDisponible}</td>
                <td className="border px-2 py-1">{mat.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


