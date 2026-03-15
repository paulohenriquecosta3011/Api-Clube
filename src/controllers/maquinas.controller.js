// maquinas.controller.js
import { createMachineService } from '../services/machines.service.js';
import { sendResponse } from '../utils/responseHandler.js';
import { AppError } from '../utils/AppError.js';

export async function criarMaquina(req, res, next) {
  try {
    const { nome, descricao } = req.body;
    const id_empresa = req.user.id_empresa; // do checkToken

    if (!nome) {
      throw new AppError('Nome da máquina é obrigatório', 400, 'NOME_MAQUINA_OBRIGATORIO');
    }

    const machine = await createMachineService({ nome, descricao, id_empresa });

    return sendResponse(res, 201, 'Máquina criada com sucesso!', machine);
  } catch (error) {
    console.error('Erro ao criar máquina:', error);
    next(error);
  }
}
