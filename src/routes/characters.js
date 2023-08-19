const express = require("express");
const router = express.Router();
const charactersController = require("../controllers/characters.controller");
const { verifyToken } = require("../middlewares/auth");
const path = require("path");
const { upload } = require("../multer");


/**
 * @swagger
 * tags:
 *   name: Characters
 *   description: API to manage characters
 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * /api/v1/characters:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Get all characters
 *     tags: [Characters]
 *     responses:
 *       200:
 *         description: List of characters
 *       500:
 *         description: Server error
 */
router.get("/", verifyToken, charactersController.getAllCharacters);

/**
 * @swagger
 * /api/v1/characters:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Create a new character
 *     tags: [Characters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               weight:
 *                 type: string
 *               story:
 *                 type: string
 *             required:
 *               - name
 *               - age
 *               - weight
 *               - story
 *     responses:
 *       200:
 *         description: Character created successfully
 *       500:
 *         description: Server error
 */
router.post("/", verifyToken, upload, charactersController.createCharacter);

/**
 * @swagger
 * /api/v1/characters/{characterId}:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Get a character by ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: characterId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the character
 *     responses:
 *       200:
 *         description: Character details
 *       500:
 *         description: Server error
 */
router.get("/:filter", verifyToken, charactersController.getCharacterByfilter);

/**
 * @swagger
 * /api/v1/characters/{characterId}:
 *   patch:
 *     security:
 *       - BearerAuth: []
 *     summary: Update a character by ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: characterId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the character
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               weight:
 *                 type: string
 *               story:
 *                 type: string
 *             required:
 *               - name
 *               - age
 *               - weight
 *               - story
 *     responses:
 *       200:
 *         description: Character updated successfully
 *       500:
 *         description: Server error
 */
router.patch(
  "/:characterId",
  verifyToken,
  charactersController.updatedCharacter
);

/**
 * @swagger
 * /api/v1/characters/{characterId}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Delete a character by ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: characterId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the character
 *     responses:
 *       200:
 *         description: Character deleted successfully
 *       500:
 *         description: Server error
 */
router.delete(
  "/:characterId",
  verifyToken,
  charactersController.deleteCharacter
);

module.exports = router;
