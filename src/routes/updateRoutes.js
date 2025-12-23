const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');

/**
 * @swagger
 * /api/v1/update/check:
 *   get:
 *     summary: Check for the latest application version
 *     description: Returns the latest version, download URL, release notes, and forced update status.
 *     parameters:
 *       - in: query
 *         name: currentVersion
 *         schema:
 *           type: string
 *           example: "1.0.0"
 *         description: The current version of the client application (optional, for logging/analytics).
 *     responses:
 *       200:
 *         description: Successful response with update details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 latestVersion:
 *                   type: string
 *                   example: "1.0.2"
 *                 downloadUrl:
 *                   type: string
 *                   example: "https://s3.amazonaws.com/my-bucket/app-release-v1.0.2.apk"
 *                 forceUpdate:
 *                   type: boolean
 *                   example: true
 *                 releaseNotes:
 *                   type: string
 *                   example: "Bug fixes and performance improvements."
 */
router.get('/check', updateController.checkForUpdate);

module.exports = router;
