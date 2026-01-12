const express = require('express');
const router = express.Router();
const PremiumController = require('../controllers/PremiumController');

/**
 * @route POST /revenuecat
 * @desc Handle RevenueCat webhooks
 * @access Public (Protected by Bearer token in Controller)
 */
router.post('/', PremiumController.handleWebhook);

module.exports = router;
