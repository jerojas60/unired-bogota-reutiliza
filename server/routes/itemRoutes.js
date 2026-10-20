const express = require('express');
const router = express.Router();
const { 
  getItems, 
  getItemById, 
  createItem, 
  updateItemStatus 
} = require('../controllers/itemController');

const auth = require('../middleware/auth');

router.get('/', getItems);
router.get('/:id', getItemById);

router.post('/', auth, createItem);

router.put('/:id/status', auth, updateItemStatus);

module.exports = router;