//validateRequiredFields.js
import { AppError } from "../utils/AppError.js";

export function validateRequiredFields(requiredFields) {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      const message = `Os seguintes campos são obrigatórios: ${missingFields.join(", ")}`;
      throw new AppError(message, 400);
    }

    next();
  };
}
