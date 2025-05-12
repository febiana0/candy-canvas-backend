const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:newsId', commentController.getByNews); // publik
router.post('/', verifyToken, commentController.create); // harus login
router.put('/:id', verifyToken, commentController.update); // hanya author
router.delete('/:id', verifyToken, commentController.remove); // hanya author

module.exports = router;
