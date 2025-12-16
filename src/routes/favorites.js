const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       required:
 *         - user_id
 *         - model_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the favorite
 *         user:
 *           type: string
 *           description: The user id
 *         model:
 *           type: string
 *           description: The model id
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: The favorites managing API
 */

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Returns the list of all the favorites
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: The list of the favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *   post:
 *     summary: Create a new favorite
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Favorite'
 *     responses:
 *       201:
 *         description: The favorite was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       500:
 *         description: Some server error
 */
router.get('/', favoriteController.getAllFavorites);

/**
 * @swagger
 * /favorites/user/{userId}:
 *   get:
 *     summary: Get favorites by user id
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The favorites list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 */
router.get('/user/:userId', favoriteController.getFavoritesByUser);
/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Create a new favorite
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Favorite'
 *     responses:
 *       201:
 *         description: The favorite was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       500:
 *         description: Some server error
 */
router.post('/', favoriteController.createFavorite);

module.exports = router;
