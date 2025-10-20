//users.controller.js
import { registerUserService,
         loginUserService,
         generateAndSendCodeService,
         validateCodeService,
         setPasswordService
        } from "../services/users.service.js"; // importa o service

import { AppError } from "../utils/AppError.js";
import { extractTokenFromHeader } from "../utils/extractTokenFromHeader.js";
import { verifyToken } from '../utils/verifyToken.js';
//import generateVerificationCode from '../utils/generateVerificationCode.js';
import { sendResponse } from '../utils/responseHandler.js';

// Cadastro de usuário
export async function register(req, res,next) {

    try {
          const { name, email, id_base,tipo_user = 'S' } = req.body;
          const tiposPermitidos = ['A', 'S'];
          if (!tiposPermitidos.includes(tipo_user)) {
            throw new AppError(
              "Tipo de usuário inválido. Permitidos: A (admin), S (simples).",
              400,
              "TIPO_USER_INVALIDO",
              true
            );
          }          

          const token = extractTokenFromHeader(req.headers);
          const decoded = verifyToken(token);

          if (!decoded.id_empresa) {
            throw new AppError(
              "Admin user must have an id_empresa to register other users.",
              403,
              "ID_EMPRESA_MISSING_IN_TOKEN",
              true
            );
          }          

          // Agora chama o service
          const newUser = await registerUserService({ 
               name,
               email,
               id_base,
               tipo_user,
               id_empresa: decoded.id_empresa 
          });

          return sendResponse(res, 201, 'Usuário registrado com sucesso!', { user: newUser });          
      } catch (error) {
        console.error('Erro no register controller:', error); // Log para você investigar
        next(error); // Deixa o middleware centralizado cuidar da resposta
}
}

// Login de usuário
export async function login(req, res,next) {
    
  try {
    const { email, password } = req.body;

       
    const result = await loginUserService({ email, password });

    return sendResponse(res, 200, 'Login successful!', { token: result.token,   user: result.user});          


//    res.status(200).json({
  //    message: "Login successful!",
    //  token: result.token,
    //  user: result.user,
  //  });

  } catch (error) {
    console.error("Error in login controller teste:", error.message);

    next(error);   
  }
}

export async function generateAndSendCode (req, res, next) {
    try {
      const { email } = req.body;        
      if (!email) {
        throw new AppError(
          "Email is required.",
          400,
          "USER_UPDATE_VALIDATION",
          true
        );

      }
    // Chama o service para atualizar o usuário
    const updatedUser = await generateAndSendCodeService({ email });

    return sendResponse(res, 200, 'Código enviado com sucesso!!', { token: updatedUser.token});          


    //res.status(200).json({
    //  message: "Código enviado com sucesso!",
    //  token: updatedUser.token // <--- isso aqui vem do service
   // });

    }catch (error) {
      next(error);   
    }
}

export async function validateCode (req, res, next){
   try{
    const { codigo } = req.body;

    const token = extractTokenFromHeader(req.headers);

    if (!token || !codigo) {
      throw new AppError(
        "Token and code are required.",
        400,
        "VALIDATION_TOKEN",
        true
      );
    }

    const result = await validateCodeService({ token, codigo });

    return sendResponse(res, 200, 'Código Validado!!', { result});          

    //res.status(200).json(result);

   }catch (error){
    next(error)
   }
}


export async function setPassword(req,res,next){

  try {
      const { password } = req.body;

      if (!password ) {
        throw new AppError(
          "password is required.",
          400,
          "VALIDATION_PASSWORD",
          true
        );
      }
  
      const token = extractTokenFromHeader(req.headers);
      const decoded = verifyToken(token);
      const email = decoded.email; 
         
      const result = await setPasswordService({email,password})
      res.status(200).json(result);

  }catch(error){
    next(error)
  }

}