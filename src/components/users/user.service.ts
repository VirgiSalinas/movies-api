import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { HttpError } from "../../utils/HttpError";
import { IUser } from "./user.model";
import * as userRepository from "./user.repository";

type UserInput = Partial<Record<keyof IUser, unknown>>;

// Cuántas "vueltas" hace bcrypt al hashear. Más vueltas = más lento = más difícil
// de romper por fuerza bruta. 10 es el valor estándar.
const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = "2h";
const MIN_PASSWORD_LENGTH = 6;

// Formato básico: algo@algo.algo (sin espacios)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateText(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(400, `El campo '${field}' es obligatorio y debe ser texto`);
  }
  return value.trim();
}

// ---------- REGISTRO ----------
export async function register(input: UserInput) {
  const name = validateText(input.name, "name");
  const email = validateText(input.email, "email").toLowerCase();
  const password = input.password;

  if (!EMAIL_REGEX.test(email)) {
    throw new HttpError(400, "El email no tiene un formato válido");
  }
  // OJO: la contraseña NO se recorta con trim: los espacios son parte de ella.
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
  }
  if (await userRepository.findByEmail(email)) {
    throw new HttpError(400, "Ya existe un usuario con ese email");
  }

  // bcrypt.hash convierte "miClave123" en algo como "$2b$10$Xq9...".
  // Es de UNA SOLA VÍA: no se puede volver a la contraseña original.
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return userRepository.create({ name, email, password: hashedPassword });
}

// ---------- LOGIN ----------
export async function login(input: UserInput) {
  const email = validateText(input.email, "email").toLowerCase();
  const password = input.password;
  if (typeof password !== "string" || password === "") {
    throw new HttpError(400, "El campo 'password' es obligatorio");
  }

  const user = await userRepository.findByEmailWithPassword(email);

  // bcrypt.compare hashea la contraseña recibida y la compara con el hash guardado.
  const passwordOk = user ? await bcrypt.compare(password, user.password) : false;

  // Mismo mensaje si el email no existe o si la contraseña está mal:
  // así nadie puede averiguar qué emails están registrados.
  if (!user || !passwordOk) {
    throw new HttpError(401, "Email o contraseña incorrectos");
  }

  // El token lleva SOLO el id (requisito: sin datos sensibles).
  // Ojo: un JWT se puede decodificar sin la clave (cualquiera lo lee en jwt.io);
  // la clave solo sirve para FIRMARLO y que nadie pueda falsificarlo o modificarlo.
  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

  return { token, user };
}
