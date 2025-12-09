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
        const comments = await Comment.find({ model: req.params.modelId }).populate('user');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.createComment = async (req, res) => {
  const { model_id, user_id, rating, comment } = req.body;
  try {
    const newComment = new Comment({ 
        model: model_id, 
        user: user_id, 
        rating, 
        comment 
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    // Check for duplicate key error (MongoDB code 11000)
    if (err.code === 11000) {
        return res.status(400).json({ message: 'User has already commented on this model' });
    }
    res.status(500).json({ message: err.message });
  }
};
