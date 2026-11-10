import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string; // SIEMPRE el hash de bcrypt, nunca la contraseña real
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true, // crea un índice en MongoDB: la base misma rechaza emails repetidos
      trim: true,
      lowercase: true, // "Ana@Mail.com" y "ana@mail.com" son el mismo usuario
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      select: false, // las consultas NO traen este campo, salvo que lo pidamos explícitamente
    },
  },
  {
    timestamps: true,
    versionKey: false,
    // Red de seguridad: aunque un documento tenga el hash cargado,
    // al convertirlo a JSON (para responder) lo sacamos.
    toJSON: {
      transform: (_doc, ret: Partial<IUser>) => {
        delete ret.password;
        return ret;
      },
    },
  },
);

export const UserModel = model<IUser>("User", userSchema);
