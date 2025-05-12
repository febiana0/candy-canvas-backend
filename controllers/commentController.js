const commentModel = require('../models/commentModel');

exports.create = async (req, res) => {
  const { newsId, content } = req.body;
  const userId = req.user.id;

  try {
    await commentModel.createComment(userId, newsId, content);
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

exports.getByNews = async (req, res) => {
  const newsId = req.params.newsId;

  try {
    const comments = await commentModel.getCommentsByNews(newsId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

exports.update = async (req, res) => {
  const { content } = req.body;
  const commentId = req.params.id;
  const userId = req.user.id;

  try {
    const updated = await commentModel.updateComment(commentId, userId, content);
    if (updated === 0) return res.status(403).json({ message: 'Not allowed' });
    res.json({ message: 'Comment updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

exports.remove = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  try {
    const deleted = await commentModel.deleteComment(commentId, userId);
    if (deleted === 0) return res.status(403).json({ message: 'Not allowed' });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
