const getConnection = require('../config/db');
const newsModel = require('../models/newsModel');

// GET semua berita, bisa pakai ?search=... dan ?category=...
exports.getAllNews = async (req, res) => {
  try {
    const { search, category } = req.query;

    const newsList = await newsModel.getAllNews({ search, category });
    res.json(newsList);
  } catch (err) {
    console.error('Error getAllNews:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET berita berdasarkan ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await newsModel.getNewsById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST buat berita baru (admin only)
exports.createNews = async (req, res) => {
  try {
    const { title, content, category_id, image_url } = req.body;
    const result = await newsModel.createNews({
      title,
      content,
      category_id,
      image_url,
    });

    res.status(201).json({
      message: 'News created successfully',
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT update berita berdasarkan ID
exports.updateNews = async (req, res) => {
  try {
    const result = await newsModel.updateNews(req.params.id, req.body);
    res.json({
      message: 'News updated successfully',
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE hapus berita berdasarkan ID (admin only)
exports.deleteNews = async (req, res) => {
  try {
    const result = await newsModel.deleteNews(req.params.id);
    res.json({
      message: 'News deleted successfully',
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
