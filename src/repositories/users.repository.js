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
      id_user: result.insertId,
      name,
      email,
      id_base
    };
  } catch (error) {
    throw new AppError(
      'Error creating user.',
      500,
      'USER_CREATION_FAILED',
      true
    );        
  }
}

export async function createCodigoValidacao(email, codigo, id_empresa) {
  try {
    await pool.execute(
       `UPDATE users 
         SET codigovalidacao = ? WHERE email = ?    AND id_empresa = ?
       `,
       [codigo, email, id_empresa]
    );
    return { email, codigo };
    
  } catch (error) {
    //console.error('Erro original no DB:', error);
    throw new AppError(
      'Error creating verification code.',
      500,
      'CODIGO_CREATION_FAILED',
      true
    );
  }
}

export async function findUserByEmail(email, id_empresa) {
  try {
 
    const [rows] = await pool.execute( 
       `SELECT *  FROM users   WHERE email = ?   AND id_empresa = ?`,  [email, id_empresa] );
    return rows[0]; // Retorna o primeiro (ou undefined)
  } catch (error) {
    //console.error('Erro original no DB:', error);
    console.error(" MYSQL ERROR findUserByEmail:");
    console.error("Email:", email);
    console.error("Empresa:", id_empresa);
    console.error(error); 

    throw new AppError(
      'Error fetching user by email.',
      500,
      'USER_FIND_BY_EMAIL_FAILED',
      true
    );
  }
}

export async function findCodigoByEmail(email, id_empresa) {
  try {
    const [rows] = await pool.execute(
      `SELECT codigovalidacao 
       FROM users 
       WHERE email = ? 
         AND id_empresa = ?`,
      [email, id_empresa]
    );

    return rows[0]?.codigovalidacao;

  } catch (error) {
    console.error('Erro original no DB:', error);  // <-- log do erro original para debug
    // Lançando erro customizado com AppError
    throw new AppError(
      'Error fetching verification code by email.',
      500,
      'FIND_CODIGO_BY_EMAIL_ERROR',
      true
    );
  }
}


export async function updatePasswordRepository  (email, hashedPassword, id_empresa) {
  try {
    await pool.execute(
      `UPDATE users 
         SET password = ? 
       WHERE email = ? 
         AND id_empresa = ?`,
      [hashedPassword, email, id_empresa]
    );
    return {
      email,
      passwordUpdated: true
    };
    
  } catch (error) {
    throw new AppError(
      'Error updating password.',
      500,
      'PASSWORD_CREATION_FAILED',
      true
    );
  }
}
