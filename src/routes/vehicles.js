const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleType:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the vehicle type
 *         name:
 *           type: string
 *           description: The vehicle type name
 */

/**
 * @swagger
 * tags:
 *   name: VehicleTypes
 *   description: The vehicle types managing API
 */

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Returns the list of all the vehicle types
 *     tags: [VehicleTypes]
 *     responses:
 *       200:
 *         description: The list of the vehicle types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleType'
 *   post:
 *     summary: Create a new vehicle type
 *     tags: [VehicleTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleType'
 *     responses:
 *       201:
 *         description: The vehicle type was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleType'
 *       500:
 *         description: Some server error
 */
const { protect } = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', vehicleController.getAllVehicleTypes);
router.post('/', protect, admin, vehicleController.createVehicleType);

module.exports = router;
