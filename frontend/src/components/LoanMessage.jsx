export default function LoanMessage({ mensaje, error }) {
  return (
    <div className="mt-4">
      {mensaje && <p className="text-green-600 font-semibold">{mensaje}</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}
    </div>
  );
}