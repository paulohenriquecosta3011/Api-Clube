// maquinas.routes.js
import { Router } from 'express';
import { criarMaquina } from '../controllers/maquinas.controller.js';
import { checkToken, authorizeAdmin } from '../middlewares/index.js';

const router = Router();

/**
 * @swagger
 * /machines/token:
 *   post:
 *     summary: Create a new machine token
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       201:
 *         description: Machine token created successfully
 */
router.post('/token', checkToken, authorizeAdmin, criarMaquina);

export default router;