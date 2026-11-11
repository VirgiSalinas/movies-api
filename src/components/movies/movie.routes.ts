import { Router } from "express";
import { auth } from "../../middlewares/auth";
import * as movieController from "./movie.controller";

// CAPA DE RUTAS
// Solo dice "qué función atiende cada combinación de método + URL".
// Las URLs son relativas: en app.ts este router se monta en /api/movies,
// así que "/" significa /api/movies y "/:id" significa /api/movies/:id.
const router = Router();

// Públicas: cualquiera puede ver el catálogo.
router.get("/", movieController.getAll);
router.get("/:id", movieController.getById);

// Protegidas: Express ejecuta las funciones en orden, de izquierda a derecha.
// Primero "auth" verifica el token; solo si es válido llama a next() y sigue al controller.
router.post("/", auth, movieController.create);
router.put("/:id", auth, movieController.update);
router.delete("/:id", auth, movieController.remove);

export default router;
