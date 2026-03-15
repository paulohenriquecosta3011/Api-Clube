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
                    const allowedUserTypes = ['A', 'S'];
          if (!allowedUserTypes.includes(tipo_user)) {
            throw new AppError(
              "Invalid user type. Allowed: A (admin), S (standard).",
              400,
              "USER_TYPE_INVALID",
              true
            );
          }          
          const token = extractTokenFromHeader(req.headers);
          const decoded = verifyToken(token);

          if (!decoded.id_empresa) {
            throw new AppError(
              "Admin token missing company identifier.",
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

          return sendResponse(res, 201, 'User registered successfully', { user: newUser });          
      } catch (error) {
        console.error('Register controller error:', error); // Log para você investigar
        next(error); // Deixa o middleware centralizado cuidar da resposta
}
}

// Login de usuário
export async function login(req, res,next) {
    
  try {
    const { email, password, id_empresa } = req.body;

       
    const result = await loginUserService({ email, password, id_empresa });

    return sendResponse(res, 200, 'Login successful!', { token: result.token,   user: result.user});          

  } catch (error) {
    console.error("Login controller error:", error.message);

    next(error);   
  }
}

export async function generateAndSendCode (req, res, next) {
    try {
      const { email, id_empresa } = req.body;        
     
      if (!email || !id_empresa) {
        throw new AppError(
          "Email and company identifier are required.",
          400,
          "VALIDATION_REQUIRED_FIELDS",
          true
        );
      }       
    // Chama o service para atualizar o usuário

    const updatedUser = await generateAndSendCodeService({ email,id_empresa });

    return sendResponse(res, 200, 'Validation code sent successfully', { token: updatedUser.token});          

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
   
    const { code } = req.body;
    const token = extractTokenFromHeader(req.headers);

    if (!token || !code) {
      throw new AppError(
        "Token and code are required.",
        400,
        "VALIDATION_TOKEN",
        true
      );
    }

    const result = await validateCodeService({ token, code });

    return sendResponse(res, 200, 'Code validated successfully', { result });

   }catch (error){
    next(error)
   }
}


export async function setPassword(req, res, next) {
  try {
    const { password } = req.body;

    if (!password) {
      throw new AppError(
        "Password is required.",
        400,
        "VALIDATION_PASSWORD",
        true
      );
    }

    // Pega o token do header e decodifica
    const token = extractTokenFromHeader(req.headers);
    const decoded = verifyToken(token);

    const { email, id_empresa } = decoded;

    if (!id_empresa) {
      throw new AppError(
        "Company identifier not found in token.",
        403,
        "ID_EMPRESA_MISSING_IN_TOKEN",
        true
      );
    }

    // Chama o service usando apenas o password, email vem do token
    const result = await setPasswordService({ email, password, id_empresa });

    return sendResponse(res, 200, "Password set successfully", result);

  } catch (error) {
    next(error);
  }
}