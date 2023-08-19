const express = require("express");
const router = express.Router();
const audiovisualController = require("../controllers/audiovisual.controller");
const { verifyToken } = require("../middlewares/auth");
const { upload } = require("../multer");

/**
 * @swagger
 * tags:
 *   name: Audiovisual
 *   description: API to manage audiovisual content
 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * /api/v1/audiovisual:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Get all audiovisual content
 *     tags: [Audiovisual]
 *     responses:
 *       200:
 *         description: List of audiovisual content
 *       500:
 *         description: Server error
 */
router.get("/", verifyToken, audiovisualController.getAllAudiovisual);

/**
 * @swagger
 * /api/v1/audiovisual:
 *   post:
 *     security:
 *       - BearerAuth: []
 *     summary: Create new audiovisual content
 *     tags: [Audiovisual]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audiovisual'
 *     responses:
 *       201:
 *         description: Audiovisual content created successfully
 *       500:
 *         description: Server error
 */
router.post("/", verifyToken, upload, audiovisualController.createAudiovisual);

/**
 * @swagger
 * /api/v1/audiovisuals:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Get audiovisuals with search, filter, and sorting options
 *     tags: [Audiovisuals]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title to search for
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Genre to filter by
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascendente or descendente)
 *     responses:
 *       200:
 *         description: List of audiovisuals
 *       500:
 *         description: Server error
 */
router.get("/filter", verifyToken, audiovisualController.getAudiovisualByFilter);

/**
 * @swagger
 * /api/v1/audiovisual/{audiovisualId}:
 *   patch:
 *     security:
 *       - BearerAuth: []
 *     summary: Update audiovisual content by ID
 *     tags: [Audiovisual]
 *     parameters:
 *       - in: path
 *         name: audiovisualId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the audiovisual content
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audiovisual'
 *     responses:
 *       200:
 *         description: Audiovisual content updated successfully
 *       500:
 *         description: Server error
 */
router.patch("/:audiovisualId", verifyToken, audiovisualController.updateAudiovisual);

/**
 * @swagger
 * /api/v1/audiovisual/{audiovisualId}:
 *   delete:
 *     security:
 *       - BearerAuth: []
 *     summary: Delete audiovisual content by ID
 *     tags: [Audiovisual]
 *     parameters:
 *       - in: path
 *         name: audiovisualId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the audiovisual content
 *     responses:
 *       204:
 *         description: Audiovisual content deleted successfully
 *       500:
 *         description: Server error
 */
router.delete("/:audiovisualId", verifyToken, audiovisualController.deleteAudiovisual);

module.exports = router;
