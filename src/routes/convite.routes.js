// convite.routes.js
import { Router } from "express";
import { RegisterConvite, DownloadConvites, MeusConvites,BuscarConvitePublico } from "../controllers/convite.controller.js";
import { checkToken, validarTokenMaquina } from "../middlewares/index.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Invitations
 *   description: Invitation and gate synchronization management
 */


/**
 * @swagger
 * /invitations:
 *   post:
 *     summary: Register a new invitation
 *     description: |
 *       Creates a new invitation associated with the authenticated user.
 *
 *       Invitations are commonly used in:
 *       - Guest access control
 *       - Club invitation workflows
 *       - Visitor authorization
 *       - Gate management systems
 *
 *       Requires authenticated user access via JWT token.
 *
 *     tags: [Invitations]
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
 *             properties:
 *               cpf_convidado:
 *                 type: string
 *                 example: 08200381641
 *
 *               dataconvite:
 *                 type: string
 *                 format: date
 *                 example: 2026-05-16
 *
 *             required:
 *               - cpf_convidado
 *               - dataconvite
 *
 *     responses:
 *       201:
 *         description: Invitation registered successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Invite registered successfully
 *               data:
 *                 id_convite: 10
 *                 cpf_convidado: 08200381641
 *                 dataconvite: 2026-05-16
 *                 id_user: 1
 *
 *       400:
 *         description: Invalid invitation data
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Invalid invitation data
 *               data: REGISTER_CONVITE_ERROR
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
 *               message: Erro ao cadastrar convite
 *               data: REGISTER_CONVITE_ERROR
 */
router.post("/", checkToken, RegisterConvite);

/**
 * @swagger
 * /invitations/download:
 *   post:
 *     summary: Download invitations for gate synchronization
 *     description: |
 *       Downloads invitations for local machine synchronization.
 *
 *       This endpoint is designed for:
 *       - Gate systems
 *       - Offline access validation
 *       - Local invitation caching
 *       - Access control terminals
 *       - Reader-integrated systems
 *
 *       Machine authentication is required using a machine token.
 *
 *       The endpoint supports:
 *       - Full synchronization by date
 *       - Incremental synchronization by user
 *       - Offline-first operation
 *
 *     tags: [Invitations]
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
 *             properties:
 *               id_user:
 *                 type: integer
 *                 example: 1
 *                 description: Optional user filter
 *
 *               data:
 *                 type: string
 *                 format: date
 *                 example: 2026-05-16
 *                 description: Required synchronization date
 *
 *             required:
 *               - data
 *
 *     responses:
 *       200:
 *         description: Invitations synchronized successfully
 *         content:
 *           application/json:
 *             examples:
 *               successWithData:
 *                 value:
 *                   status: success
 *                   message: Convites baixados com sucesso!
 *                   data:
 *                     - id_convite: 1
 *                       nome_convidado: Ana Carolina
 *                       cpf_convidado: 08200381641
 *                       dataconvite: 2026-05-16
 *
 *               successEmpty:
 *                 value:
 *                   status: success
 *                   message: Não existem convites para baixar.
 *                   data: []
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: O parâmetro 'data' é obrigatório.
 *               data: DATA_OBRIGATORIA
 *
 *       401:
 *         description: Unauthorized machine
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Token inválido
 *               data: INVALID_MACHINE_TOKEN
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Erro ao baixar convites
 *               data: DOWNLOAD_CONVITES_ERROR
 */
router.post("/download", validarTokenMaquina, DownloadConvites);


/**
 * @swagger
 * /invitations/mine:
 *   get:
 *     summary: Retrieve authenticated user's invitations
 *     description: |
 *       Returns invitations created by the authenticated user.
 *
 *       Supports optional filtering by initial date.
 *
 *       Common usage:
 *       - Invitation history
 *       - Guest management
 *       - Access monitoring
 *       - Mobile applications
 *       - Invitation dashboards
 *
 *       Requires authenticated user access via JWT token.
 *
 *     tags: [Invitations]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: data
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-05-01
 *         description: Initial date filter
 *
 *     responses:
 *       200:
 *         description: User invitations retrieved successfully
 *         content:
 *           application/json:
 *             examples:
 *               successWithData:
 *                 value:
 *                   status: success
 *                   message: Seus convites
 *                   data:
 *                     - id_convite: 1
 *                       cpf_convidado: 08200381641
 *                       nome_convidado: Ana Carolina
 *                       dataconvite: 2026-05-16
 *
 *               successEmpty:
 *                 value:
 *                   status: success
 *                   message: Você ainda não fez nenhum convite a partir dessa data
 *                   data: []
 *
 *       400:
 *         description: Invalid date
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Data inicial inválida
 *               data: DATA_INVALIDA
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
 *               message: Erro ao buscar convites
 *               data: FETCH_MEUS_CONVITES_ERROR
 */
router.get("/mine", checkToken, MeusConvites);

router.get("/public/:token",  BuscarConvitePublico  );
export default router;