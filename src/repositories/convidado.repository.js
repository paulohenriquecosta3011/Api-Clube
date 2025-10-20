//convidado.repository.js
import pool from '../db/db.js';
import { AppError } from "../utils/AppError.js";


export async function createConvidado({ nome, cpf,foto }) {

    try{
      const [result] = await pool.execute(
        "INSERT INTO convidados (nome, cpf,foto) VALUES (?, ?, ?)",
        [nome, cpf, foto || null]
      );

      return {
        id: result.insertId,
        nome,
        cpf,
        foto: foto || null
       };
    }catch(error){
        console.error('Erro ao criar convidado no banco:', error);
        throw error; // Propaga o erro para o controller tratar

        throw new AppError(
          "CPF inválido.",
          400,
          "INVALID_CPF",
          true
        );


    }
}

export async function buscarPorCpf(cpf) {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM convidados WHERE cpf = ?",
      [cpf]
    );

    return rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar convidado por CPF:', error);
    throw error;
  }
}