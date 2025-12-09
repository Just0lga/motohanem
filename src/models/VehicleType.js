const mongoose = require('mongoose');

const vehicleTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  }
});

module.exports = mongoose.model('VehicleType', vehicleTypeSchema);
