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
 * /invitations:
 *   post:
 *     summary: Register a new invitation (user)
 *     tags: [Invitations]
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
router.post("/", checkToken, RegisterConvite);

/**
 * @swagger
 * /download:
 *   post:
 *     summary: Download invitations (machine)
 *     tags: [Invitations]
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
 * /mine:
 *   get:
 *     summary: List my invitations (user)
 *     tags: [Invitations]
 *     security:
 *       - bearerAuth: []  # checkToken required
 *     responses:
 *       200:
 *         description: List of user invitations
 *       401:
 *         description: Unauthorized
 */
router.get("/mine", checkToken, MeusConvites);

export default router;