import { isValidObjectId } from "mongoose";
import { IMovie, MovieModel } from "./movie.model";

// CAPA DE ACCESO A DATOS (repository)
// Es el ÚNICO archivo que usa MovieModel. Si mañana cambiáramos MongoDB por
// PostgreSQL, solo reescribiríamos este archivo: el service y el controller no se enteran.
// Acá no hay reglas de negocio ni nada de Express (req/res): solo leer y escribir en la base.

// Filtros opcionales para el listado (vienen de ?genre=...&director=...&title=...).
export interface MovieFilters {
  genre?: string;
  director?: string;
  title?: string;
}

// Escapa caracteres especiales de las expresiones regulares (. * ? etc.)
// para que una búsqueda como "Mission: Impossible?" se tome literal.
function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET todos, con filtros opcionales. Sin filtros, la consulta {} trae todas.
// Acá traducimos los filtros "simples" al lenguaje de consultas de MongoDB.
export function findAll(filters: MovieFilters = {}) {
  const query: Record<string, unknown> = {};

  // género: coincidencia exacta (en la base siempre está en minúscula)
  if (filters.genre) query.genre = filters.genre.toLowerCase();

  // director y título: "contiene", sin distinguir mayúsculas ($options: "i")
  if (filters.director) query.director = { $regex: escapeRegex(filters.director), $options: "i" };
  if (filters.title) query.title = { $regex: escapeRegex(filters.title), $options: "i" };

  return MovieModel.find(query).sort({ createdAt: -1 }); // más nuevas primero
}

// GET por id. Devuelve la película o null si no existe.
export function findById(id: string) {
  // Un _id de Mongo tiene un formato fijo (24 caracteres hexadecimales).
  // Si nos mandan "abc", Mongoose tiraría un CastError. Lo tratamos como
  // "no existe" (null) para que más arriba se responda 404 y no 500.
  if (!isValidObjectId(id)) return null;
  return MovieModel.findById(id);
}

// Busca por título, sin distinguir mayúsculas. Lo va a usar el service
// para la regla de negocio "no repetir títulos".
export function findByTitle(title: string) {
  return MovieModel.findOne({ title }).collation({ locale: "es", strength: 2 });
}

// POST: crea y devuelve la película guardada (ya con su _id).
export function create(data: IMovie) {
  return MovieModel.create(data);
}

// PUT: actualiza y devuelve la versión NUEVA, o null si no existe.
export function update(id: string, data: Partial<IMovie>) {
  if (!isValidObjectId(id)) return null;
  return MovieModel.findByIdAndUpdate(id, data, {
    returnDocument: "after", // sin esto, devuelve el documento como estaba ANTES del cambio
    runValidators: true, // por defecto, los updates NO validan el schema: lo activamos
  });
}

// DELETE: borra y devuelve lo que borró, o null si no existía.
export function remove(id: string) {
  if (!isValidObjectId(id)) return null;
  return MovieModel.findByIdAndDelete(id);
}
