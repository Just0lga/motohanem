const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       required:
 *         - vehicle_type_id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the brand
 *         vehicle_type:
 *           type: string
 *           description: The vehicle type id
 *         name:
 *           type: string
 *           description: The brand name
 *         logo_url:
 *           type: string
 *           description: The brand logo url
 *         country:
 *           type: string
 *           description: The country of origin
 *         description:
 *           type: string
 *           description: A brief description of the brand
 */

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: The brands managing API
 */

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Returns the list of all the brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: The list of the brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: The brand was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       500:
 *         description: Some server error
 */
const { protect } = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', brandController.getAllBrands);

/**
 * @swagger
 * /brands/type/{vehicleTypeId}:
 *   get:
 *     summary: Get brands by vehicle type id
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: vehicleTypeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The vehicle type id
 *     responses:
 *       200:
 *         description: The brands list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 */
router.get('/type/:vehicleTypeId', brandController.getBrandsByVehicleType);
router.post('/', protect, admin, brandController.createBrand);

module.exports = router;
