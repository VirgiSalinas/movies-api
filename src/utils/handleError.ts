import { Response } from "express";
import { HttpError } from "./HttpError";

// Traduce un error a una respuesta HTTP. La usan los catch de todos los controllers.
export function handleError(res: Response, error: unknown) {
  // Error "esperado": lo lanzó el service a propósito, con su código y mensaje.
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  // Error inesperado (se cayó la base, un bug...). El detalle queda en la consola
  // del servidor: al cliente NO se lo mandamos, porque puede revelar datos internos.
  console.error(error);
  res.status(500).json({ message: "Error interno del servidor" });
}
