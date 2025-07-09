"use strict";
import Joi from "joi";

// Validación para solicitar ayudantía
export const solicitudValidation = Joi.object({
    ayudantiaId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID de la ayudantía debe ser un número.",
            "number.integer": "El ID de la ayudantía debe ser un número entero.",
            "number.positive": "El ID de la ayudantía debe ser un número positivo.",
            "any.required": "El ID de la ayudantía es obligatorio."
        })
})
.unknown(false)
.messages({
    "object.unknown": "No se permiten campos adicionales"
});