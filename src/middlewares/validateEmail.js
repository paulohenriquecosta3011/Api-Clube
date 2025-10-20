// validateEmail.js
import { AppError } from "../utils/AppError.js";

export function validateEmail(fieldName = "email") {
  return (req, res, next) => {
    const email = req.body[fieldName];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("Formato de email inválido.", 400);
    }

    next();
  };
}
