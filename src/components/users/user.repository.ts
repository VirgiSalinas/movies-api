import { IUser, UserModel } from "./user.model";

// Único archivo que habla con UserModel (mismo rol que movie.repository).

// Para el registro: ¿ya existe alguien con este email? No necesitamos la contraseña.
export function findByEmail(email: string) {
  return UserModel.findOne({ email: email.toLowerCase() });
}

// Para el login: necesitamos el hash para compararlo.
// Como el schema tiene select: false, hay que pedirlo con "+password".
export function findByEmailWithPassword(email: string) {
  return UserModel.findOne({ email: email.toLowerCase() }).select("+password");
}

export function create(data: IUser) {
  return UserModel.create(data);
}
