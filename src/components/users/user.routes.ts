import { Router } from "express";
import * as userController from "./user.controller";

// Se monta en /api/auth (ver app.ts)
const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);

export default router;
