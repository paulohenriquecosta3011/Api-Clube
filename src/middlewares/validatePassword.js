// validatePassword.js
import { AppError } from "../utils/AppError.js";

export function validatePassword(fieldName = "password") {
  return (req, res, next) => {
    const password = req.body[fieldName];

  
    if (password.length < 6) {
      throw new AppError("Senha deve ter ao menos 6 caracteres.", 400);
    }

    next();
  };
}
