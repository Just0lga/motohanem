const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middlewares/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - model_id
 *         - user_id
 *         - rating
 *         - comment
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         model:
 *           type: string
 *           description: The model id
 *         user:
 *           type: string
 *           description: The user id
 *         rating:
 *           type: integer
 *           description: The rating (1-5)
 *         comment:
 *           type: string
 *           description: The comment text
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The comments managing API
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Returns the list of all the comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: The list of the comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Some server error
 */
router.get('/', commentController.getAllComments);

/**
 * @swagger
 * /comments/model/{modelId}:
 *   get:
 *     summary: Get comments by model id
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: modelId
 *         schema:
 *           type: string
 *         required: true
 *         description: The model id
 *     responses:
 *       200:
 *         description: The comments list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get('/model/:modelId', commentController.getCommentsByModel);
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Some server error
 */
router.post('/', protect, commentController.createComment);

module.exports = router;
