// convite.routes.js
import { Router } from "express";
import { RegisterConvite, DownloadConvites, MeusConvites } from "../controllers/convite.controller.js";
import { checkToken, validarTokenMaquina } from "../middlewares/index.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Convites
 *   description: Invitation management
 */

/**
 * @swagger
 * /convites/register:
 *   post:
 *     summary: Register a new invitation (user)
 *     tags: [Convites]
 *     security:
 *       - bearerAuth: []  # checkToken required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf_convidado:
 *                 type: string
 *               dataconvite:
 *                 type: string
 *                 format: date
 *             required:
 *               - cpf_convidado
 *               - dataconvite
 *     responses:
 *       201:
 *         description: Invitation registered successfully
 *       400:
 *         description: Invalid invitation data
 *       401:
 *         description: Unauthorized
 */
router.post("/register", checkToken, RegisterConvite);

/**
 * @swagger
 * /convites/download:
 *   post:
 *     summary: Download invitations (machine)
 *     tags: [Convites]
 *     security:
 *       - bearerAuth: []  # validarTokenMaquina required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_convite:
 *                 type: integer
 *               id_maquina:
 *                 type: integer
 *             required:
 *               - id_convite
 *               - id_maquina
 *     responses:
 *       200:
 *         description: Invitation downloaded successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/download", validarTokenMaquina, DownloadConvites);

/**
 * @swagger
 * /convites/meus:
 *   get:
 *     summary: List my invitations (user)
 *     tags: [Convites]
 *     security:
 *       - bearerAuth: []  # checkToken required
 *     responses:
 *       200:
 *         description: List of user invitations
 *       401:
 *         description: Unauthorized
 */
router.get("/meus", checkToken, MeusConvites);

export default router;