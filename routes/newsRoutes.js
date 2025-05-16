const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');


router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', verifyToken, isAdmin, newsController.createNews);
router.put('/:id', verifyToken, isAdmin, newsController.updateNews);
router.delete('/:id', verifyToken, isAdmin, newsController.deleteNews);

module.exports = router;
