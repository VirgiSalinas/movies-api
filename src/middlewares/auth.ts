import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// Le enseñamos a TypeScript que, después de pasar por este middleware,
// req puede tener un "userId" (el id del usuario logueado).
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// MIDDLEWARE DE AUTENTICACIÓN
// Se pone ANTES del controller en las rutas protegidas:
//   router.post("/", auth, movieController.create)
// - Token válido   -> guarda el id en req.userId y llama a next() (sigue al controller)
// - Token inválido -> responde 401 y NO llama a next() (el controller nunca se ejecuta)
export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    // El cliente manda el token en el header:  Authorization: Bearer eyJhbGci...
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({ message: "Falta el token. Enviá el header Authorization: Bearer <token>" });
      return;
    }
    const token = header.slice("Bearer ".length);

    // jwt.verify comprueba la FIRMA con nuestra clave y que no esté vencido.
    // Si alguien modificó el token o expiró, lanza un error -> cae en el catch.
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (typeof payload === "string" || typeof payload.id !== "string") {
      res.status(401).json({ message: "Token inválido" });
      return;
    }

    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido o vencido" });
  }
}
