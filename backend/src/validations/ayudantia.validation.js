"use strict";
import joi from "joi";

export const createValidation = joi.object({
    asignatura: joi.string()
    .min(3)
    .max(50)
    .required()
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .messages({
        "string.patter.base": "El nombre de la asignatura solo puede contener letras, números y espacios.",
        "string.min": "El nombre de la asignatura debe tener al menos 3 caracteres.",
        "string.max": "El nombre de la asignatura no puede exceder los 50 caracteres.",
        "string.empty": "El nombre de la asignatura es obligatorio.",
    }),
    descripcion: joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
        "string.min": "La descripción debe tener al menos 5 caracteres.",
        "string.max": "La descripción no puede exceder los 100 caracteres.",
        "string.empty": "La descripción es obligatoria.",
    }),
    hayprofesor: joi.boolean()
    .required()
    .messages({
        "boolean.base": "El campo 'hay profesor' debe ser verdadero o falso.",
        "any.required": "El campo 'hay profesor' es obligatorio.",
    }),
    cupo: joi.number()
    .min(1)
    .max(100)
    .messages({
        "number.base": "El campo 'cupo' debe ser un número.",
        "number.min": "El cupo debe ser al menos 1.",
        "number.max": "El cupo no puede exceder 100.",
    }),
}).unknown(false)
.messages({
    "object.unknown": "No se permiten campos adicionales",
});

export const updateValidation = joi.object({
    asignatura: joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .messages({
        "string.patter.base": "El nombre de la asignatura solo puede contener letras, números y espacios.",
        "string.min": "El nombre de la asignatura debe tener al menos 3 caracteres.",
        "string.max": "El nombre de la asignatura no puede exceder los 50 caracteres.",
    }),
    descripcion: joi.string()
    .min(5)
    .max(100)
    .messages({
        "string.min": "La descripción debe tener al menos 5 caracteres.",
        "string.max": "La descripción no puede exceder los 100 caracteres.",
    }),
    hayprofesor: joi.boolean()
    .messages({
        "boolean.base": "El campo 'hay profesor' debe ser verdadero o falso.",
    }),
    cupo: joi.number()
    .min(1)
    .max(100)
    .messages({
        "number.base": "El campo 'cupo' debe ser un número.",
        "number.min": "El cupo debe ser al menos 1.",
        "number.max": "El cupo no puede exceder 100.",
    }),
}).unknown(false)
.messages({
    "object.unknown": "No se permiten campos adicionales",
});