const Comment = require('../models/Comment');

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('model').populate('user');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCommentsByModel = async (req, res) => {
    try {
        const { modelId } = req.params;
        const mongoose = require('mongoose');

        const [comments, ratingResult] = await Promise.all([
          Comment.find({ model: modelId }).populate('user'),
          Comment.aggregate([
            { $match: { model: new mongoose.Types.ObjectId(modelId) } },
            { $group: { _id: null, averageRating: { $avg: '$rating' } } }
          ])
        ]);

        const averageRating = ratingResult.length > 0 ? ratingResult[0].averageRating : 0;

        res.json({
          averageRating,
          comments
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.createComment = async (req, res) => {
  const { model_id, user_id, rating, comment, user, model } = req.body;
  
  // Support both snake_case and direct names
  const finalUserId = user_id || user;
  const finalModelId = model_id || model;

  try {
    const newComment = new Comment({ 
        model: finalModelId, 
        user: finalUserId, 
        rating, 
        comment 
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    // Check for duplicate key error (MongoDB code 11000)
    if (err.code === 11000) {
        // Find the existing comment to return it
        const existingComment = await Comment.findOne({ 
            model: finalModelId, 
            user: finalUserId 
        });
        
        return res.status(400).json({ 
            message: 'User has already commented on this model',
            comment: existingComment
        });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.updateComment = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { rating, comment },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found or user not authorized' });
        }

        res.json(updatedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or user not authorized' });
        }
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
