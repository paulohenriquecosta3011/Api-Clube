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

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               id_base:
 *                 type: integer
 *               tipo_user:
 *                 type: string
 *                 enum: [A, S]
 *             required:
 *               - name
 *               - email
 *               - id_base
 *               - tipo_user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid user data
 *       401:
 *         description: Unauthorized
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
 * /api/users/login:
 *   post:
 *     summary: User login
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
 * /users/generate-code:
 *   post:
 *     summary: Generate a temporary code
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Code sent successfully
 *       400:
 *         description: Invalid email
 */
router.post("/generate-code", generateAndSendCode);

/**
 * @swagger
 * /users/validate-code:
 *   post:
 *     summary: Validate a temporary code
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *             required:
 *               - email
 *               - code
 *     responses:
 *       200:
 *         description: Code validated successfully
 *       400:
 *         description: Invalid code
 */
router.post("/validate-code", validateCode);

/**
 * @swagger
 * /users/setPassword:
 *   post:
 *     summary: Set a new password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - email
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid data
 */
router.post("/setPassword", setPassword);

export default router;