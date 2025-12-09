const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

favoriteSchema.index({ user: 1, model: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
