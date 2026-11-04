import { env } from "./config/env";
import app from "./app";

// Punto de entrada de la aplicación.
// Más adelante, acá vamos a conectar MongoDB ANTES de empezar a escuchar peticiones.
app.listen(env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${env.PORT}`);
});
