// middlewares/verifyConvidadoExiste.js
import { buscarPorCpf } from '../repositories/convidado.repository.js';
import { normalizarCPF } from '../utils/cpfUtils.js';
import { AppError } from '../utils/AppError.js';

export async function VerificarConvidado(req, res, next) {
  try {
    const { cpf } = req.body;

    if (!cpf) {
      throw new AppError('CPF é obrigatório.', 400, 'CPF_REQUIRED');
    }

    const cpfLimpo = normalizarCPF(cpf);
    const convidado = await buscarPorCpf(cpfLimpo);

    if (convidado) {
      throw new AppError('Convidado já cadastrado.', 409, 'CONVIDADO_EXISTENTE');
    }

    next();
  } catch (error) {
    next(error); // Delega para o errorHandler
  }
}
