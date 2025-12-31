const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       required:
 *         - country
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the country
 *         country:
 *           type: string
 *           description: The name of the country
 *         country_image_url:
 *           type: string
 *           description: The URL of the country image
 */

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: The countries managing API
 */

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Returns the list of all the countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: The list of the countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *       500:
 *          description: Some server error
 */
router.get('/', countryController.getAllCountries);

module.exports = router;
