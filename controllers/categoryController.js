const categoryModel = require('../models/categoryModel');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await categoryModel.createCategory(name);
    res.json({ message: 'Category created', rowsAffected: result.rowsAffected });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await categoryModel.updateCategory(req.params.id, name);
    res.json({ message: 'Category updated', rowsAffected: result.rowsAffected });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const result = await categoryModel.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted', rowsAffected: result.rowsAffected });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
