//verificaremail.js
import pool from './../db/db.js';
import { AppError } from '../utils/AppError.js';

export async function VerificarEmailExistente(req, res, next) {
  const { email } = req.body;
  const sql = 'SELECT id_user FROM users WHERE email = ?';

  try {
    const [rows] = await pool.execute(sql, [email]);

    if (rows.length > 0) {
      // Email já existe, lançamos um erro customizado
       
      throw new AppError('OE-mail já está em uso.', 400, 'EMAIL_ALREADY_EXISTS', true);
    }

    next(); // email ok, segue para o próximo middleware/controller
  } catch (error) {
    if (error instanceof AppError) {
      // Passa o erro customizado para o middleware de erro
      next(error);
    } else {
      console.error('Erro ao verificar email:', error);
      // Se for erro inesperado, lança erro genérico
      next(new AppError('Erro interno do servidor.', 500, 'INTERNAL_SERVER_ERROR', true));
    }
  }
}
