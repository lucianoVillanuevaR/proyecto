"use strict";
import { Router } from "express";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import materialRoutes from "./material.routes.js";
import loanRoutes from "./loan.routes.js"; 
import ayudantiasRoutes from "./ayudantia.routes.js";
import solicitudesRoutes from "./SolAyudantia.routes.js";
import activityRoutes from "./activity.routes.js";
const router = Router(); 


router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/materiales", materialRoutes);
router.use("/prestamos", loanRoutes);
router.use("/ayudantias", ayudantiasRoutes);
router.use("/solicitudes", solicitudesRoutes);
router.use("/activities", activityRoutes);

export default router;
