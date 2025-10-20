// middlewares/authMiddleware.js (pode criar um arquivo novo ou junto com o checkToken)

import { AppError } from '../utils/AppError.js';

// Middleware para autorização - permite só admins
export function authorizeAdmin(req, res, next) {
  // Aqui o req.user já foi setado pelo middleware checkToken
  if (!req.user || req.user.tipo_user !== 'A') {
    return next(new AppError('Acesso negado. Apenas administradores.', 403, 'FORBIDDEN', true));
  }
  next();
}
