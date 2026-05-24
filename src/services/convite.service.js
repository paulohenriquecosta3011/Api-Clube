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
export async function registerConviteService({ cpf_convidado, id_user, dataconvite,ConvitePadrao }) {
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
    const conviteExistente = await buscarConvitePorCpfEData(cpfLimpo, dataconvite, ConvitePadrao);
    if (conviteExistente) {
      throw new AppError(
        'An invite for this CPF and date already exists.',
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

// ====================
// Service para gerar convites em lote
// ====================

export async function registerConvitesEmLoteService({

  cpf_convidado,
  id_user,
  data_inicial,
  data_final

}) {

  // validações básicas

  if (!data_inicial || !data_final) {

    throw new AppError(
      'Initial and final dates are required',
      400,
      'DATES_REQUIRED'
    );

  }

  const [anoInicial, mesInicial, diaInicial] =
  data_inicial.split('-');

  const inicio =
    new Date(
      Number(anoInicial),
      Number(mesInicial) - 1,
      Number(diaInicial)
    );

  const [anoFinal, mesFinal, diaFinal] =
    data_final.split('-');

  const fim =
    new Date(
      Number(anoFinal),
      Number(mesFinal) - 1,
      Number(diaFinal)
  );

  // valida range

  if (inicio > fim) {

    throw new AppError(
      'Initial date cannot be greater than final date',
      400,
      'INVALID_DATE_RANGE'
    );

  }

  const convitesCriados = [];

  const dataAtual =
    new Date(inicio);

  // loop das datas

  while (dataAtual <= fim) {

    const ano =
    dataAtual.getFullYear();
  
  const mes =
    String(
      dataAtual.getMonth() + 1
    ).padStart(2, '0');
  
  const dia =
    String(
      dataAtual.getDate()
    ).padStart(2, '0');
  
  const dataFormatada =
    `${ano}-${mes}-${dia}`;

    try {

      // reutiliza service atual
      console.log('DATA FORMATADA:', dataFormatada);
      const convite =
        await registerConviteService({

          cpf_convidado,
          id_user,
          dataconvite:
            dataFormatada

        });

      convitesCriados.push(convite);

    } catch (error) {

      // ignora duplicados

      if (
        error.code !==
        'INVITE_ALREADY_EXISTS'
      ) {

        throw error;

      }

    }

    // próximo dia

    dataAtual.setDate(
      dataAtual.getDate() + 1
    );

  }

  return convitesCriados;

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