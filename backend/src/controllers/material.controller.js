"use strict";

import Material from "../entity/material.entity.js";
import { AppDataSource } from "../config/configDb.js";

const materialRepository = AppDataSource.getRepository(Material);

// Crear un nuevo material
export async function createMaterial(req, res) {
  try {
    const { nombre, tipo, cantidadTotal } = req.body;

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

    res
      .status(201)
      .json({ message: "Material registrado exitosamente", data: material });
  } catch (error) {
    console.error("Error al crear material: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Obtener todos los materiales
export async function getAllMaterials(req, res) {
  try {
    const materials = await materialRepository.find();
    res.status(200).json({ message: "Materiales encontrados", data: materials });
  } catch (error) {
    console.error("Error al obtener materiales: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Obtener material por ID (opcional)
export async function getMaterialById(req, res) {
  try {
    const { id } = req.params;
    const material = await materialRepository.findOne({ where: { id } });

    if (!material)
      return res.status(404).json({ message: "Material no encontrado" });

    res.status(200).json({ message: "Material encontrado", data: material });
  } catch (error) {
    console.error("Error al buscar material por ID: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
