import db from '../../db/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/generateToken.js';

/**
 * Cria um usuário padrão para testes
 * @param {Object} options
 * @param {string} options.email - Email fixo opcional
 * @param {boolean} options.cleanBeforeInsert - Se true, deleta usuário existente com mesmo email/id_empresa
 * @returns {Promise<Object>} - Retorna { id, email, token }
 */
export async function createStandardUser({ email = null, cleanBeforeInsert = false } = {}) {
  const userEmail = email || `user${Date.now()}@test.com`;

  if (cleanBeforeInsert && email) {
    await db.query('DELETE FROM users WHERE email = ? AND id_empresa = ?', [userEmail, 1]);
  }

  const hashedPwd = await bcrypt.hash('password123', 10);

  const [result] = await db.query(
    `INSERT INTO users (name,email,password,tipo_user,id_base,id_empresa)
     VALUES (?,?,?,?,?,?)`,
    ['Standard User', userEmail, hashedPwd, 'S', 1, 1]
  );

  const id = result.insertId;

  const token = generateToken(
    { id, email: userEmail, tipo_user: 'S', id_empresa: 1 },
    '1h'
  );

  return { id, email: userEmail, token };
}