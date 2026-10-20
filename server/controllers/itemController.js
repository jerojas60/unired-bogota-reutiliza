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
    const { localidad, colegio, categoria, talla, estado, misSolicitudes, moderacion } = req.query;

    const filtros = {};

    // 1. Si la petición viene desde la vista "Mis Solicitudes" del Beneficiario
    if (misSolicitudes === 'true') {
      filtros.beneficiarioId = req.user._id;
    } 
    // 2. Si la petición viene desde el panel de Moderación/Admin
    else if (moderacion === 'true') {
      if (estado) filtros.estado = estado; // Permite filtrar por PENDIENTE, RECHAZADO, RESERVADO, ENTREGADO, etc.
    } 
    // 3. Catálogo público por defecto
    else {
      if (localidad) filtros.localidad = localidad;
      if (colegio) filtros['detalles.colegio'] = colegio;
      if (categoria) filtros.categoria = categoria;
      if (talla) filtros['detalles.talla'] = talla;
      
      // Si no especifican estado en el catálogo, muestra los que están listos para solicitar
      filtros.estado = estado || 'DISPONIBLE';
    }

    const items = await Item.find(filtros)
      .populate('donanteId', 'nombre ubicacion telefono')
      .populate('beneficiarioId', 'nombre email')
      .sort({ createdAt: -1 });

    return res.status(200).json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los insumos', error: error.message });
  }
};

// @route GET /api/items/:id
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('donanteId', 'nombre ubicacion telefono')
      .populate('beneficiarioId', 'nombre email');

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
const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, comentarioRechazo, comentarioEntrega } = req.body; 

    let itemActualizado;

    // Si la intención es RESERVAR, aplicamos la regla de anti-acaparamiento y validación atómica
    if (estado === 'RESERVADO') {
      // 1. Validar que el beneficiario no tenga más de 3 insumos activos o entregados (Límite semestral)
      const reservasActivas = await Item.countDocuments({
        beneficiarioId: req.user._id,
        estado: { $in: ['RESERVADO', 'ENTREGADO'] }
      });

      if (reservasActivas >= 3) {
        return res.status(400).json({ 
          message: 'Has alcanzado el límite máximo de 3 insumos solicitados permitidos por periodo académico.' 
        });
      }

      // 2. Reserva atómica: solo si sigue disponible en este microsegundo
      itemActualizado = await Item.findOneAndUpdate(
        { _id: id, estado: 'DISPONIBLE' },
        { 
          estado: 'RESERVADO', 
          beneficiarioId: req.user._id 
        },
        { new: true }
      );

      if (!itemActualizado) {
        return res.status(400).json({ 
          message: 'El artículo ya no está disponible o fue reservado por otro usuario.' 
        });
      }
    } else {
      // Para otros cambios (Aprobar a DISPONIBLE, RECHAZADO con comentario, ENTREGADO, etc.)
      const updateData = { estado };
      if (comentarioRechazo) updateData.comentarioRechazo = comentarioRechazo;
      if (comentarioEntrega) updateData.comentarioEntrega = comentarioEntrega;

      itemActualizado = await Item.findByIdAndUpdate(id, updateData, { new: true });
      
      if (!itemActualizado) {
        return res.status(404).json({ message: 'Insumo no encontrado' });
      }
    }

    // Actualizamos el historial de trazabilidad automáticamente
    await DonationTrace.findOneAndUpdate(
      { itemId: id },
      { $push: { historialEstados: { estado, fecha: new Date() } } },
      { upsert: true }
    );

    return res.status(200).json(itemActualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar estado', error: error.message });
  }
};

module.exports = { createItem, getItems, getItemById, updateItemStatus };