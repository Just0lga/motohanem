const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  vehicle_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleType',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 150
  },
  logo_url: {
    type: String
  },
  country: {
    type: String
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Brand', brandSchema);
