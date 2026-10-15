const express = require('express');
const router = express.Router();
const { 
  getItems, 
  getItemById, 
  createItem, 
  updateItemStatus 
} = require('../controllers/itemController');

router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', createItem);

router.put('/:id/status', updateItemStatus);

module.exports = router;