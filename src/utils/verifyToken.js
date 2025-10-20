//vefifyToken.js
import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError("Token inválido ou expirado", 401, "INVALID_OR_EXPIRED_TOKEN", true);
  }
}
