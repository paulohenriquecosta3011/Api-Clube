// status.service.js
import { atualizarStatus } from '../repositories/status.repository.js';
import { AppError } from '../utils/AppError.js';

/**
 * Define o status de um registro em qualquer tabela
 * @param {string} tabela - Nome da tabela
 * @param {string} campoId - Nome do campo PK (ex: id_user)
 * @param {number} id - Valor do ID
 * @param {string} novoStatus - Novo status ('ATIVO', 'INATIVO', 'EXCLUIDO')
 */
export async function setStatus(tabela, campoId, id, novoStatus) {
  // valida se o status é válido
  const statusPermitidos = ['ATIVO','INATIVO','EXCLUIDO'];
  if (!statusPermitidos.includes(novoStatus)) {
    throw new AppError(
      `Status inválido: ${novoStatus}`,
      400,
      'INVALID_STATUS',
      true
    );
  }

  return await atualizarStatus(tabela, campoId, id, novoStatus);


}


  
export async function validarStatusAtivo(tabela, campoId, id) {
  const status = await statusRepository.verificaStatus(tabela, campoId, id);

  if (status !== 'ATIVO') {
    throw new AppError(
      `Registro com status ${status} não permitido`,
      400,
      'INVALID_STATUS'
    );
  }

  return status;
}