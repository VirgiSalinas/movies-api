import express from "express";
import movieRoutes from "./components/movies/movie.routes";
import userRoutes from "./components/users/user.routes";
import { logger } from "./middlewares/logger";
import { errorHandler, notFound } from "./middlewares/errorHandlers";

// app.ts SOLO configura Express: middlewares y rutas.
// No levanta el servidor ni conecta a la base (eso es trabajo de server.ts).
const app = express();

// EL ORDEN IMPORTA: Express ejecuta los app.use() de arriba hacia abajo.

// 1) Logger primero, para registrar TODAS las peticiones (incluso las que fallan).
app.use(logger);

// 2) Convierte el body JSON de cada petición en un objeto (req.body).
//    Sin esto, en un POST req.body llegaría como undefined.
app.use(express.json());

// 3) Rutas
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/api/auth", userRoutes);
app.use("/api/movies", movieRoutes);

// 4) Si ninguna ruta respondió -> 404 en JSON
app.use(notFound);

// 5) Manejador de errores: SIEMPRE al final
app.use(errorHandler);

export default app;
