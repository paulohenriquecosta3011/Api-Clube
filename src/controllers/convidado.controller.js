//convidado.controller.js
import { registerConvidado } from "../services/convidados.service.js";
import { normalizarCPF, validarCPF } from '../utils/cpfUtils.js';
import { AppError } from "../utils/AppError.js";
import { sendResponse } from '../utils/responseHandler.js';

export async function Register(req, res, next) {
    try {
        const {nome, cpf} = req.body     
        const cpfLimpo = normalizarCPF(cpf);
    
        if (!validarCPF(cpfLimpo)) {

            throw new AppError(
              "CPF inválido.",
              400,
              "INVALID_CPF",
              true
            );
        }
        const foto = req.file ? req.file.filename : null;


        if (!foto) {
          throw new AppError(
            "Foto é obrigatória.",
            400,
            "FOTO_OBRIGATORIA"
          );
        }



        const novoConvidado =  await registerConvidado({nome, cpf: cpfLimpo, foto});

          return sendResponse(res, 201, 'Convidado Cadastrado com sucesso!', { convidado: novoConvidado });          

      } catch (error){
        console.error('Erro no register controller:', error); // Log para você investigar
        next(error); // Deixa o middleware centralizado cuidar da resposta    
      }
}