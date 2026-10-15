const Item = require('../models/Item');
const DonationTrace = require('../models/DonationTrace');

// @route POST /api/items
const createItem = async (req, res) => {
  try {
    const { titulo, categoria, detalles, fotos, localidad } = req.body;

    if (!titulo || !categoria || !detalles?.colegio || !localidad) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const item = await Item.create({
      donanteId: req.user._id,
      titulo,
      categoria,
      detalles,
      fotos,
      localidad,
      estado: 'PENDIENTE' // Estado inicial para revisión de moderación
    });

    // Se crea automáticamente el primer registro de trazabilidad
    await DonationTrace.create({
      itemId: item._id,
      donanteId: req.user._id,
      historialEstados: [{ estado: 'PENDIENTE', fecha: new Date() }],
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear el insumo', error: error.message });
  }
};

// @route GET /api/items
const getItems = async (req, res) => {
  try {
    const { localidad, colegio, categoria, talla, estado } = req.query;

    const filtros = {};

    if (localidad) filtros.localidad = localidad;
    if (colegio) filtros['detalles.colegio'] = colegio;
    if (categoria) filtros.categoria = categoria;
    if (talla) filtros['detalles.talla'] = talla;
    
    // Si no especifican estado, por defecto muestra solo los disponibles en el catálogo
    filtros.estado = estado || 'DISPONIBLE';

    const items = await Item.find(filtros)
      .populate('donanteId', 'nombre ubicacion')
      .sort({ createdAt: -1 });

    return res.status(200).json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener el catálogo', error: error.message });
  }
};

// @route GET /api/items/:id
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('donanteId', 'nombre ubicacion telefono');

    if (!item) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener el insumo', error: error.message });
  }
};

// @route PUT /api/items/:id/status
// NUEVA FUNCIÓN: Para que el Administrador apruebe/rechace o el usuario reserve
const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'DISPONIBLE', 'RECHAZADO', 'RESERVADO', 'ENTREGADO'

    const itemActualizado = await Item.findByIdAndUpdate(id, { estado }, { new: true });
    if (!itemActualizado) return res.status(404).json({ message: 'Insumo no encontrado' });

    await DonationTrace.findOneAndUpdate(
      { itemId: id },
      { $push: { historialEstados: { estado, fecha: new Date() } } },
      { upsert: true }
    );

    return res.status(200).json(itemActualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar estado', error: error.message });
  }
};

// IMPORTANTE: Agregar updateItemStatus a las exportaciones
module.exports = { createItem, getItems, getItemById, updateItemStatus };