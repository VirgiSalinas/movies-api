import { NextFunction, Request, Response } from "express";
import { handleError } from "../utils/handleError";

// 404 PARA RUTAS INEXISTENTES
// Se registra DESPUÉS de todas las rutas: si una petición llegó hasta acá,
// es porque ninguna ruta la atendió (ej: GET /api/peliculas).
export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// MANEJADOR GLOBAL DE ERRORES
// Express lo reconoce como "de errores" porque tiene 4 parámetros (err primero).
// Atrapa los errores que ocurren FUERA de los controllers, donde nuestros
// try/catch no llegan. El caso típico: un body con JSON mal escrito, que
// express.json() rechaza antes de que la petición llegue a la ruta.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (isJsonSyntaxError(err)) {
    res.status(400).json({ message: "El body no es un JSON válido" });
    return;
  }
  handleError(res, err); // cualquier otro error: 500 sin exponer detalles
}

// express.json() marca sus errores de parseo con type = "entity.parse.failed"
function isJsonSyntaxError(err: unknown) {
  return typeof err === "object" && err !== null && "type" in err && err.type === "entity.parse.failed";
}
