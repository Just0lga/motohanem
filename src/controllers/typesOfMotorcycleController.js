const TypesOfMotorcycle = require('../models/TypesOfMotorcycle');

exports.getAllTypes = async (req, res) => {
  try {
    const types = await TypesOfMotorcycle.find();
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};