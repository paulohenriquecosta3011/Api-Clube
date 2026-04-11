//users.service.js
import { createUser, 
         findUserByEmail,
         createCodigoValidacao,
         findCodigoByEmail,
         updatePasswordRepository 
        } from "../repositories/users.repository.js"; // importa o repository
import bcrypt from "bcrypt";

import { AppError } from "../utils/AppError.js"; // importe sua classe de erro customizada
import { sendValidationCodeEmail } from '../utils/sendEmail.js';
import { generateToken } from "../utils/generateToken.js";
import { verifyToken } from "../utils/verifyToken.js"; // certifique-se que o path está correto
import generateVerificationCode from '../utils/generateVerificationCode.js';


//cadastro
export async function registerUserService({ name, email, id_base, tipo_user,id_empresa }) {
     // Cria o usuário sem a senha 
    const newUser = await createUser({ name, email, id_base, tipo_user, id_empresa});
    return newUser;

}

//Login
export async function loginUserService({ email, password, id_empresa }) {

  const user = await findUserByEmail(email, id_empresa);

  console.log("EMAIL service:", email);
  console.log("ID_EMPRESA:", id_empresa);
  console.log("TYPE:", typeof id_empresa);

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND", true);
  }

  if (user.status !== "ATIVO") {
    throw new AppError("User is not active", 403, "USER_INACTIVE", true);
  }

  if (!user.password) {
    throw new AppError(
      "User has no password set",
      400,
      "PASSWORD_NOT_SET",
      true
    );


    }

    
 
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError(
      "Invalid password",
      401,
      "INVALID_PASSWORD",
      true
    );


  }
  
  const token = generateToken({ 
    id: user.id_user, 
    email: user.email, 
    tipo_user: user.tipo_user ,
    id_empresa: user.id_empresa
  }, "1h");

  return { token, user: {
     id: user.id_user,
     name: user.name,
     email: user.email, 
     tipo_user: user.tipo_user,
     id_empresa: user.id_empresa
     } };
}  


//update no user
export async function generateAndSendCodeService({email, id_empresa }){
  const user = await findUserByEmail(email, id_empresa);
  
  if (!user) {
    throw new AppError(
      "User not found",
      404,
      "USER_NOT_FOUND",
      true
    );
  }
 

    
  // Gerar o código (aqui você pode usar qualquer lógica que quiser)
  //const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // ex: 6 dígitos
  const codigo = generateVerificationCode();

  const tokenTemporario = generateToken({ email , id_empresa }, "15m");  

  // Atualiza no banco
  const resultado = await createCodigoValidacao(email, codigo, id_empresa);

    // Envia o código por e-mail
    await sendValidationCodeEmail(email, codigo);
    
    return {
      message: "Verification code sent successfully!",
      token: tokenTemporario,
    }; 
}


//validateCode


export async function validateCodeService({ code, token }) {  
  const decoded = verifyToken(token);
  const email = decoded.email;

  const codigoBanco = await findCodigoByEmail(email,decoded.id_empresa);

  if (!codigoBanco) {
    throw new AppError(
      "Verification code not found for this email",
      400,
      "VERIFICATION_CODE_NOT_FOUND",
      true
    );   

  }
 
  if (String(code).trim() !== String(codigoBanco).trim()) {
    throw new AppError(
      "Invalid verification code",
      400,
      "INVALID_VERIFICATION_CODE",
      true
    );   


  }

  return {
    message: "Verification code validated successfully",
    emailConfirmed: email,
  };
}

  
export async function setPasswordService({email,password,id_empresa}){
    // Define o número de rounds do salt (quanto maior, mais seguro, mas mais lento)
    const saltRounds = 10;

    // Gera o hash da senha
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await updatePasswordRepository(email, hashedPassword, id_empresa);

    return {
       message: "Password received successfully in service",
       emailReceived: email
    };

}

