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
export async function loginUserService({ email, password }) {

  const user = await findUserByEmail(email);

  if (!user) {

    throw new AppError(
      "Usuário não encontrado",
      404,
      "TIPO_USUÁRIO_INVALIDO",
      true
    ); 
  }

  
  if (!user.password) {
    throw new AppError(
      "Usuário não possui senha ",
      400,
      "TIPO_PASSWORD_INVALIDO",
      true
    );


    }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError(
      "Senha inválida",
      401,
      "TIPO_PASSWORD_INVALIDO",
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
export async function generateAndSendCodeService({ email}){
  const user = await findUserByEmail(email);
  
  if (!user) {
    throw new AppError(
      "Usuário não encontrado",
      401,
      "TIPO_USER_INVALIDO",
      true
    );
  }
 

    
  // Gerar o código (aqui você pode usar qualquer lógica que quiser)
  //const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // ex: 6 dígitos
  const codigo = generateVerificationCode();

  const tokenTemporario = generateToken({ email }, "15m");  

  // Atualiza no banco
  const resultado = await createCodigoValidacao(email, codigo);

    // Envia o código por e-mail
    await sendValidationCodeEmail(email, codigo);
    
    return {
      message: "Código enviado com sucesso!",
      token: tokenTemporario,
    }; 
}


//validateCode

export async function validateCodeService({ codigo, token }) {
  const decoded = verifyToken(token);
  const email = decoded.email;

  const codigoBanco = await findCodigoByEmail(email);

  if (!codigoBanco) {
    throw new AppError(
      "Código não encontrado para este email",
      400,
      "TIPO_CODIGO_INVALIDO",
      true
    );   

  }
 
  if (String(codigo).trim() !== String(codigoBanco).trim()) {
    throw new AppError(
      "Código inválido",
      400,
      "TIPO_CODIGO_INVALIDO",
      true
    );   


    throw new AppError("Código inválido", 400);
  }

  return {
    message: "Código validado com sucesso!",
    emailConfirmado: email,
  };
}

  
export async function setPasswordService({email,password}){
  try{
    // Aqui futuramente você vai fazer o hash e o update no banco

    // Define o número de rounds do salt (quanto maior, mais seguro, mas mais lento)
    const saltRounds = 10;

    // Gera o hash da senha
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await updatePasswordRepository(email, hashedPassword);    

    return {
       message: "Senha recebida no service com sucesso!",
       emailRecebido: email,
       hashedPassword
    };

  }catch(error){ 
    throw new AppError(
    "Erro ao definir a senha.",
    500,
    "SET_PASSWORD_ERROR",
    true
  );
  }
}