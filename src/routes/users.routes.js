//users.routes.js

import { Router } from "express";
import { register, login, generateAndSendCode, validateCode, setPassword  } from "../controllers/users.controller.js"; // importa o controller!
import { VerificarEmailExistente, 
         checkToken,
         authorizeAdmin,
         validateRequiredFields,
         validateEmail,
         validatePassword
       } from "../middlewares/index.js";

       import loginRateLimiter from '../middlewares/loginRateLimiter.js';
                                        
const router = Router();

// Agora a rota chama a função register
router.post(
    "/register",
    checkToken,            // Verifica se o token existe e é válido
    validateRequiredFields(["name", "email", "id_base","tipo_user"]),
    validateEmail("email"),
    authorizeAdmin,        // Verifica se o usuário é administrador
    VerificarEmailExistente, // Verifica duplicidade do email
    register               // Executa o controller para registrar usuário
  );

  
router.post("/login",  
  validateRequiredFields(["email", "password"]), 
  validateEmail("email"),   
  validatePassword("password"), 
  loginRateLimiter,  
  login);
router.post("/generate-code", generateAndSendCode);  
router.post("/validate-code", validateCode);

router.post("/setPassword", setPassword);



export default router;
