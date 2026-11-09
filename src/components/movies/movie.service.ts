import { HttpError } from "../../utils/HttpError";
import { IMovie } from "./movie.model";
import * as movieRepository from "./movie.repository";

// CAPA DE SERVICIO (lógica de negocio)
// - Decide QUÉ está permitido: valida los datos y aplica las reglas del catálogo.
// - No conoce Express (no hay req ni res). Si algo está mal, lanza un HttpError
//   con el código adecuado y el controller se encarga de responder.
// - No conoce Mongoose: para leer o guardar, le pide al repository.

// Lo que llega en el body de un POST/PUT: todavía no sabemos si los tipos son correctos.
type MovieInput = Partial<Record<keyof IMovie, unknown>>;

// ---------- Validaciones ----------

// REGLA DE NEGOCIO 1: puntaje de 1 a 5, en pasos de 0.5 (para 5 estrellas).
function validateRating(rating: unknown): number {
  if (typeof rating !== "number" || Number.isNaN(rating)) {
    throw new HttpError(400, "El puntaje debe ser un número");
  }
  if (rating < 1 || rating > 5) {
    throw new HttpError(400, "El puntaje debe estar entre 1 y 5");
  }
  // Truco: si rating * 2 es entero, rating es entero o termina en .5
  // 3.5 * 2 = 7 (ok) | 3.7 * 2 = 7.4 (no)
  if (!Number.isInteger(rating * 2)) {
    throw new HttpError(400, "El puntaje va en pasos de 0.5 (ej: 3 o 3.5)");
  }
  return rating;
}

// Un texto obligatorio: tiene que ser string y no estar vacío.
function validateText(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(400, `El campo '${field}' es obligatorio y debe ser texto`);
  }
  return value.trim();
}

// REGLA DE NEGOCIO 2: no puede haber dos películas con el mismo título.
// excludeId: al editar, la película no "choca" consigo misma.
async function ensureTitleIsFree(title: string, excludeId?: string) {
  const existing = await movieRepository.findByTitle(title);
  if (existing && existing.id !== excludeId) {
    throw new HttpError(400, `Ya existe una película con el título '${title}'`);
  }
}

// ---------- Casos de uso (uno por endpoint) ----------

export function getAll(filters: movieRepository.MovieFilters) {
  return movieRepository.findAll(filters);
}

export async function getById(id: string) {
  const movie = await movieRepository.findById(id);
  if (!movie) throw new HttpError(404, "Película no encontrada");
  return movie;
}

export async function create(input: MovieInput) {
  // Armamos el objeto campo por campo: así ignoramos cualquier dato extra
  // que manden en el body (por ejemplo un "_id" inventado).
  const data: IMovie = {
    title: validateText(input.title, "title"),
    director: validateText(input.director, "director"),
    genre: validateText(input.genre, "genre"),
    rating: validateRating(input.rating),
  };
  await ensureTitleIsFree(data.title);
  return movieRepository.create(data);
}

export async function update(id: string, input: MovieInput) {
  // Primero verificamos que exista: si no, 404 (y no seguimos validando).
  await getById(id);

  // En un update los campos son opcionales: validamos solo los que vinieron.
  const data: Partial<IMovie> = {};
  if (input.title !== undefined) data.title = validateText(input.title, "title");
  if (input.director !== undefined) data.director = validateText(input.director, "director");
  if (input.genre !== undefined) data.genre = validateText(input.genre, "genre");
  if (input.rating !== undefined) data.rating = validateRating(input.rating);

  if (Object.keys(data).length === 0) {
    throw new HttpError(400, "No se envió ningún campo para actualizar");
  }
  if (data.title) await ensureTitleIsFree(data.title, id);

  return movieRepository.update(id, data);
}

export async function remove(id: string) {
  const deleted = await movieRepository.remove(id);
  if (!deleted) throw new HttpError(404, "Película no encontrada");
  return deleted;
}
