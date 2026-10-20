const Item = require('../models/Item');
const DonationTrace = require('../models/DonationTrace');

// @route POST /api/items
const createItem = async (req, res) => {
  try {
    const title = req.body.title || req.body.titulo;
    const category = req.body.category || req.body.categoria;
    const size = req.body.size || req.body.talla;
    const localidad = req.body.localidad || req.body.locality;
    const description = req.body.description || req.body.descripcion;
    const image = req.body.image || req.body.foto;
    

    const instruccionesRecogida = req.body.instruccionesRecogida || req.body.puntoRecogida || '';

    if (!title || !category || !localidad) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (title, category, localidad)' });
    }

const item = await Item.create({
      donanteId: req.user._id,
      titulo: title,
      categoria: category,
      detalles: {
        talla: size || 'N/A',
        colegio: 'Comunidad UniRed',
        instruccionesRecogida: instruccionesRecogida
      },
      comentarioEntrega: instruccionesRecogida, 
      descripcion: description || '',
      fotos: image ? [image] : [],
      localidad,
      estado: 'PENDIENTE'
    });

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
    const { localidad, colegio, categoria, talla, estado, misSolicitudes, misDonaciones, moderacion } = req.query;

    const filtros = {};

    // 1. Si la petición viene desde "Mis Solicitudes"
    if (misSolicitudes === 'true') {
      if (!req.user) {
        return res.status(401).json({ message: 'Debes iniciar sesión para ver tus solicitudes' });
      }
      filtros.beneficiarioId = req.user._id;
    } 
    // 2. Si la petición viene desde "Mis Donaciones"
    else if (misDonaciones === 'true') {
      if (!req.user) {
        return res.status(401).json({ message: 'Debes iniciar sesión para ver tus donaciones' });
      }
      filtros.donanteId = req.user._id;
    }
    // 3. Panel de Moderación
    else if (moderacion === 'true') {
      if (estado) filtros.estado = estado;
    } 
    // 4. Catálogo público por defecto
    else {
      if (localidad) filtros.localidad = localidad;
      if (colegio) filtros['detalles.colegio'] = colegio;
      if (categoria) filtros.categoria = categoria;
      if (talla) filtros['detalles.talla'] = talla;
      
      filtros.estado = estado || 'DISPONIBLE';
    }

    const items = await Item.find(filtros)
      .populate('donanteId', 'nombre ubicacion telefono email')
      .populate('beneficiarioId', 'nombre email')
      .sort({ createdAt: -1 });

    const itemsFormateados = items.map(item => ({
      _id: item._id,
      id: item._id,
      title: item.titulo,
      titulo: item.titulo,
      category: item.categoria,
      categoria: item.categoria,
      localidad: item.localidad,
      locality: item.localidad,
      description: item.descripcion,
      descripcion: item.descripcion,
      size: item.detalles?.talla || 'N/A',
      talla: item.detalles?.talla || 'N/A',
      image: item.fotos && item.fotos.length > 0 ? item.fotos[0] : '',
      fotos: item.fotos,
      estado: item.estado,
      detalles: item.detalles,
      comentarioEntrega: item.comentarioEntrega || '',
      comentarioRechazo: item.comentarioRechazo || '',
      donanteId: item.donanteId,
      beneficiarioId: item.beneficiarioId,
      createdAt: item.createdAt
    }));

    return res.status(200).json(itemsFormateados);
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

    // Si la intención explícita es RESERVAR (por parte del beneficiario)
    if (estado === 'RESERVADO') {
      // 1. Validar límite de 3 insumos activos o entregados por periodo académico
      const reservasActivas = await Item.countDocuments({
        beneficiarioId: req.user._id,
        estado: { $in: ['RESERVADO', 'ENTREGADO'] }
      });

      if (reservasActivas >= 3) {
        return res.status(400).json({ 
          message: 'Has alcanzado el límite máximo de 3 insumos solicitados permitidos por periodo académico.' 
        });
      }

      // 2. Reserva atómica: solo si sigue disponible
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
      // Para otros cambios (Aprobar, Rechazar, o que el donante agregue el comentario de entrega)
      const updateData = {};
      if (estado) updateData.estado = estado;
      if (comentarioRechazo !== undefined) updateData.comentarioRechazo = comentarioRechazo;
      if (comentarioEntrega !== undefined) updateData.comentarioEntrega = comentarioEntrega;

      itemActualizado = await Item.findByIdAndUpdate(id, updateData, { new: true });
      
      if (!itemActualizado) {
        return res.status(404).json({ message: 'Insumo no encontrado' });
      }
    }

    // Actualizamos el historial de trazabilidad automáticamente si hubo cambio de estado o acción relevante
    const estadoTrazabilidad = estado || itemActualizado.estado;
    await DonationTrace.findOneAndUpdate(
      { itemId: id },
      { $push: { historialEstados: { estado: estadoTrazabilidad, fecha: new Date() } } },
      { upsert: true }
    );

    return res.status(200).json(itemActualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar estado', error: error.message });
  }
};

module.exports = { createItem, getItems, getItemById, updateItemStatus };