const Favorite = require('../models/Favorite');

exports.getAllFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find().populate('user').populate('model');
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFavoritesByUser = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.params.userId }).populate('model');
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.createFavorite = async (req, res) => {
  const { user_id, model_id, user, model } = req.body;

  // Support both snake_case and direct names
  const finalUserId = user_id || user;
  const finalModelId = model_id || model;

  try {
    const newFavorite = new Favorite({ 
        user: finalUserId, 
        model: finalModelId 
    });
    await newFavorite.save();
    res.status(201).json(newFavorite);
  } catch (err) {
    if (err.code === 11000) {
        return res.status(400).json({ message: 'User has already favorited this model' });
    }
    res.status(500).json({ message: err.message });
  }
};
