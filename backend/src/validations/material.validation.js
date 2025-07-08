import Joi from "joi";

export const createMaterialValidation = Joi.object({
  nombre: Joi.string().min(2).required().messages({
    "string.base": "El nombre debe ser un texto.",
    "string.min": "Debe tener al menos 2 caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  tipo: Joi.string().min(2).required().messages({
    "string.base": "El tipo debe ser un texto.",
    "string.min": "Debe tener al menos 2 caracteres.",
    "any.required": "El tipo es obligatorio.",
  }),
  cantidadTotal: Joi.number().integer().min(1).required().messages({
    "number.base": "La cantidad debe ser un número.",
    "number.min": "La cantidad debe ser mayor que cero.",
    "any.required": "La cantidad es obligatoria.",
  }),
});
