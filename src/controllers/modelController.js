const Model = require('../models/Model');

exports.getAllModels = async (req, res) => {
  try {
    const models = await Model.find().populate('brand');
    res.json(models);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getModelsByBrand = async (req, res) => {
    try {
        const models = await Model.find({ brand: req.params.brandId });
        res.json(models);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.createModel = async (req, res) => {
  const { brand_id, name, year_start, year_end, image_url, horsepower, torque, top_speed, weight } = req.body;
  try {
    const newModel = new Model({ 
        brand: brand_id, 
        name, 
        year_start, 
        year_end, 
        image_url, 
        horsepower, 
        torque, 
        top_speed, 
        weight 
    });
    await newModel.save();
    res.status(201).json(newModel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
