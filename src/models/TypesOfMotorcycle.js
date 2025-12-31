const mongoose = require('mongoose');

const typesOfMotorcycleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  }
}, {
  versionKey: false // __v alanını gizler
});

// Çıktıyı { id: "...", type: "..." } formatına dönüştür
typesOfMotorcycleSchema.method('toJSON', function() {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model('TypesOfMotorcycle', typesOfMotorcycleSchema);