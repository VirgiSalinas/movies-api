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

// POST /api/auth/login
export async function login(req: Request, res: Response) {
  try {
    const result = await userService.login(req.body ?? {});
    res.status(200).json(result); // { token, user }
  } catch (error) {
    handleError(res, error);
  }
}
