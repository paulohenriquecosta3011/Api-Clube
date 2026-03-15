// convidados.service.js
import { createConvidado, buscarPorCpf } from "../repositories/convidado.repository.js";
import { AppError } from "../utils/AppError.js";
import fs from "fs";
import path from "path";

export async function registerConvidado({ nome, cpf, foto }) {
  // Normaliza o CPF
  const cpfLimpo = cpf.replace(/\D/g, '');

  // Verifica se o CPF já existe
  const existingGuest = await buscarPorCpf(cpfLimpo);
  if (existingGuest) {
    if (foto) {
      const filePath = path.resolve("src", "uploads", foto);
      fs.unlink(filePath, (err) => {
       // if (err) console.error("Error removing file:", err);
       // else console.log("File removed due to duplicate CPF:", foto);
      });
    }
    throw new AppError(
      "Guest with this CPF already exists.",
      409,
      "GUEST_DUPLICATE",
      true
    );
  }

  try {
    const novoConvidado = await createConvidado({
      nome,
      cpf: cpfLimpo,
      foto
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