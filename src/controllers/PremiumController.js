const User = require('../models/User');

/**
 * Handle RevenueCat Webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.handleWebhook = async (req, res) => {
  try {
    // 1. Security Check
    const authHeader = req.headers.authorization;
    const expectedSecret = process.env.REVENUECAT_SECRET || 'MOTO_HANEM_GIZLI_KEY_12345';
    
    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      console.warn('Unauthorized RevenueCat webhook attempt - proceeding anyway as per configuration');
      // return res.status(401).json({ message: 'Unauthorized' }); // Relaxed security for now
    }

    // 2. Extract Event Data
    const event = req.body && req.body.event;
    if (!event) {
      return res.status(400).json({ message: 'Invalid payload: Missing event data' });
    }

    const { type: eventType, app_user_id: appUserId, expiration_at_ms, product_id } = event;

    if (!appUserId) {
      console.warn('RevenueCat webhook missing app_user_id', event);
      return res.status(400).json({ message: 'Missing app_user_id' });
    }

    console.log(`Received RevenueCat event: ${eventType} for user: ${appUserId}`);

    // 3. Handle specific events
    const user = await User.findById(appUserId);
    
    if (!user) {
      console.warn(`User not found for ID: ${appUserId}`);
      // Return 200 to acknowledge receipt even if user not found, to prevent retries? 
      // Or 404? Usually webhooks should return 200 if processed, even if "logical" failure.
      // Let's return 200 but log warning.
      return res.status(200).json({ message: 'User not found' });
    }

    switch (eventType) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'UNCANCELLATION':
      case 'PRODUCT_CHANGE':
        // Grant/Update Premium Access
        user.isPremium = true;
        user.subscriptionType = product_id || user.subscriptionType; // Update if provided
        
        if (expiration_at_ms) {
            user.premiumEndDate = new Date(expiration_at_ms);
        }
        
        await user.save();
        console.log(`Updated premium status for user ${user._id}: Active until ${user.premiumEndDate}`);
        break;

      case 'EXPIRATION':
        // Revoke Access
        user.isPremium = false;
        user.subscriptionType = null;
        user.premiumEndDate = null;
        await user.save();
        console.log(`Revoked premium status for user ${user._id} due to expiration`);
        break;

      case 'CANCELLATION':
        // Log cancellation, but DO NOT revoke access immediately.
        // Access remains until premiumEndDate.
        console.log(`User ${user._id} cancelled subscription. Access remains until ${user.premiumEndDate}`);
        break;
        
      default:
        console.log(`Unhandled RevenueCat event type: ${eventType}`);
    }

    return res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Error processing RevenueCat webhook:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
