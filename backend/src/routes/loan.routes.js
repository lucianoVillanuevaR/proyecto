"use strict";

import { Router } from "express";
import { createLoan, returnLoan } from "../controllers/loan.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";


const router = Router();

// Crear préstamo (usuario autenticado)
router.post("/", authenticateJwt, createLoan);

// Devolver préstamo
router.put("/devolver", authenticateJwt, returnLoan);

export default router;
