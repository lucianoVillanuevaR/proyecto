// src/components/LoanForm.jsx
export default function LoanForm({ materialNombre, setMaterialNombre, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-gray-700 font-medium">Nombre del material</span>
        <input
          type="text"
          value={materialNombre}
          onChange={(e) => setMaterialNombre(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm"
          placeholder="Ej. balón de fútbol"
          required
        />
      </label>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Solicitar préstamo
      </button>
    </form>
  );
}
