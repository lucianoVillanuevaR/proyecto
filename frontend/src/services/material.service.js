import cookies from 'js-cookie';

export async function getAllMaterials() {
  const token = cookies.get('jwt-auth');

  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  try {
    const res = await fetch("http://localhost:3000/api/materiales", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 403) {
      throw new Error("No tienes permisos para acceder a los materiales");
    }

    if (res.status === 401) {
      throw new Error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente");
    }

    if (!res.ok) {
      throw new Error(`Error del servidor: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();
    return data.data; 
  } catch (error) {
    console.error("Error en getAllMaterials:", error);
    throw error;
  }
}
