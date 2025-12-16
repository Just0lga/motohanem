const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');

/**
 * @swagger
 * tags:
 *   name: Translations
 *   description: Dynamic language translation management
 */

/**
 * @swagger
 * /translations:
 *   get:
 *     summary: Get all translations
 *     tags: [Translations]
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [en, tr]
 *         description: Language code (en or tr)
 *     responses:
 *       200:
 *         description: A JSON object of key-value pair translations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: string
 *               example:
 *                 login_forgot_password: "Forgot Password?"
 *                 home_title: "Comparison"
 *       500:
 *         description: Server Error
 */
const { protect } = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/', translationController.getTranslations);

/**
 * @swagger
 * /translations:
 *   post:
 *     summary: Create a new translation
 *     tags: [Translations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - tr
 *               - en
 *             properties:
 *               key:
 *                 type: string
 *                 description: Unique translation key
 *               tr:
 *                 type: string
 *                 description: Turkish translation
 *               en:
 *                 type: string
 *                 description: English translation
 *               screen:
 *                 type: string
 *                 description: Screen or group name
 *     responses:
 *       201:
 *         description: The created translation
 *       400:
 *         description: Validation error or key already exists
 *       500:
 *         description: Server Error
 */
router.post('/', protect, admin, translationController.createTranslation);

module.exports = router;
