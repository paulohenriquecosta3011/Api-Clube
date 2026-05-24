// convidados.service.js
import { createConvidado, buscarPorCpf } from "../repositories/convidado.repository.js";
import { listarConvidadosDoSocio } from "../repositories/convidado.repository.js";
import { AppError } from "../utils/AppError.js";
import fs from "fs";
import path from "path";
import { registerConviteService } from "./convite.service.js";

export async function registerConvidado({ nome, cpf, foto, telefone, id_user }) {
  // Normaliza o CPF
  const cpfLimpo = cpf.replace(/\D/g, '');

  // Verifica se o CPF já existe
  const existingGuest = await buscarPorCpf(cpfLimpo);
  if (!existingGuest && !foto) {
      throw new AppError(
        "image is required",
        400,
        "image is required"
      );
  }
  if (existingGuest) {

    // remove foto enviada desnecessariamente
    if (foto) {
      const filePath = path.resolve("src", "uploads", foto);

      fs.unlink(filePath, () => {});
    }

    // cria convite padrão para o sócio atual
    await registerConviteService({
      cpf_convidado: cpfLimpo,
      id_user,
      dataconvite: new Date().toISOString().split('T')[0],
      ConvitePadrao: true
    });

    return existingGuest;
  }

  try {
    const novoConvidado = await createConvidado({
      nome,
      cpf: cpfLimpo,
      foto,
      telefone
    });
    // cria convite padrão automaticamente
    await registerConviteService({
      cpf_convidado: cpfLimpo,
      id_user,
      dataconvite: new Date().toISOString().split('T')[0],
      ConvitePadrao: true
    });


    return novoConvidado;

  } catch (error) {
    console.error("Database error while registering guest:", error);

    throw new AppError(
      "Failed to register guest.",
      500,
      "REGISTER_GUEST_ERROR",
      true
    );
  }
}

export async function listarConvidadosDoUsuarioService(id_user) {
  if (!id_user) {
    throw new AppError(
      "User ID is required",
      400,
      "ID_USER_REQUIRED"
    );
  }

  try {
    const convidados = await listarConvidadosDoSocio(id_user);
    return convidados;
  } catch (error) {
    console.error("Erro ao buscar convidados do usuário:", error);
    throw new AppError(
      "Failed to fetch user's guests.",
      500,
      "FETCH_USER_GUESTS_ERROR",
      true
    );
  }
}


export async function buscarConvidadoPorCpfService(cpf) {
  const convidado = await buscarPorCpf(cpf);

  return convidado;
}