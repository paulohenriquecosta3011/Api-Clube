// maquinas.routes.js
import { Router } from 'express';
import { criarMaquina } from '../controllers/maquinas.controller.js';
import { checkToken, authorizeAdmin } from '../middlewares/index.js';

const router = Router();

/**
 * @swagger
 * /machines/token:
 *   post:
 *     summary: Create a machine access token
 *     description: |
 *       Registers a new machine and generates an authentication token
 *       for gate synchronization and offline invitation downloads.
 *
 *       This endpoint is intended for:
 *       - Gate terminals
 *       - Access control stations
 *       - Reception systems
 *       - Reader-integrated devices
 *       - Offline synchronization clients
 *
 *       Only authenticated administrators can create machine tokens.
 *
 *     tags: [Machines]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Gate 01 Terminal
 *
 *               descricao:
 *                 type: string
 *                 example: Main club entrance terminal
 *
 *     responses:
 *       201:
 *         description: Machine created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Máquina criada com sucesso!
 *               data:
 *                 id_maquina: 1
 *                 nome: Gate 01 Terminal
 *                 descricao: Main club entrance terminal
 *                 token: machine_jwt_token
 *
 *       400:
 *         description: Invalid machine data
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Nome da máquina é obrigatório
 *               data: NOME_MAQUINA_OBRIGATORIO
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Token not provided
 *               data: TOKEN_NOT_PROVIDED
 *
 *       403:
 *         description: Administrator access required
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Access denied
 *               data: ACCESS_DENIED
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Failed to create machine
 *               data: CREATE_MACHINE_ERROR
 */
router.post('/token', checkToken, authorizeAdmin, criarMaquina);

export default router;