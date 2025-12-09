const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Each user can comment ONCE per model
commentSchema.index({ user: 1, model: 1 }, { unique: true });

module.exports = mongoose.model('Comment', commentSchema);
