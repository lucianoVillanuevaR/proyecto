import { editayudantia } from '@services/ayudantias.service.js';
import Swal from "sweetalert2";

async function editAyudantiaInfo(ayudantia) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Ayudantía",
    html: `
    <div>
      <label for="swal2-input1">Asignatura</label>  
      <input id="swal2-input1" class="swal2-input" placeholder="Nombre de la asignatura" value="${ayudantia.asignatura}">
    </div>
    <div>
      <label for="swal2-input2">Descripción</label>
      <textarea id="swal2-input2" class="swal2-textarea" placeholder="Descripción de la ayudantía">${ayudantia.descripcion}</textarea>
    </div>
    <div>
      <label for="swal2-input3">Cupos</label>
      <input id="swal2-input3" class="swal2-input" type="number" placeholder="Número de cupos" value="${ayudantia.cupo}">
    </div>
    <div>
      <label for="swal2-input4">¿Hay profesor disponible?</label>
      <select id="swal2-input4" class="swal2-select">
        <option value="true" ${ayudantia.hayprofesor ? 'selected' : ''}>Sí</option>
        <option value="false" ${!ayudantia.hayprofesor ? 'selected' : ''}>No</option>
      </select>
    </div>
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      const asignatura = document.getElementById("swal2-input1").value;
      const descripcion = document.getElementById("swal2-input2").value;
      const cupos = document.getElementById("swal2-input3").value;
      const hayprofesor = document.getElementById("swal2-input4").value;

      if (!asignatura || !descripcion) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
        return false;
      }

      if (asignatura.length < 3 || asignatura.length > 50) {
        Swal.showValidationMessage(
          "La asignatura debe tener entre 3 y 50 caracteres"
        );
        return false;
      }

      if (descripcion.length < 5 || descripcion.length > 200) {
        Swal.showValidationMessage(
          "La descripción debe tener entre 5 y 200 caracteres"
        );
        return false;
      }

      if (!cupos || cupos <= 0 || cupos > 100) {
        Swal.showValidationMessage(
          "Los cupos deben ser un número entre 1 y 100"
        );
        return false;
      }

      return { asignatura, descripcion, cupo: parseInt(cupos), hayprofesor: hayprofesor === 'true' };
    },
  });
  if (formValues) {
    return {
      asignatura: formValues.asignatura,
      descripcion: formValues.descripcion,
      cupo: formValues.cupo,
      hayprofesor: formValues.hayprofesor,
    };
  }
}

export const useEditAyudantia = (fetchAyudantias) => {
  const handleEditAyudantia = async (ayudantiaId, ayudantia) => {
    try {
      const formValues = await editAyudantiaInfo(ayudantia);
      if (!formValues) return;

      const response = await editayudantia(ayudantiaId, formValues);
      if (response) {
        await fetchAyudantias();
      }
    } catch (error) {
      console.error("Error al editar ayudantía:", error);
    }
  };

  return { handleEditAyudantia };
};

export default useEditAyudantia;