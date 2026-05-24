//convidado.repository.js
import pool from '../db/db.js';
import { AppError } from "../utils/AppError.js";

export async function createConvidado({ nome, cpf, foto, telefone }) {

  try {

    const [result] = await pool.execute(
      "INSERT INTO convidados (nome, cpf, foto,telefone) VALUES (?, ?, ?, ?)",
      [nome, cpf, foto || null, telefone ||null ]
    );

    return {
      id: result.insertId,
      nome,
      cpf,
      foto: foto || null,
      telefone: telefone || null
    };

  } catch (error) {

   // console.error('Database error while creating guest:', error);
    throw error;

  }
}

export async function buscarPorCpf(cpf) {

  try {

    const [rows] = await pool.execute(
      "SELECT cpf, nome, telefone, foto FROM convidados WHERE cpf = ?",
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
      `SELECT DISTINCT c.cpf, c.nome, c.foto, c.status, c.telefone
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