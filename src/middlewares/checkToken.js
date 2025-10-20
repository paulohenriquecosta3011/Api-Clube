//checkToken.js
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

function checkToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido', 401, 'TOKEN_NAO_FORNECIDO', true);
    }

    const token = authHeader.split(' ')[1];

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Valida se o payload tem o campo tipo_user
    if (!decoded || !decoded.tipo_user) {    
      throw new AppError('Token malformado ou inválido', 401, 'TOKEN_INVALIDO', true);
    }

    // Coloca o usuário decodificado no req para usar nas próximas etapas
    req.user = decoded;

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token expirado
      return res.status(401).json({
        status: 'fail',
        message: 'Token expirado',
        code: 'TOKEN_EXPIRADO',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      // Token inválido (assinatura, formato, etc)
      return res.status(401).json({
        status: 'fail',
        message: 'Token inválido',
        code: 'TOKEN_INVALIDO',
      });
    }

    // Se for um AppError, usa sua mensagem e status
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
        code: error.code,
      });
    }

    // Erro inesperado
    console.error('Erro no middleware checkToken:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erro interno no servidor',
      code: 'SERVER_ERROR',
    });
  }
}


export default checkToken;