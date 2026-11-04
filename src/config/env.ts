import dotenv from "dotenv";

// Lee el archivo .env y carga sus variables en process.env.
// Se ejecuta una sola vez, la primera vez que alguien importa este archivo.
dotenv.config();

// Centralizamos las variables acá: el resto del código importa `env`
// en vez de leer process.env directamente. Si falta alguna, nos enteramos en un solo lugar.
export const env = {
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
};
