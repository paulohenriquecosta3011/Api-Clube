// maquinas.routes.js
import { Router } from 'express';
import { criarMaquina } from '../controllers/maquinas.controller.js';
import { checkToken, authorizeAdmin } from '../middlewares/index.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Maquinas
 *   description: Machine management
 */

/**
 * @swagger
 * /maquinas/novo-token:
 *   post:
 *     summary: Create a new machine token
 *     tags: [Maquinas]
 *     security:
 *       - bearerAuth: []  # checkToken required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Machine name
 *             required:
 *               - nome
 *     responses:
 *       201:
 *         description: Machine token created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.post('/novo-token', checkToken, authorizeAdmin, criarMaquina);

export default router;