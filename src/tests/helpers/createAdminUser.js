// src/tests/helpers/createAdminUser.js
import db from '../../db/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/generateToken.js';

export async function createAdminUser({ email = null, cleanBeforeInsert = false } = {}) {
  const userEmail = email || `admin${Date.now()}@test.com`;

  if (cleanBeforeInsert && email) {
    // Deleta qualquer usuário com mesmo email e id_empresa=1
    await db.query('DELETE FROM users WHERE email = ? AND id_empresa = ?', [userEmail, 1]);
  }

  const hashedPwd = await bcrypt.hash('admin123', 10);

  const [result] = await db.query(
    `INSERT INTO users (name,email,password,tipo_user,id_base,id_empresa)
     VALUES (?,?,?,?,?,?)`,
    ['Admin Test', userEmail, hashedPwd, 'A', 1, 1]
  );

  const id = result.insertId;

  const token = generateToken(
    { id, email: userEmail, tipo_user: 'A', id_empresa: 1 },
    '1h'
  );

  return { id, email: userEmail, token };
}