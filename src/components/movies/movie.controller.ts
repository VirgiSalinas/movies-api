import { Request, Response } from "express";
import { handleError } from "../../utils/handleError";
import * as movieService from "./movie.service";

// CAPA DE CONTROLADOR
// Es el puente entre HTTP y el negocio. Cada función hace siempre lo mismo:
//   1) saca los datos de req   2) llama al service   3) responde con res
// Las decisiones de negocio NO van acá: si algo está mal, el service lanza
// un HttpError y el catch lo convierte en la respuesta correcta.

// Request<{ id: string }> le avisa a TypeScript que req.params trae un "id".
type RequestWithId = Request<{ id: string }>;

// Los query params pueden llegar repetidos (?genre=a&genre=b) y entonces no son
// un string. Solo aceptamos texto: lo demás se ignora como si no hubieran filtrado.
function asText(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

// GET /api/movies  (filtros opcionales: ?genre=&director=&title=)
export async function getAll(req: Request, res: Response) {
  try {
    const movies = await movieService.getAll({
      genre: asText(req.query.genre),
      director: asText(req.query.director),
      title: asText(req.query.title),
    });
    res.status(200).json(movies);
  } catch (error) {
    handleError(res, error);
  }
}

// GET /api/movies/:id
export async function getById(req: RequestWithId, res: Response) {
  try {
    const movie = await movieService.getById(req.params.id);
    res.status(200).json(movie);
  } catch (error) {
    handleError(res, error);
  }
}

// POST /api/movies
export async function create(req: Request, res: Response) {
  try {
    // En Express 5, si la petición no trae body, req.body es undefined.
    // Con "?? {}" el service recibe un objeto vacío y responde 400 (campo obligatorio).
    const movie = await movieService.create(req.body ?? {});
    res.status(201).json(movie); // 201 = "se creó un recurso nuevo"
  } catch (error) {
    handleError(res, error);
  }
}

// PUT /api/movies/:id
export async function update(req: RequestWithId, res: Response) {
  try {
    const movie = await movieService.update(req.params.id, req.body ?? {});
    res.status(200).json(movie);
  } catch (error) {
    handleError(res, error);
  }
}

// DELETE /api/movies/:id
export async function remove(req: RequestWithId, res: Response) {
  try {
    await movieService.remove(req.params.id);
    res.status(200).json({ message: "Película eliminada" });
  } catch (error) {
    handleError(res, error);
  }
}
