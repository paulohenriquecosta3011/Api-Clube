import { AppError } from "../../utils/AppError.js";

export function validarStatusAtivo(status, entidade = "Registro") {
  if (!status) {
    throw new AppError(
      `${entidade} sem status definido`,
      500,
      "STATUS_MISSING",
      true
    );
  }

  if (status !== "ATIVO") {
    throw new AppError(
      `Status do ${entidade} não está ativo`,
      400,
      "STATUS_INVALIDO",
      true
    );
  }
}