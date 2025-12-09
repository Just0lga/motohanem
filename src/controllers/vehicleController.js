const VehicleType = require('../models/VehicleType');

exports.getAllVehicleTypes = async (req, res) => {
  try {
    const vehicleTypes = await VehicleType.find();
    res.json(vehicleTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createVehicleType = async (req, res) => {
  const { name } = req.body;
  try {
    const newVehicleType = new VehicleType({ name });
    await newVehicleType.save();
    res.status(201).json(newVehicleType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
