// src/middlewares/errorHandler.middleware.js

import { AppError } from "../utils/AppError.js"; // ✅ este import estava faltando

export function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV !== "production";
  
  
  console.error("Erro capturado pelo middleware:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      code: err.code || null,
      ...(isDev && { stack: err.stack }) // Exibe o stack apenas em dev      
    });
  }

  // Erros inesperados
  return res.status(500).json({
    status: "error",
    
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    ...(isDev && { stack: err.stack || "Stack trace indisponível" })    
  });
}
