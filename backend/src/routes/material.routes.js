"use strict";

import { Router } from "express";
import {
  createMaterial,
  getAllMaterials,
  getMaterialById,
} from "../controllers/material.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

// Crear nuevo material (solo admins)
router.post("/", authenticateJwt, isAdmin, createMaterial);

// Obtener todos los materiales (cualquier usuario autenticado)
router.get("/", authenticateJwt, getAllMaterials);

// Obtener material por ID
router.get("/:id", authenticateJwt, getMaterialById);

export default router;
