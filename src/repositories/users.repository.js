// users.repository.js
import pool from '../db/db.js';
import { AppError } from "../utils/AppError.js";

export async function createUser({ name, email, id_base, tipo_user, id_empresa }) {
  try {    
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, id_base, tipo_user, id_empresa) VALUES (?, ?, ?, ?, ?)",
      [name, email, id_base,tipo_user, id_empresa]
    );

    return {
      id: result.insertId,
      name,
      email,
      id_base
    };
  } catch (error) {
    console.error('Erro original no DB:', error);  // <-- log do erro original para debug
    throw new AppError(
      'Erro ao criar usuário.',
      500,
      'USER_CREATION_FAILED',
      true
    );        
  }
}

export async function createCodigoValidacao(email, codigo) {
  try {
    await pool.execute(
      "UPDATE users SET CodigoValidacao = ? WHERE email = ?",
      [codigo, email]
    );

    return { email, codigo };
  } catch (error) {
    console.error('Erro original no DB:', error);
    throw new AppError(
      'Erro ao criar Código de Validação.',
      500,
      'CODIGO_CREATION_FAILED',
      true
    );
  }
}

export async function findUserByEmail(email) {
  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0]; // Retorna o primeiro (ou undefined)
  } catch (error) {
    console.error('Erro original no DB:', error);
    throw new AppError(
      'Erro ao buscar usuário pelo email.',
      500,
      'USER_FIND_BY_EMAIL_FAILED',
      true
    );
  }
}

export async function findCodigoByEmail(email) {
  try {
    const [rows] = await pool.execute(
      "SELECT codigovalidacao FROM users WHERE email = ?",
      [email]
    );

    return rows[0]?.codigovalidacao;

  } catch (error) {
    console.error('Erro original no DB:', error);  // <-- log do erro original para debug
    // Lançando erro customizado com AppError
    throw new AppError(
      'Erro ao buscar código de validação pelo e-mail.',
      500,
      'FIND_CODIGO_BY_EMAIL_ERROR',
      true
    );
  }
}


export async function updatePasswordRepository  (email, hashedPassword) {
  try {
    await pool.execute(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    return { email };
  } catch (error) {
    console.error('Erro original no DB:', error);
    throw new AppError(
      'Erro ao criar senha.',
      500,
      'PASSWORD_CREATION_FAILED',
      true
    );
  }
}
