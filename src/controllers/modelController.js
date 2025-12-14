const Model = require('../models/Model');

exports.getAllModels = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalDocs = await Model.countDocuments();
    const models = await Model.find().populate('brand').skip(skip).limit(limit);
    
    res.json({
        docs: models,
        totalDocs,
        limit,
        totalPages: Math.ceil(totalDocs / limit),
        page,
        hasNextPage: page * limit < totalDocs,
        hasPrevPage: page > 1
    });
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

exports.getModelsByType = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const typeValue = req.params.typeValue;

    try {
        const totalDocs = await Model.countDocuments({ type: typeValue });
        const models = await Model.find({ type: typeValue }).populate('brand').skip(skip).limit(limit);
        
        res.json({
            docs: models,
            totalDocs,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            page,
            hasNextPage: page * limit < totalDocs,
            hasPrevPage: page > 1
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getModelsByOrigin = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const originValue = req.params.originValue;

    try {
        const totalDocs = await Model.countDocuments({ origin: originValue });
        const models = await Model.find({ origin: originValue }).populate('brand').skip(skip).limit(limit);
        
        res.json({
            docs: models,
            totalDocs,
            limit,
            totalPages: Math.ceil(totalDocs / limit),
            page,
            hasNextPage: page * limit < totalDocs,
            hasPrevPage: page > 1
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.createModel = async (req, res) => {
  try {
    const newModel = new Model(req.body);
    await newModel.save();
    res.status(201).json(newModel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
