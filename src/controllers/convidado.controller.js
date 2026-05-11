//convidado.controller.js
import { registerConvidado } from "../services/convidados.service.js";
import { normalizarCPF, validarCPF } from '../utils/cpfUtils.js';
import { AppError } from "../utils/AppError.js";
import { listarConvidadosDoUsuarioService } from "../services/convidados.service.js";

import { sendResponse } from '../utils/responseHandler.js';

export async function Register(req, res, next) {
    try {
        const {nome, cpf} = req.body     
        const cpfLimpo = normalizarCPF(cpf);
    
        if (!validarCPF(cpfLimpo)) {

            throw new AppError(
              "Invalid CPF",
              400,
              "INVALID_CPF",
              true
            );
        }
        const foto = req.file ? req.file.filename : null;


        if (!foto) {
          throw new AppError(
            "image is required",
            400,
            "image is required"
          );
        }



        const novoConvidado =  await registerConvidado({nome, cpf: cpfLimpo, foto});

          return sendResponse(res, 201, 'Guest successfully registered', { convidado: novoConvidado });          

      } catch (error){
     //   console.error('Erro no register controller:', error); // Log para você investigar
        next(error); // Deixa o middleware centralizado cuidar da resposta    
      }
}


export async function ListarMeusConvidados(req, res, next) {
  try {
    const id_user = req.user.id; // vem do token
    const convidados = await listarConvidadosDoUsuarioService(id_user);

    return sendResponse(res, 200, "Convidados do usuário", { convidados });
  } catch (error) {
    next(error);
  }
}