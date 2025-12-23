const mongoose = require('mongoose');

const UpdateConfigSchema = new mongoose.Schema({
  latestVersion: {
    type: String,
    required: true,
  },
  downloadUrl: {
    type: String,
    required: true,
  },
  forceUpdate: {
    type: Boolean,
    default: false,
  },
  releaseNotes: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UpdateConfig', UpdateConfigSchema);
