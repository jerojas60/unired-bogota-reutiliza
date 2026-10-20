const express = require('express');
const router = express.Router();
const { 
  getItems, 
  getItemById, 
  createItem, 
  updateItemStatus 
} = require('../controllers/itemController');

const { protect, protectOptional } = require('../middleware/auth');

// Catálogo público + vistas del usuario autenticado
router.get('/', protectOptional, getItems);
router.get('/:id', getItemById);

// Rutas estrictamente protegidas
router.post('/', protect, createItem);
router.put('/:id/status', protect, updateItemStatus);

module.exports = router;