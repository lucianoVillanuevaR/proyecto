"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { getAyudantias,
    createAyudantia,
    getayudantiaById,
    updateAyudantia,
    deleteAyudantia,
} from "../controllers/ayudantia.controller.js";

const router = Router();

router.use(authenticateJwt);

router.get("/", getAyudantias);
router.get("/:id", getayudantiaById);

router.post("/", isAdmin, createAyudantia);
router.put("/:id", isAdmin, updateAyudantia);
router.delete("/:id", isAdmin, deleteAyudantia);


export default router;