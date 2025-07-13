"use strict";

import { Router } from "express";
import { createLoan, returnLoan, getAllLoans } from "../controllers/loan.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js"; // ✅ Importado

const router = Router();

router.post("/", authenticateJwt, createLoan);
router.put("/devolver", authenticateJwt, returnLoan);
router.get("/", authenticateJwt, isAdmin, getAllLoans); // ✅ Solo admin

export default router;
