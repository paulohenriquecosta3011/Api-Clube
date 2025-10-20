// convidados.service.js
import { createConvidado } from "../repositories/convidado.repository.js";
import { AppError } from "../utils/AppError.js";

export async function registerConvidado({ nome, cpf,foto }) {
  try {
    const novoConvidado = await createConvidado({ nome, cpf,foto });
    return novoConvidado;
  } catch (error) {
    // Se for um erro conhecido do MySQL (duplicidade de chave primária)
    if (error.code === "ER_DUP_ENTRY") {
      throw new AppError(
        "Convidado já cadastrado com este CPF.",
        400,
        "ConvidadoDuplicado",
        true
      );
    }

    // Qualquer outro erro inesperado
    throw new AppError(
      "Erro ao registrar convidado.",
      500,
      "RegisterConvidado_ERROR",
      true
    );
  }
}
