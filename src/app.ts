import express from "express";

// app.ts SOLO configura Express: middlewares y rutas.
// No levanta el servidor ni conecta a la base (eso es trabajo de server.ts).
const app = express();

// Middleware que convierte el body JSON de cada petición en un objeto (req.body).
// Sin esto, en un POST req.body llegaría como undefined.
app.use(express.json());

// Ruta de prueba para verificar que la API responde.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
