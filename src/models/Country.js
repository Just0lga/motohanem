const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  country_image_url: {
    type: String
  }
});

countrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Country', countrySchema);
