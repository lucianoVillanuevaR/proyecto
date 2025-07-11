"use strict";

import Material from "../entity/material.entity.js";
import Loan from "../entity/loan.entity.js";
import { AppDataSource } from "../config/configDb.js";

const loanRepository = AppDataSource.getRepository(Loan);
const materialRepository = AppDataSource.getRepository(Material);

export async function createLoan(req, res) {
  try {
    const estudianteEmail = req.user.email;
    const { materialNombre } = req.body;

    if (!materialNombre) {
      return res.status(400).json({ message: "Debes indicar el nombre del material." });
    }

    // Verificar si ya tiene un préstamo pendiente
    const prestamoPendiente = await loanRepository.findOne({
      where: { estudianteEmail, estado: "pendiente" },
    });
    if (prestamoPendiente) {
      return res.status(400).json({ message: "Ya tienes un préstamo pendiente." });
    }

    const material = await materialRepository.findOne({
      where: { nombre: materialNombre.trim().toLowerCase() },
    });

    if (!material || material.estado !== "activo" || material.cantidadDisponible <= 0) {
      return res.status(404).json({ message: "Material no disponible o sin stock." });
    }

   // Validar horario solo para usuarios normales
const hora = new Date().getHours();
const rolUsuario = req.user?.rol || req.user?.role;

if ((hora < 8 || hora >= 18) && rolUsuario !== "administrador") {
  return res.status(403).json({
    message: "Los préstamos solo están disponibles entre 08:00 y 18:00.",
  });
}


    const nuevoPrestamo = loanRepository.create({
      estudianteEmail,
      materialNombre: material.nombre,
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

export async function returnLoan(req, res) {
  try {
    const estudianteEmail = req.user.email;

    const prestamo = await loanRepository.findOne({
      where: { estudianteEmail, estado: "pendiente" },
    });

    if (!prestamo) {
      return res.status(404).json({ message: "No tienes préstamos pendientes." });
    }

    const material = await materialRepository.findOne({
      where: { nombre: prestamo.materialNombre.trim().toLowerCase() },
    });

    if (!material) {
      return res.status(404).json({ message: "Material no encontrado." });
    }

    // Actualizar préstamo y stock
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
