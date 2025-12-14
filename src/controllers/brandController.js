const Brand = require('../models/Brand');

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().populate('vehicle_type');
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBrandsByVehicleType = async (req, res) => {
    try {
        const brands = await Brand.find({ vehicle_type: req.params.vehicleTypeId });
        res.json(brands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.createBrand = async (req, res) => {
  try {
    const newBrand = new Brand(req.body);
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
