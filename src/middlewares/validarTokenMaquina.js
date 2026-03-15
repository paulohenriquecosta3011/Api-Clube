import pool from '../db/db.js';
import { AppError } from '../utils/AppError.js';

export async function validarTokenMaquina(req, res, next) {
  try {
    // Pega o token do header
    const token = req.headers['token-maquina']; // header: Token-Maquina
    if (!token) {
      return res.status(401).json({ message: 'Token da máquina obrigatório.' });
    }

    // Busca máquina no banco
    const [rows] = await pool.execute(
      'SELECT id_maquina, nome FROM maquinas WHERE token_maquina = ?',
      [token]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Token da máquina inválido.' });
    }

    // Adiciona info da máquina no request
    req.maquina = {
      id_maquina: rows[0].id_maquina,
      nome: rows[0].nome
    };

    next();
  } catch (error) {
    console.error('Erro ao validar token da máquina:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
