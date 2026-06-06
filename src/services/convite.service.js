// convites.service.js

import { AppError } from '../utils/AppError.js';
import {
  createConvite,
  buscarConvitesNaoBaixados,
  registrarConviteBaixado,
  buscarConvitesPorUsuario,
  buscarConvitePorToken
} from '../repositories/convite.repository.js';
import { normalizarCPF } from '../utils/cpfUtils.js';
import { validateRequiredFields } from '../middlewares/validateRequiredFields.js';
import { buscarPorCpf } from '../repositories/convidado.repository.js';
import { buscarConvitePorCpfEData } from '../repositories/convite.repository.js';
import { generateInviteToken } from '../utils/generateInviteToken.js';
import {buscarConvitePublicoPorToken} from '../repositories/convite.repository.js';


// ====================
// Service para registrar convites
// ====================
export async function registerConviteService({ cpf_convidado, id_user, dataconvite,data_final,ConvitePadrao }) {
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

    

    if (!data_final) {
      throw new AppError(
        'Final date is required',
        400,
        'DATA_FINAL_REQUIRED'
      );
    }

    if (isNaN(Date.parse(data_final))) {
      throw new AppError(
        'Invalid final date',
        400,
        'INVALID_FINAL_DATE'
      );
    }

    if (new Date(dataconvite) > new Date(data_final)) {
      throw new AppError(
        'Initial date cannot be greater than final date',
        400,
        'INVALID_DATE_RANGE'
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
    const conviteExistente =
      await buscarConvitePorCpfEData(
        cpfLimpo,
        dataconvite,
        data_final,
        ConvitePadrao
      );

    if (conviteExistente) {
      throw new AppError(
        'Already exists an invite overlapping this period.',
        409,
        'INVITE_ALREADY_EXISTS'
      );
    }

    // ====================
    // Gera token único
    // ====================

    let token;
    let tokenExiste = true;

    while (tokenExiste) {

      token = generateInviteToken(16);

      const conviteComMesmoToken = await buscarConvitePorToken(token);

      if (!conviteComMesmoToken) {
        tokenExiste = false;
      }
    }

    const conviteCriado = await createConvite({
      cpf_convidado: cpfLimpo,
      id_user,
      dataconvite,
      data_final,
      token,
      ConvitePadrao: false
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


export async function buscarConvitePublicoService(token) {

  if (!token) {

    throw new AppError(
      'Token is required',
      400,
      'TOKEN_REQUIRED'
    );

  }

  const convite =
    await buscarConvitePublicoPorToken(token);

  if (!convite) {

    throw new AppError(
      'Invite not found',
      404,
      'INVITE_NOT_FOUND'
    );

  }

  return convite;
}