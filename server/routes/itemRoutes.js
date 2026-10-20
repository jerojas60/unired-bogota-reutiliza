const express = require('express');
const router = express.Router();
const { 
  getItems, 
  getItemById, 
  createItem, 
  updateItemStatus 
} = require('../controllers/itemController');

// 🛠️ Importamos 'protect' correctamente entre llaves
const { protect } = require('../middleware/auth');

router.get('/', getItems);
router.get('/:id', getItemById);

// Usamos protect en las rutas que necesitan usuario autenticado
router.post('/', protect, createItem);
router.put('/:id/status', protect, updateItemStatus);

module.exports = router;