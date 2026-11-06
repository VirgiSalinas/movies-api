import mongoose from "mongoose";
import { env } from "./env";

// Conecta a MongoDB Atlas. Es async porque la conexión viaja por internet y tarda:
// quien la llame tiene que esperarla con `await`.
export async function connectDB(): Promise<void> {
  if (!env.MONGO_URI) {
    throw new Error("Falta MONGO_URI en el archivo .env");
  }

  // dbName elige la base dentro del cluster. Así este proyecto usa "movies"
  // y no se mezcla con las bases de tu otro proyecto.
  await mongoose.connect(env.MONGO_URI, { dbName: "movies" });

  console.log(`MongoDB conectado (base: ${mongoose.connection.name})`);
}
