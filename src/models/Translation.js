const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  tr: {
    type: String,
    required: true
  },
  en: {
    type: String,
    required: true
  },
  screen: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Translation', translationSchema);
