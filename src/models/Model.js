const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 150
  },
  year_start: Number,
  year_end: Number,
  image_url: String,
  horsepower: Number,
  torque: Number,
  top_speed: Number,
  weight: Number
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('Model', modelSchema);
