const mongoose = require('mongoose');
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
        const userId = new mongoose.Types.ObjectId(req.params.userId);

        const pipeline = [
            {
                $match: { user: userId }
            },
            // Lookup Model
            {
                $lookup: {
                    from: 'models', // Ensure this matches your collection name (usually plural lowercase)
                    localField: 'model',
                    foreignField: '_id',
                    as: 'model_data'
                }
            },
            {
                $unwind: '$model_data'
            },
            // Lookup Brand for the model (to mimic populate('model') fully regarding brand if needed, but usually just model stats are critical here)
             {
                $lookup: {
                    from: 'brands',
                    localField: 'model_data.brand',
                    foreignField: '_id',
                    as: 'model_data.brand'
                }
            },
            {
                 $unwind: {
                    path: '$model_data.brand',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Lookup Comments for stats
            {
                $lookup: {
                    from: 'comments',
                    localField: 'model_data._id',
                    foreignField: 'model',
                    as: 'comments_data'
                }
            },
            // Lookup Favorites for stats
            {
                $lookup: {
                    from: 'favorites',
                    localField: 'model_data._id',
                    foreignField: 'model',
                    as: 'favorites_data'
                }
            },
            // Calculate stats and enrich model_data
            {
                $addFields: {
                    'model_data.commentCount': { $size: '$comments_data' },
                    'model_data.favoriteCount': { $size: '$favorites_data' },
                    'model_data.averageRating': { 
                        $ifNull: [ { $avg: '$comments_data.rating' }, 0 ]
                    }
                }
            },
            // Project final structure to match original output: { _id, user, model: { ... } }
            // We keep the original 'user' and '_id' from the favorite document, and replace 'model' with our enriched 'model_data'
            {
                $project: {
                    _id: 1,
                    user: 1,
                    model: '$model_data',
                    created_at: 1 // assuming timestamps exist
                }
            }
        ];

        const favorites = await Favorite.aggregate(pipeline);
        // Note: aggregation returns POJOs, not Mongoose documents.
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

exports.deleteFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found or user not authorized' });
        }
        res.json({ message: 'Favorite deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
