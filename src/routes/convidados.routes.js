// convidados.routes.js
import { Router } from "express";
import { Register } from "../controllers/convidado.controller.js";
//import { VerificarConvidado } from "../middlewares/verificarConvidado.js";
import {  validateRequiredFields,
          checkToken,
          VerificarConvidado 
  } from "../middlewares/index.js";


import upload from "../middlewares/uploadMiddleware.js";  // Certifique-se de importar corretamente o multer

const router = Router();

// Ordem dos middlewares: primeiro o multer, depois a verificação e finalmente o registro
router.post("/registerConvidado", 
  checkToken,
  upload.single('foto'),  // Processa o form-data e o arquivo
  validateRequiredFields(["nome", "cpf"]),    
  VerificarConvidado,     // Verifica o CPF
  Register                // Registra o convidado
);

export default router;
