import Joi from "joi";

// Validación del body para registrar préstamo
export const createLoanValidation = Joi.object({
  materialNombre: Joi.string().min(2).required().messages({
    "string.base": "El nombre del material debe ser un texto.",
    "string.min": "Debe tener al menos 2 caracteres.",
    "any.required": "El nombre del material es obligatorio.",
  }),
  cantidad: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "La cantidad debe ser un número.",
    "number.min": "Debes solicitar al menos 1 unidad.",
    "number.max": "No puedes solicitar más de 5 unidades por vez.",
    "any.required": "La cantidad es obligatoria.",
  }),
});





