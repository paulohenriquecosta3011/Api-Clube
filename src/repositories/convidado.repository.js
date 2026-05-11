//convidado.repository.js
import pool from '../db/db.js';
import { AppError } from "../utils/AppError.js";

export async function createConvidado({ nome, cpf, foto }) {

  try {

    const [result] = await pool.execute(
      "INSERT INTO convidados (nome, cpf, foto) VALUES (?, ?, ?)",
      [nome, cpf, foto || null]
    );

    return {
      id: result.insertId,
      nome,
      cpf,
      foto: foto || null
    };

  } catch (error) {

   // console.error('Database error while creating guest:', error);
    throw error;

  }
}

export async function buscarPorCpf(cpf) {

  try {

    const [rows] = await pool.execute(
      "SELECT cpf FROM convidados WHERE cpf = ?",
      [cpf]
    );

    return rows[0] || null;

  } catch (error) {

    //console.error('Database error while fetching guest by CPF:', error);
    throw error;

  }
}

export async function listarConvidadosDoSocio(socioId) {
  try {
    const [rows] = await pool.execute(
      `SELECT DISTINCT c.cpf, c.nome, c.foto, c.status
          FROM convites v
          INNER JOIN convidados c ON v.cpf_convidado = c.cpf
          WHERE v.id_user = ?
          ORDER BY c.nome ASC;
          `,
      [socioId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}