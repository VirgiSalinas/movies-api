// Un Error común, pero que además lleva el código de estado HTTP.
//
// ¿Para qué? El service detecta problemas ("el puntaje es inválido", "no existe")
// pero NO conoce Express, así que no puede hacer res.status(400).
// En cambio, lanza: throw new HttpError(400, "...").
// El controller lo atrapa en su catch y usa error.status para responder.
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message); // guarda el mensaje como cualquier Error
    this.status = status;
    this.name = "HttpError";
  }
}
