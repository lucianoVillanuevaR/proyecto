export async function getAllMaterials() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/materiales", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener materiales");
  }

  const data = await res.json();
  return data.data; 
}
