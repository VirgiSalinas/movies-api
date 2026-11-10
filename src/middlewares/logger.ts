import { NextFunction, Request, Response } from "express";

// MIDDLEWARE DE LOGGING (extra del TP)
// Un middleware es una función que se ejecuta ANTES de llegar a la ruta.
// Recibe (req, res, next): puede leer o modificar la petición y después
// tiene que llamar a next() para que siga a la próxima función. Si no lo llama,
// la petición queda "colgada" y nunca se responde.
export function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // "finish" se dispara cuando la respuesta ya se envió. Esperamos a ese momento
  // para poder mostrar también el código de estado y cuánto tardó.
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms} ms)`);
  });

  next(); // seguí con lo que venga (express.json, las rutas, etc.)
}
