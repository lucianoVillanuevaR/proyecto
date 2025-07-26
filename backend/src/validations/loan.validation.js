import Joi from "joi";

// Validación del body para registrar préstamo (solo nombre, sin cantidad)
export const createLoanValidation = Joi.object({
  materialNombre: Joi.string().min(2).required().messages({
    "string.base": "El nombre del material debe ser un texto.",
    "string.min": "Debe tener al menos 2 caracteres.",
    "any.required": "El nombre del material es obligatorio.",
  }),
});
