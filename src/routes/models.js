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
 *         - brand
 *         - model
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the model
 *         brand:
 *           type: string
 *           description: The brand id
 *         brand_name:
 *           type: string
 *           description: The brand name
 *         model:
 *           type: string
 *           description: The model name
 *         type:
 *           type: string
 *         engine_timing:
 *           type: string
 *         cylinder_count:
 *           type: string
 *         transmission:
 *           type: string
 *         cooling_type:
 *           type: string
 *         origin:
 *           type: string
 *         displacement_cc:
 *           type: integer
 *         power_hp_rpm:
 *           type: string
 *         torque_nm_rpm:
 *           type: string
 *         top_speed_kmh:
 *           type: integer
 *         acceleration_0_100_kmh_s:
 *           type: number
 *         fuel_consumption_km_per_l:
 *           type: string
 *         fuel_type:
 *           type: string
 *         seat_height_mm:
 *           type: integer
 *         wheelbase_mm:
 *           type: integer
 *         wet_weight_kg:
 *           type: integer
 *         fuel_tank_l:
 *           type: integer
 *         front_suspension:
 *           type: string
 *         rear_suspension:
 *           type: string
 *         brake_front:
 *           type: string
 *         brake_rear:
 *           type: string
 *         abs:
 *           type: string
 *         tire_front:
 *           type: string
 *         tire_rear:
 *           type: string
 *         instrument_panel:
 *           type: string
 *         headlight:
 *           type: string
 *         model_image_url:
 *           type: string
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
 *     summary: Returns the list of all the models with pagination
 *     tags: [Models]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: The list of the models
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Model'
 *                 totalDocs:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 hasNextPage:
 *                   type: boolean
 *                 hasPrevPage:
 *                   type: boolean
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
const { protect } = require('../middlewares/auth');
const admin = require('../middlewares/admin');

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

/**
 * @swagger
 * /models/type/{typeValue}:
 *   get:
 *     summary: Get models by type with pagination
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: typeValue
 *         schema:
 *           type: string
 *         required: true
 *         description: The type value to filter by
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: The filtered models list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Model'
 *                 totalDocs:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 hasNextPage:
 *                   type: boolean
 *                 hasPrevPage:
 *                   type: boolean
 */
router.get('/type/:typeValue', modelController.getModelsByType);

/**
 * @swagger
 * /models/origin/{originValue}:
 *   get:
 *     summary: Get models by origin with pagination
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: originValue
 *         schema:
 *           type: string
 *         required: true
 *         description: The origin value to filter by
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: The filtered models list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Model'
 *                 totalDocs:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 hasNextPage:
 *                   type: boolean
 *                 hasPrevPage:
 *                   type: boolean
 */
router.get('/origin/:originValue', modelController.getModelsByOrigin);

/**
 * @swagger
 * /models:
 *   post:
 *     summary: Create a new model
 *     tags: [Models]
 *     security:
 *       - bearerAuth: []
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
router.post('/', protect, admin, modelController.createModel);

module.exports = router;
