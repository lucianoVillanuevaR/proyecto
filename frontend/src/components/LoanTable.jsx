export default function LoanTable({ prestamos, devolverPrestamo }) {
  return (
    <table className="w-full border text-sm text-left mt-6">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Estudiante</th>
          <th className="border px-2 py-1">Material</th>
          <th className="border px-2 py-1">Estado</th>
          <th className="border px-2 py-1">Fecha Préstamo</th>
          <th className="border px-2 py-1">Acción</th>
        </tr>
      </thead>
      <tbody>
        {prestamos.map((p) => (
          <tr key={p.id}>
            <td className="border px-2 py-1">{p.id}</td>
            <td className="border px-2 py-1">{p.estudianteEmail}</td>
            <td className="border px-2 py-1">{p.materialNombre}</td>
            <td className="border px-2 py-1">{p.estado}</td>
            <td className="border px-2 py-1">
              {new Date(p.fechaHoraPrestamo).toLocaleString()}
            </td>
            <td className="border px-2 py-1">
              {p.estado === "pendiente" ? (
                <button
                  onClick={() => devolverPrestamo(p.id)}
                  className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Devolver
                </button>
              ) : (
                "Devuelto"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
