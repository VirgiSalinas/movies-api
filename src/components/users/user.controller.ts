import { Request, Response } from "express";
import { handleError } from "../../utils/handleError";
import * as userService from "./user.service";

// POST /api/auth/register
export async function register(req: Request, res: Response) {
  try {
    const user = await userService.register(req.body ?? {});
    // res.json(user) usa el toJSON del schema -> el hash de la contraseña no sale.
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error);
  }
}

// GET /api/auth/me  (protegida: requiere token)
export async function me(req: Request, res: Response) {
  try {
    // No leemos el id de la URL ni del body: lo sacamos del token, que guardó
    // el middleware auth en req.userId. Así cada usuario solo puede ver SUS datos.
    // El "!" le dice a TypeScript "confiá, acá existe": la ruta tiene auth antes.
    const user = await userService.getProfile(req.userId!);
    res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
}

// POST /api/auth/login
export async function login(req: Request, res: Response) {
  try {
    const result = await userService.login(req.body ?? {});
    res.status(200).json(result); // { token, user }
  } catch (error) {
    handleError(res, error);
  }
}
