"use strict";

import Material from "../entity/material.entity.js";
import Loan from "../entity/loan.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createLoanValidation } from "../validations/loan.validation.js";

const loanRepository = AppDataSource.getRepository(Loan);
const materialRepository = AppDataSource.getRepository(Material);

// Crear un préstamo
export async function createLoan(req, res) {
  try {
    const { error } = createLoanValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const estudianteEmail = req.user.email;
    const rolUsuario = req.user?.rol || req.user?.role;
    const { materialNombre } = req.body;

    const prestamoPendiente = await loanRepository.findOne({
      where: { estudianteEmail, estado: "pendiente" },
    });

    if (prestamoPendiente) {
      return res.status(400).json({ message: "Ya tienes un préstamo pendiente." });
    }

    const nombreNormalizado = materialNombre.trim().toLowerCase();
    const material = await materialRepository.findOne({
      where: { nombre: nombreNormalizado },
    });

    if (!material || material.estado !== "activo" || material.cantidadDisponible <= 0) {
      return res.status(404).json({ message: "Material no disponible o sin stock." });
    }

    const hora = new Date().getHours();
    // Solo permitir fuera de horario a administradores, los demás (estudiante, usuario) solo en horario
    if ((hora < 8 || hora >= 18) && rolUsuario !== "administrador") {
      return res.status(403).json({
        message: "Los préstamos solo están disponibles entre 08:00 y 18:00.",
      });
    }

    const nuevoPrestamo = loanRepository.create({
      estudianteEmail,
      materialNombre: nombreNormalizado,
      estado: "pendiente",
    });
    await loanRepository.save(nuevoPrestamo);

    material.cantidadDisponible -= 1;
    await materialRepository.save(material);

    res.status(201).json({
      message: "Préstamo registrado exitosamente.",
      data: nuevoPrestamo,
    });
  } catch (error) {
    console.error("Error al registrar préstamo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Devolver préstamo pendiente
export async function returnLoan(req, res) {
  try {
    const estudianteEmail = req.user.email;

    const prestamo = await loanRepository.findOne({
      where: { estudianteEmail, estado: "pendiente" },
    });

    if (!prestamo) {
      return res.status(404).json({ message: "No tienes préstamos pendientes." });
    }

    const nombreNormalizado = prestamo.materialNombre.trim().toLowerCase();
    const material = await materialRepository.findOne({
      where: { nombre: nombreNormalizado },
    });

    if (!material) {
      return res.status(404).json({ message: "Material no encontrado." });
    }

    prestamo.estado = "devuelto";
    prestamo.fechaHoraDevolucion = new Date();
    await loanRepository.save(prestamo);

    material.cantidadDisponible += 1;
    await materialRepository.save(material);

    res.status(200).json({ message: "Préstamo devuelto exitosamente." });
  } catch (error) {
    console.error("Error al devolver préstamo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Obtener todos los préstamos
export async function getAllLoans(req, res) {
  try {
    const prestamos = await loanRepository.find({
      order: { id: "DESC" },
    });

    res.status(200).json({
      message: "Lista de préstamos",
      data: prestamos,
    });
  } catch (error) {
    console.error("Error al obtener préstamos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
