"use strict";

import Material from "../entity/material.entity.js";
import Loan from "../entity/loan.entity.js";
import { AppDataSource } from "../config/configDb.js";

const loanRepository = AppDataSource.getRepository(Loan);
const materialRepository = AppDataSource.getRepository(Material);

// Registrar un nuevo préstamo
export async function createLoan(req, res) {
  try {
    const estudianteEmail = req.user.email;
    const { materialNombre } = req.body;

    // Verificar si el estudiante ya tiene un préstamo pendiente
    const prestamoPendiente = await loanRepository.findOne({
      where: { estudianteEmail, estado: "pendiente" },
    });

    if (prestamoPendiente) {
      return res
        .status(400)
        .json({ message: "Ya tienes un préstamo pendiente de devolución." });
    }

    // Buscar el material
    const material = await materialRepository.findOne({
      where: { nombre: materialNombre },
    });

    if (!material || material.estado !== "activo") {
      return res.status(404).json({ message: "Material no disponible." });
    }

    if (material.cantidadDisponible <= 0) {
      return res.status(400).json({ message: "No hay stock disponible." });
    }

    // Validación opcional: horario (8:00 a 18:00)
    const ahora = new Date();
    const hora = ahora.getHours();
    if (hora < 8 || hora >= 18) {
      return res.status(403).json({
        message:
          "Los préstamos solo están disponibles entre las 08:00 y las 18:00 horas.",
      });
    }

    // Crear el préstamo
    const nuevoPrestamo = loanRepository.create({
      estudianteEmail,
      materialNombre,
      estado: "pendiente",
    });

    await loanRepository.save(nuevoPrestamo);

    // Descontar 1 del stock disponible del material
    material.cantidadDisponible -= 1;
    await materialRepository.save(material);

    res.status(201).json({
      message: "Préstamo registrado exitosamente.",
      data: nuevoPrestamo,
    });
  } catch (error) {
    console.error("Error al registrar préstamo: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Devolver préstamo pendiente
export async function returnLoan(req, res) {
  try {
    const estudianteEmail = req.user.email;

    // Buscar préstamo pendiente
    const prestamo = await loanRepository.findOne({
      where: { estudianteEmail, estado: "pendiente" },
    });

    if (!prestamo) {
      return res
        .status(404)
        .json({ message: "No tienes préstamos pendientes para devolver." });
    }

    // Buscar el material asociado
    const material = await materialRepository.findOne({
      where: { nombre: prestamo.materialNombre },
    });

    if (!material) {
      return res.status(404).json({
        message: "No se encontró el material asociado al préstamo.",
      });
    }

    // Marcar préstamo como devuelto y registrar fecha
    prestamo.estado = "devuelto";
    prestamo.fechaHoraDevolucion = new Date();
    await loanRepository.save(prestamo);

    // Aumentar stock disponible
    material.cantidadDisponible += 1;
    await materialRepository.save(material);

    res.status(200).json({ message: "Préstamo devuelto exitosamente." });
  } catch (error) {
    console.error("Error al devolver préstamo: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
