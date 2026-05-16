// users.routes.js

import { Router } from "express";
import { register, login, generateAndSendCode, validateCode, setPassword } from "../controllers/users.controller.js";
import { 
  VerificarEmailExistente,
  checkToken,
  authorizeAdmin,
  validateRequiredFields,
  validateEmail,
  validatePassword
} from "../middlewares/index.js";
import loginRateLimiter from '../middlewares/loginRateLimiter.js';
import { getEmpresasByEmail } from "../controllers/users.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create a new user (Admin only)
 *     description: |
 *       This endpoint allows authenticated administrators to create new users
 *       inside their company environment.
 *
 *       Typical usage:
 *       - Member synchronization
 *       - Staff registration
 *       - Secretary/operator accounts
 *       - Administrative accounts
 *
 *       Requires JWT authentication with administrator privileges.
 *
 *     tags: [Users]
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
 *               name:
 *                 type: string
 *                 example: John Doe
 *
 *               email:
 *                 type: string
 *                 example: john@club.com
 *
 *               id_base:
 *                 type: integer
 *                 example: 1
 *
 *               tipo_user:
 *                 type: string
 *                 enum: [A, S]
 *                 example: S
 *
 *             required:
 *               - name
 *               - email
 *               - id_base
 *               - tipo_user
 *
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: User registered successfully
 *               data:
 *                 user:
 *                   id_user: 15
 *                   name: John Doe
 *                   email: john@club.com
 *                   id_base: 1
 *
 *       400:
 *         description: Invalid user data
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: "Invalid user type. Allowed: A (admin), S (standard)."
 *               data: USER_TYPE_INVALID
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
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Access denied
 *               data: ACCESS_DENIED 
 */

router.post(
  "/register",
  checkToken,
  validateRequiredFields(["name", "email", "id_base","tipo_user"]),
  validateEmail("email"),
  authorizeAdmin,
  VerificarEmailExistente,
  register
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user and generate JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - id_empresa
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               id_empresa:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Login successful!
 *               data:
 *                 token: jwt_token_here
 *                 user:
 *                   id: 1
 *                   name: John Doe
 *                   email: admin@email.com
 *                   tipo_user: A
 *                   id_empresa: 1
 */

router.post(
  "/login",
  validateRequiredFields(["email", "password"]),
  validateEmail("email"),
  validatePassword("password"),
  loginRateLimiter,
  login
);

/**
 * @swagger
 * /generate-code:
 *   post:
 *     summary: Generate temporary access verification code
 *     description: |
 *       Generates a temporary verification code and sends it to the user's email.
 *
 *       This endpoint is typically used during:
 *       - First access
 *       - Password setup
 *       - Authentication validation
 *       - Secure account verification
 *
 *     tags: [Users]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@company.com
 *
 *               id_empresa:
 *                 type: integer
 *                 example: 1
 *
 *             required:
 *               - email
 *               - id_empresa
 *
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Validation code sent successfully
 *               data:
 *                 token: temporary_jwt_token
 *
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: "Email and company identifier are required."
 *               data: VALIDATION_REQUIRED_FIELDS
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: User not found
 *               data: USER_NOT_FOUND
 */
router.post("/generate-code", generateAndSendCode);

/**
 * @swagger
 * /validate-code:
 *   post:
 *     summary: Validate temporary verification code
 *     description: |
 *       Validates the temporary verification code previously sent to the user email.
 *
 *       This endpoint is commonly used during:
 *       - First access validation
 *       - Password setup flow
 *       - Identity confirmation
 *       - Secure authentication process
 *
 *       Requires the temporary JWT token generated by /generate-code.
 *
 *     tags: [Users]
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
 *               code:
 *                 type: string
 *                 example: "483921"
 *
 *             required:
 *               - code
 *
 *     responses:
 *       200:
 *         description: Verification code validated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Code validated successfully
 *               data:
 *                 result:
 *                   message: Verification code validated successfully
 *                   emailConfirmed: user@company.com
 *
 *       400:
 *         description: Invalid verification code
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Invalid verification code
 *               data: INVALID_VERIFICATION_CODE
 *
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Invalid token
 *               data: INVALID_TOKEN
 */

router.post("/validate-code", validateCode);

/**
 * @swagger
 * /set-password:
 *   post:
 *     summary: Define or update user password
 *     description: |
 *       Defines a new password for the authenticated user.
 *
 *       This endpoint is normally used after successful verification
 *       of the temporary validation code.
 *
 *       Requires a valid temporary JWT token generated during the
 *       authentication flow.
 *
 *     tags: [Users]
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
 *               password:
 *                 type: string
 *                 example: MySecurePassword123
 *
 *             required:
 *               - password
 *
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Password set successfully
 *               data:
 *                 message: Password received successfully in service
 *                 emailReceived: user@company.com
 *
 *       400:
 *         description: Password validation error
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Password is required.
 *               data: VALIDATION_PASSWORD
 *
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Invalid token
 *               data: INVALID_TOKEN
 *
 *       403:
 *         description: Company identifier missing in token
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Company identifier not found in token.
 *               data: ID_EMPRESA_MISSING_IN_TOKEN
 */
router.post("/set-password", setPassword);


/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Retrieve companies associated with an email
 *     description: |
 *       Returns the list of companies linked to a specific email address.
 *
 *       This endpoint is typically used in multi-company environments
 *       where the same user may belong to multiple organizations.
 *
 *       Typical usage:
 *       - Company selection before authentication
 *       - Multi-tenant login flow
 *       - Organization discovery
 *
 *       Returns an empty companies array when no organizations
 *       are associated with the provided email.
 *
 *     tags: [Users]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@company.com
 *
 *             required:
 *               - email
 *
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Companies retrieved successfully
 *               data:
 *                 companies:
 *                   - id_empresa: 1
 *                     nome: Empresa Teste
 *
 *       400:
 *         description: Email is required
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Email is required
 *               data:
 *                 companies: []
 */
router.post("/companies", getEmpresasByEmail);

export default router;