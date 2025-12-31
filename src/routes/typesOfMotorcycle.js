const express = require('express');
const router = express.Router();
const typesOfMotorcycleController = require('../controllers/typesOfMotorcycleController');

/**
 * @swagger
 * components:
 *   schemas:
 *     TypesOfMotorcycle:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: Otomatik oluşturulan ID
 *         type:
 *           type: string
 *           description: Motosiklet tipi (Naked, Racing vb.)
 *       example:
 *         id: "string"
 *         type: "string"
 */

/**
 * @swagger
 * tags:
 *   - name: TypesOfMotorcycle
 *     description: Motosiklet tipleri yönetimi
 */

/**
 * @swagger
 * /types-of-motorcycle:
 *   get:
 *     summary: Tüm motosiklet tiplerini getirir
 *     tags:
 *       - TypesOfMotorcycle
 *     responses:
 *       200:
 *         description: Motosiklet tipleri listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TypesOfMotorcycle'
 *       500:
 *         description: Sunucu hatası
 */
router.get('/', typesOfMotorcycleController.getAllTypes);

module.exports = router;
