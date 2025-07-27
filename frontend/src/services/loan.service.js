import cookies from "js-cookie";

const API_URL = "http://localhost:3000/api/prestamos";

// 📦 Solicitar préstamo
export const solicitarPrestamo = async (materialNombre) => {
  const token = cookies.get("jwt-auth");
  if (!token) throw new Error("No hay token");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ materialNombre }),
  });

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const texto = await res.text();
    throw new Error("Respuesta inesperada del servidor: " + texto.slice(0, 100));
  }

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      const mensaje = data?.message || "No autorizado";
      throw new Error(mensaje);
    }
    throw new Error(data.message || "Error al solicitar préstamo");
  }

  return data;
};

// 🔁 Devolver préstamo (sin enviar id, el backend identifica por token)
export const devolverPrestamo = async () => {
  const token = cookies.get("jwt-auth");
  if (!token) throw new Error("No hay token");

  const res = await fetch(`${API_URL}/devolver`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const texto = await res.text();
    throw new Error("Respuesta inesperada del servidor: " + texto.slice(0, 100));
  }

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      const mensaje = data?.message || "No autorizado";
      throw new Error(mensaje);
    }
    throw new Error(data.message || "Error al devolver préstamo");
  }

  return data;
};

// 📋 Obtener préstamos
export const getPrestamos = async () => {
  const token = cookies.get("jwt-auth");
  if (!token) throw new Error("No hay token");

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const texto = await res.text();
    throw new Error("Respuesta inesperada del servidor: " + texto.slice(0, 100));
  }

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      const mensaje = data?.message || "No autorizado";
      throw new Error(mensaje);
    }
    throw new Error(data.message || "Error al obtener préstamos");
  }

  return data.data;
};
