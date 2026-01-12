const PremiumController = require('./src/controllers/PremiumController');

// Mock Request without headers
const req = {
  headers: {},
  body: {
    event: {
      type: 'INITIAL_PURCHASE',
      app_user_id: 'test_user_id',
      product_id: 'monthly'
    }
  }
};

// Mock Response
const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log(`Response Code: ${this.statusCode}`);
    console.log('Response Body:', data);
    return this;
  }
};

// Run the handler
console.log("Running reproduction test...");
PremiumController.handleWebhook(req, res).then(() => {
    console.log("Test finished.");
}).catch(err => {
    console.error("Test error:", err);
});
