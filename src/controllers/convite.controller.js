import { sendResponse } from '../utils/responseHandler.js';
import { registerConviteService, downloadConvitesService, buscarConvitesPorUsuarioService } from '../services/convite.service.js';
import { AppError } from '../utils/AppError.js';

// ====================
// Controller de registro de convites
// ====================
export async function RegisterConvite(req, res) {
  try {
    const { cpf_convidado, dataconvite } = req.body;
    const { id: id_user } = req.user; // vem do token

    const convite = await registerConviteService({
      cpf_convidado,
      id_user,
      dataconvite
    });

    return sendResponse(res, 201, 'Invite registered successfully', convite);

  } catch (error) {
    return sendResponse(
      res,
      error.statusCode || 500,
      error.message || 'Erro ao cadastrar convite',
      error.code || 'REGISTER_CONVITE_ERROR'
    );
  }
}

// ====================
// Controller de download de convites por máquina
// ====================
export async function DownloadConvites(req, res) {
  try {
    const { id_user, data } = req.body; 
    const { id_maquina } = req.maquina; // middleware já valida token da máquina

    if (!data) throw new AppError("O parâmetro 'data' é obrigatório.", 400, "DATA_OBRIGATORIA");

    const convites = await downloadConvitesService({
      id_maquina,
      id_user: id_user ? Number(id_user) : undefined,
      data
    });

    const message = convites.length > 0 
      ? 'Convites baixados com sucesso!'
      : 'Não existem convites para baixar.';

    return sendResponse(res, 200, message, convites);

  } catch (error) {
    return sendResponse(
      res,
      error.statusCode || 500,
      error.message || 'Erro ao baixar convites',
      error.code || 'DOWNLOAD_CONVITES_ERROR'
    );
  }
}

// ====================
// Controller de listagem de convites do usuário
// ====================
export async function MeusConvites(req, res) {

  try {
    const { id: id_user } = req.user; // do token
    const { data } = req.query;       // data inicial opcional (yyyy-mm-dd)
    
    
    // valida data opcional
    if (data && isNaN(Date.parse(data))) {
      throw new AppError('Data inicial inválida', 400, 'DATA_INVALIDA');
    }

    const convites = await buscarConvitesPorUsuarioService({
      id_user,
      data_inicial: data
    });

    const message = convites.length > 0 
      ? 'Seus convites'
      : 'Você ainda não fez nenhum convite a partir dessa data';

    return sendResponse(res, 200, message, convites);

  } catch (error) {
    return sendResponse(
      res,
      error.statusCode || 500,
      error.message || 'Erro ao buscar convites',
      error.code || 'FETCH_MEUS_CONVITES_ERROR'
    );
  }
}
