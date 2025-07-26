"use strict";

import { Router } from "express";
import {
  createMaterial,
  getAllMaterials
} from "../controllers/material.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";

const router = Router();

router.post("/", authenticateJwt, isAdmin, createMaterial);
router.get("/", authenticateJwt, getAllMaterials);

export default router;
