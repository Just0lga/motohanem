const cron = require('node-cron');
const User = require('../models/User');

const startPremiumExpiryJob = () => {
  // Run every day at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily premium expiry check...');
    
    try {
      const now = new Date();
      
      // Find users who are premium but their end date has passed
      const result = await User.updateMany(
        {
          isPremium: true,
          premiumEndDate: { $lt: now }
        },
        {
          $set: {
            isPremium: false,
            subscriptionType: null,
            premiumStartDate: null,
            premiumEndDate: null
          }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`Updated ${result.modifiedCount} expired premium subscriptions.`);
      } else {
        console.log('No expired premium subscriptions found.');
      }
      
    } catch (error) {
      console.error('Error in premium expiry job:', error);
    }
  });
};

module.exports = {
  startPremiumExpiryJob
};
