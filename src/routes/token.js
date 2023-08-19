const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth.controller');




/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Iniciar sesión con credenciales de usuario
 *     tags:
 *       - Autenticación
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Token de acceso generado después del inicio de sesión
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', authController.signin);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar usuario
 *     description: Registrar un nuevo usuario
 *     tags:
 *       - Autenticación
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *             email:
 *               type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post('/register', authController.createUsers);


module.exports = router;