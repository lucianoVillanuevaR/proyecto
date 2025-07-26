"use strict";
import { Router } from "express";
import { 
    solicitarAyudantia, 
    misSolicitudes, 
    getSolicitudById 
} from "../controllers/solAyudantia.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateJwt);

// POST /api/solicitudes - Solicitar una ayudantía
router.post("/", solicitarAyudantia);

// GET /api/solicitudes - Ver mis solicitudes
router.get("/", misSolicitudes);

// GET /api/solicitudes/:id - Ver solicitud específica
router.get("/:id", getSolicitudById);

export default router;