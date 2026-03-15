//status.repository.js
import pool from '../db/db.js';
import { AppError } from '../utils/AppError.js';

/**
 * Atualiza o status de um registro em qualquer tabela
 * @param {string} tabela - Nome da tabela
 * @param {string} campoId - Nome do campo PK (ex: id_user)
 * @param {number} id - Valor do ID
 * @param {string} novoStatus - Novo status (ex: 'ATIVO', 'INATIVO', 'EXCLUIDO')
 */
export async function atualizarStatus(tabela, campoId, id, novoStatus) {
  try {
    const sql = `UPDATE ${tabela} SET status = ? WHERE ${campoId} = ?`;
    await pool.execute(sql, [novoStatus, id]);
    return { tabela, id, novoStatus };
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw new AppError(
      'Não foi possível atualizar o status.',
      500,
      'UPDATE_STATUS_ERROR',
      true
    );
  }
}

export async function verificaStatus(tabela, campoId, id) {
  try{

    const sql = `SELECT status FROM ${tabela} WHERE ${campoId} = ?`;
    const [rows] = await pool.execute(sql, [id]);
    if (rows.length === 0) {
      throw new AppError(
        'Registro não encontrado.',
        404,
        'STATUS_NOT_FOUND',
        true
      );
    }


    const status = rows[0].status;
    //o return manda para o service o valor da coluna status,
    //  e somente la e feita a regra de negocios, respeitando a arquitetura

    return {  status };

  } catch (error){
    console.error('Erro ao verificar status:', error);
    throw new AppError(
      'Não foi possível verificar o status.',
      500,
      'SELECT_STATUS_ERROR',
      true
    );
  }
}


