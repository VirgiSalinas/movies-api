import { Router } from "express";
import { auth } from "../../middlewares/auth";
import * as userController from "./user.controller";

// Se monta en /api/auth (ver app.ts)
const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);

// Datos del usuario logueado: primero auth (verifica el token), después el controller.
router.get("/me", auth, userController.me);

export default router;
