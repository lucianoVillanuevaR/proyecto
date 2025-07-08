"use strict";

import Material from "../entity/material.entity.js";
import Loan from "../entity/loan.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createLoanValidation } from "../validations/loan.validation.js";

const loanRepository = AppDataSource.getRepository(Loan);
const materialRepository = AppDataSource.getRepository(Material);

// Registrar un nuevo préstamo
export async function createLoan(req, res) {
  try {
    const estudianteEmail = req.user.email;
    const { materialNombre } = req.body;

  
    const { error } = createLoanValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

  
    const prestamoPendiente = await loanRepository.findOne({
      where: { estudianteEmail, estado: "pendiente" },
    });
    if (prestamoPendiente) {
      return res.status(400).json({
        message: "Ya tienes un préstamo pendiente de devolución.",
      });
    }


    const material = await materialRepository.findOne({
      where: { nombre: materialNombre },
    });
    if (!material || material.estado !== "activo") {
      return res.status(404).json({ message: "Material no disponible." });
    }

  
    if (material.cantidadDisponible <= 0) {
      return res.status(400).json({ message: "No hay stock disponible." });
    }

  const ahora = new Date();
const hora = ahora.getHours();
const rolUsuario = req.user?.rol || req.user?.role; 
//Admin
if ((hora < 8 || hora >= 18) && rolUsuario !== "administrador") {
  return res.status(403).json({
    message:
      "Los préstamos solo están disponibles entre las 08:00 y las 18:00.",
  });
}

    const nuevoPrestamo = loanRepository.create({
      estudianteEmail,
      materialNombre,
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
    console.error("Error al registrar préstamo: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Devolver un préstamo pendiente
export async function returnLoan(req, res) {
  try {
    const estudianteEmail = req.user.email;

    const prestamo = await loanRepository.findOne({
      where: { estudianteEmail, estado: "pendiente" },
    });
    if (!prestamo) {
      return res
        .status(404)
        .json({ message: "No tienes préstamos pendientes para devolver." });
    }

    const material = await materialRepository.findOne({
      where: { nombre: prestamo.materialNombre },
    });
    if (!material) {
      return res.status(404).json({
        message: "No se encontró el material asociado al préstamo.",
      });
    }

    prestamo.estado = "devuelto";
    prestamo.fechaHoraDevolucion = new Date();
    await loanRepository.save(prestamo);

    material.cantidadDisponible += 1;
    await materialRepository.save(material);

    res.status(200).json({ message: "Préstamo devuelto exitosamente." });
  } catch (error) {
    console.error("Error al devolver préstamo: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
