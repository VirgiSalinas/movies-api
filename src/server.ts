import { env } from "./config/env";
import { connectDB } from "./config/db";
import app from "./app";

// Punto de entrada de la aplicación.
// Primero conectamos a la base y RECIÉN DESPUÉS escuchamos peticiones:
// si no hay base, no tiene sentido aceptar requests que van a fallar.
async function main() {
  try {
    // Sin clave no se pueden firmar tokens: mejor fallar al arrancar que en el primer login.
    if (!env.JWT_SECRET) throw new Error("Falta JWT_SECRET en el archivo .env");
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
    process.exit(1); // termina el proceso con código de error
  }
}

main();
