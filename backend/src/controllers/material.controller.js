"use strict";

import Material from "../entity/material.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createMaterialValidation } from "../validations/material.validation.js";
const materialRepository = AppDataSource.getRepository(Material);

//Crear material
export async function createMaterial(req, res) {
  try {
    const { nombre, tipo, cantidadTotal } = req.body;

    const { error } = createMaterialValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const existing = await materialRepository.findOne({ where: { nombre } });
    if (existing)
      return res
        .status(409)
        .json({ message: "El material ya está registrado" });
    const material = materialRepository.create({
      nombre,
      tipo,
      cantidadTotal,
      cantidadDisponible: cantidadTotal, 
    });

    await materialRepository.save(material);

    res.status(201).json({
      message: "Material registrado exitosamente",
      data: material,
    });
  } catch (error) {
    console.error("Error al crear material:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

//Obtener todos los materiales (con stock)
export async function getAllMaterials(req, res) {
  try {
    const materiales = await materialRepository.find({
      order: { id: "ASC" },
    });

    const lista = materiales.map((m) => ({
      id: m.id,
      nombre: m.nombre,
      tipo: m.tipo,
      estado: m.estado,
      cantidadTotal: m.cantidadTotal,
      cantidadDisponible: m.cantidadDisponible,
    }));

    res.status(200).json({
      message: "Lista de materiales",
      data: lista,
    });
  } catch (error) {
    console.error("Error al obtener materiales:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
}

