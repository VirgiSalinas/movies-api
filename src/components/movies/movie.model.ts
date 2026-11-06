import { Schema, model } from "mongoose";

// 1) La "forma" de una película para TypeScript.
//    Sirve para que el editor te autocomplete y te avise si usás mal un campo.
//    Solo existe mientras programás: TypeScript la borra al compilar.
export interface IMovie {
  title: string;
  director: string;
  genre: string;
  rating: number;
}

// 2) El Schema: la "forma" de una película para MongoDB.
//    Esta SÍ existe cuando la app corre: Mongoose la usa para validar
//    y convertir los datos antes de guardarlos.
const movieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true, // "  Matrix  " se guarda como "Matrix"
    },
    director: {
      type: String,
      required: [true, "El director es obligatorio"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "El género es obligatorio"],
      trim: true,
      lowercase: true, // "Drama" y "drama" quedan iguales -> facilita filtrar por género
    },
    rating: {
      type: Number,
      required: [true, "El puntaje es obligatorio"],
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
    versionKey: false, // oculta el campo interno "__v" que agrega Mongoose
  },
);

// 3) El Model: el objeto con el que hacemos consultas (find, create, etc.).
//    "Movie" -> Mongoose crea la colección "movies" (en minúscula y plural).
export const MovieModel = model<IMovie>("Movie", movieSchema);
