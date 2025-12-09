const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Model:
 *       type: object
 *       required:
 *         - brand_id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the model
 *         brand:
 *           type: string
 *           description: The brand id
 *         name:
 *           type: string
 *           description: The model name
 *         year_start:
 *           type: integer
 *         year_end:
 *           type: integer
 *         image_url:
 *           type: string
 *         horsepower:
 *           type: integer
 *         torque:
 *           type: integer
 *         top_speed:
 *           type: integer
 *         weight:
 *           type: integer
 */

/**
 * @swagger
 * tags:
 *   name: Models
 *   description: The vehicle models managing API
 */

/**
 * @swagger
 * /models:
 *   get:
 *     summary: Returns the list of all the models
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: The list of the models
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Model'
 *   post:
 *     summary: Create a new model
 *     tags: [Models]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Model'
 *     responses:
 *       201:
 *         description: The model was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Model'
 *       500:
 *         description: Some server error
 */
router.get('/', modelController.getAllModels);

/**
 * @swagger
 * /models/brand/{brandId}:
 *   get:
 *     summary: Get models by brand id
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: brandId
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand id
 *     responses:
 *       200:
 *         description: The models list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Model'
 */
router.get('/brand/:brandId', modelController.getModelsByBrand);
router.post('/', modelController.createModel);

module.exports = router;
