/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Operacions d'autenticació
 *
 * /api/v1/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: "test@mail.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 * /api/v1/auth/register:
 *   post:
 *     summary: Registre
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: Creat }
 */
import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
const router = Router();
router.post('/register', controller.register);
router.post('/login', controller.login);
export default router;
