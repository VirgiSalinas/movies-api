import { Router } from "express";
import * as movieController from "./movie.controller";

// CAPA DE RUTAS
// Solo dice "qué función atiende cada combinación de método + URL".
// Las URLs son relativas: en app.ts este router se monta en /api/movies,
// así que "/" significa /api/movies y "/:id" significa /api/movies/:id.
const router = Router();

router.get("/", movieController.getAll);
router.get("/:id", movieController.getById);

// Cuando sumemos autenticación, estas tres van a llevar el middleware de JWT.
router.post("/", movieController.create);
router.put("/:id", movieController.update);
router.delete("/:id", movieController.remove);

export default router;
