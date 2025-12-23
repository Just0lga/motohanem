const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  model: {
    type: String,
    required: true,
    maxlength: 150
  },
  type: String,
  engine_timing: String,
  cylinder_count: String,
  transmission: String,
  cooling_type: String,
  origin: String,

  displacement_cc: Number,
  power_hp_rpm: String,
  torque_nm_rpm: String,
  top_speed_kmh: Number,
  acceleration_0_100_kmh_s: Number,
  fuel_consumption_km_per_l: String,
  fuel_type: String,

  seat_height_mm: Number,
  wheelbase_mm: Number,
  wet_weight_kg: Number,
  fuel_tank_l: Number,

  front_suspension: String,
  rear_suspension: String,
  brake_front: String,
  brake_rear: String,
  abs: String,

  tire_front: String,
  tire_rear: String,

  instrument_panel: String,
  headlight: String,
  model_image_url: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('Model', modelSchema);
