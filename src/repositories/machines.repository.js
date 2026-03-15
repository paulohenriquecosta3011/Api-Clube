// machines.repository.js
import pool from '../db/db.js';
import { AppError } from '../utils/AppError.js';

// Criar nova máquina
export async function createMachine({ nome, descricao, token_maquina, id_empresa }) {
  try {
    const [result] = await pool.execute(
      `INSERT INTO maquinas (nome, token_maquina, descricao, id_empresa) 
       VALUES (?, ?, ?, ?)`,
      [nome, token_maquina, descricao || null, id_empresa]
    );

    return {
      id_maquina: result.insertId,
      nome,
      descricao: descricao || null,
      token_maquina,
      id_empresa
    };
  } catch (error) {
    console.error('Erro no DB ao criar máquina:', error);
    throw new AppError(
      'Erro ao criar máquina.',
      500,
      'CREATE_MACHINE_FAILED',
      true
    );
  }
}

// Buscar máquina por ID
export async function getMachineById(id_maquina, id_empresa) {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM maquinas 
       WHERE id_maquina = ? AND id_empresa = ?`,
      [id_maquina, id_empresa]
    );
    return rows[0]; // retorna undefined se não existir
  } catch (error) {
    console.error('Erro no DB ao buscar máquina:', error);
    throw new AppError(
      'Erro ao buscar máquina por ID.',
      500,
      'GET_MACHINE_BY_ID_FAILED',
      true
    );
  }
}

// Listar todas as máquinas de uma empresa
export async function getAllMachines(id_empresa) {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM maquinas WHERE id_empresa = ?`,
      [id_empresa]
    );
    return rows;
  } catch (error) {
    console.error('Erro no DB ao listar máquinas:', error);
    throw new AppError(
      'Erro ao listar máquinas.',
      500,
      'GET_ALL_MACHINES_FAILED',
      true
    );
  }
}

// Atualizar máquina
export async function updateMachine(id_maquina, { nome, descricao, status }, id_empresa) {
  try {
    const [result] = await pool.execute(
      `UPDATE maquinas 
       SET nome = ?, descricao = ?, status = ? 
       WHERE id_maquina = ? AND id_empresa = ?`,
      [nome, descricao, status, id_maquina, id_empresa]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Erro no DB ao atualizar máquina:', error);
    throw new AppError(
      'Erro ao atualizar máquina.',
      500,
      'UPDATE_MACHINE_FAILED',
      true
    );
  }
}

// Soft delete (mudar status para INATIVO)
export async function deleteMachine(id_maquina, id_empresa) {
  try {
    const [result] = await pool.execute(
      `UPDATE maquinas SET status = 'INATIVO' 
       WHERE id_maquina = ? AND id_empresa = ?`,
      [id_maquina, id_empresa]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Erro no DB ao deletar máquina:', error);
    throw new AppError(
      'Erro ao deletar máquina.',
      500,
      'DELETE_MACHINE_FAILED',
      true
    );
  }
}
