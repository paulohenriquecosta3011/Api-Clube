// convidados.routes.js
import { Router } from "express";
import { Register } from "../controllers/convidado.controller.js";
import { validateRequiredFields, checkToken } from "../middlewares/index.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new guest
 *     tags: [Guests]
 *     security:
 *       - bearerAuth: []  # checkToken required
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *             required:
 *               - nome
 *               - cpf
 *               - foto
 *     responses:
 *       201:
 *         description: Guest registered successfully
 *       400:
 *         description: Invalid guest data
 *       401:
 *         description: Unauthorized
 */
router.post("/", 
  checkToken,
  upload.single('foto'),
  validateRequiredFields(["nome", "cpf"]),
  Register
);

export default router;