// convites.service.js

import { AppError } from '../utils/AppError.js';
import {
  createConvite,
  buscarConvitesNaoBaixados,
  registrarConviteBaixado,
  buscarConvitesPorUsuario
} from '../repositories/convite.repository.js';
import { normalizarCPF } from '../utils/cpfUtils.js';
import { validateRequiredFields } from '../middlewares/validateRequiredFields.js';
import { buscarPorCpf } from '../repositories/convidado.repository.js';
import { buscarConvitePorCpfEData } from '../repositories/convite.repository.js';

// ====================
// Service para registrar convites
// ====================
export async function registerConviteService({ cpf_convidado, id_user, dataconvite }) {

  // Required fields (API standard)
  validateRequiredFields(
    { cpf_convidado, dataconvite },
    ['cpf_convidado', 'dataconvite']
  );
 
  // Safety check (should always exist from token)
  if (!id_user) {
    throw new AppError(
      'User ID is required',
      400,
      'ID_USER_REQUIRED'
    );
  }

  // Date validation
  if (isNaN(Date.parse(dataconvite))) {
    throw new AppError(
      'Invalid invite date',
      400,
      'INVALID_INVITE_DATE'
    );
  }

  const cpfLimpo = normalizarCPF(cpf_convidado);

  
  // Verifica se o convidado existe
  const convidado = await buscarPorCpf(cpfLimpo);
  if (!convidado) {
    throw new AppError(
      'Guest not found.',
      404,
      'GUEST_NOT_FOUND'
    );
  }

// Verifica se já existe convite para o mesmo CPF na mesma data
const conviteExistente = await buscarConvitePorCpfEData(cpfLimpo, dataconvite);
if (conviteExistente) {
  throw new AppError(
    'An invite for this CPF and date already exists.',
    409,
    'INVITE_ALREADY_EXISTS'
  );
}
  const conviteCriado = await createConvite({
    cpf_convidado: cpfLimpo,
    id_user,
    dataconvite
  });

  return conviteCriado;
}


// ====================
// Service para download de convites por máquina
// ====================
export async function downloadConvitesService({ id_maquina, id_user, data }) {
  if (!data) {
    throw new AppError(
      'The parameter "data" is required',
      400,
      'DATA_REQUIRED'
    );
  }

  const convites = await buscarConvitesNaoBaixados({
    id_maquina,
    id_user,
    data
  });

  for (const convite of convites) {
    await registrarConviteBaixado({
      id_maquina,
      id_convite: convite.id_convite
    });
  }

  return convites;
}


// ====================
// Service para buscar convites do usuário
// ====================
export async function buscarConvitesPorUsuarioService({ id_user, data_inicial }) {
  if (!id_user) {
    throw new AppError(
      'User ID is required',
      400,
      'ID_USER_REQUIRED'
    );
  }

  return await buscarConvitesPorUsuario({
    id_user,
    data_inicial
  });
}