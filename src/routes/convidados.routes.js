// convidados.routes.js
import { Router } from "express";
import { Register, ListarMeusConvidados,BuscarConvidadoPorCpf } from "../controllers/convidado.controller.js";
import { validateRequiredFields, checkToken } from "../middlewares/index.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = Router();


/**
 * @swagger
 * /guests:
 *   post:
 *     summary: Register a new guest
 *     description: |
 *       Registers a new guest associated with the authenticated user.
 *
 *       Guest registration supports profile image upload and is commonly used
 *       for invitation and access control workflows.
 *
 *       Typical usage:
 *       - Guest onboarding
 *       - Visitor registration
 *       - Invitation management
 *       - Access authorization
 *
 *     tags: [Guests]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Ana Carolina
 *
 *               cpf:
 *                 type: string
 *                 example: 08200381641
 *
 *               telefone:
 *                 type: string
 *                 example: 31991234493
 *
 *               foto:
 *                 type: string
 *                 format: binary
 *
 *             required:
 *               - nome
 *               - cpf
 *               - foto
 *
 *     responses:
 *       201:
 *         description: Guest registered successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Guest successfully registered
 *               data:
 *                 convidado:
 *                   id: 0
 *                   nome: Ana Carolina
 *                   cpf: 08200381641
 *                   foto: 1778944083305.jpg
 *                   telefone: 31991234493
 *
 *       400:
 *         description: Invalid guest data
 *         content:
 *           application/json:
 *             examples:
 *               invalidCpf:
 *                 value:
 *                   status: fail
 *                   message: Invalid CPF
 *                   data: INVALID_CPF
 *
 *               imageRequired:
 *                 value:
 *                   status: fail
 *                   message: image is required
 *                   data: image is required
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
 *       409:
 *         description: Guest already exists
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Guest with this CPF already exists.
 *               data: GUEST_DUPLICATE
 */
router.post("/", 
  checkToken,
  upload.single('foto'),
  validateRequiredFields(["nome", "cpf"]),
  Register
);

/**
 * @swagger
 * /guests/mine:
 *   get:
 *     summary: Retrieve authenticated user's guests
 *     description: |
 *       Returns all guests associated with the authenticated user.
 *
 *       This endpoint is commonly used in:
 *       - Invitation management
 *       - Guest selection workflows
 *       - Access management systems
 *       - Mobile applications
 *
 *     tags: [Guests]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Guest list retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Convidados do usuário
 *               data:
 *                 convidados:
 *                   - id: 1
 *                     nome: Ana Carolina
 *                     cpf: 08200381641
 *                     foto: 1778944083305.jpg
 *                     telefone: 31991234493
 *
 *                   - id: 2
 *                     nome: John Visitor
 *                     cpf: 12345678900
 *                     foto: 1778944083310.jpg
 *                     telefone: 31999887766
 *
 *       400:
 *         description: User ID validation error
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: User ID is required
 *               data: ID_USER_REQUIRED
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Failed to fetch user's guests.
 *               data: FETCH_USER_GUESTS_ERROR
 */

router.get("/mine", checkToken, ListarMeusConvidados);

router.get("/cpf/:cpf", checkToken, BuscarConvidadoPorCpf);

export default router;