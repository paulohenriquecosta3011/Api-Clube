// machines.service.js
import { randomUUID } from 'crypto';
import { 
  createMachine, 
  getMachineById, 
  getAllMachines, 
  updateMachine, 
  deleteMachine 
} from '../repositories/machines.repository.js';
import { AppError } from '../utils/AppError.js';
import { validarStatusAtivo } from './validators/status.validator.js';

// Criar máquina
export async function createMachineService({ nome, descricao, id_empresa }) {
  if (!nome) {
    throw new AppError('Nome da máquina é obrigatório', 400, 'NOME_MAQUINA_OBRIGATORIO');
  }

  const token_maquina = randomUUID(); // gera token fixo

  const machine = await createMachine({ nome, descricao, token_maquina, id_empresa });
  return machine;
}

// Buscar máquina por ID
export async function getMachineByIdService(id_maquina, id_empresa) {
  const machine = await getMachineById(id_maquina, id_empresa);

  if (!machine) {
    throw new AppError('Máquina não encontrada', 404, 'MACHINE_NOT_FOUND');
  }

  validarStatusAtivo(machine.status, 'Máquina');

  return machine;
}

// Listar todas as máquinas
export async function listMachinesService(id_empresa) {
  const machines = await getAllMachines(id_empresa);
  return machines;
}

// Atualizar máquina
export async function updateMachineService(id_maquina, { nome, descricao, status }, id_empresa) {
  const machine = await getMachineById(id_maquina, id_empresa);

  if (!machine) {
    throw new AppError('Máquina não encontrada', 404, 'MACHINE_NOT_FOUND');
  }

  // Se for tentar alterar status, pode validar aqui
  if (status && !['ATIVO', 'INATIVO', 'REVOGADO'].includes(status)) {
    throw new AppError('Status inválido', 400, 'INVALID_STATUS');
  }

  const updated = await updateMachine(id_maquina, { nome, descricao, status }, id_empresa);
  if (!updated) {
    throw new AppError('Não foi possível atualizar a máquina', 500, 'UPDATE_MACHINE_FAILED');
  }

  return { message: 'Máquina atualizada com sucesso!' };
}

// Soft delete
export async function deleteMachineService(id_maquina, id_empresa) {
  const machine = await getMachineById(id_maquina, id_empresa);

  if (!machine) {
    throw new AppError('Máquina não encontrada', 404, 'MACHINE_NOT_FOUND');
  }

  const deleted = await deleteMachine(id_maquina, id_empresa);

  if (!deleted) {
    throw new AppError('Não foi possível deletar a máquina', 500, 'DELETE_MACHINE_FAILED');
  }

  return { message: 'Máquina inativada com sucesso!' };
}
