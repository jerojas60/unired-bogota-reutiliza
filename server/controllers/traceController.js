const Item = require('../models/Item');
const DonationTrace = require('../models/DonationTrace');

// @route PUT /api/trace/reserve/:itemId
const reserveItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    if (item.estado !== 'DISPONIBLE') {
      return res.status(400).json({ message: 'El insumo ya no está disponible' });
    }

    item.estado = 'RESERVADO';
    await item.save();

    const trace = await DonationTrace.findOne({ itemId });
    if (!trace) {
      return res.status(404).json({ message: 'Trazabilidad no encontrada' });
    }

    trace.beneficiarioId = req.user._id;
    trace.historialEstados.push({ estado: 'RESERVADO', fecha: new Date() });
    await trace.save();

    return res.status(200).json({ item, trace });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al reservar el insumo', error: error.message });
  }
};

// @route PUT /api/trace/confirm/:itemId
const confirmDelivery = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    if (item.estado !== 'RESERVADO') {
      return res.status(400).json({ message: 'El insumo debe estar reservado para confirmar la entrega' });
    }

    item.estado = 'ENTREGADO';
    await item.save();

    const trace = await DonationTrace.findOne({ itemId });
    if (!trace) {
      return res.status(404).json({ message: 'Trazabilidad no encontrada' });
    }

    trace.confirmacionRecepcion = true;
    trace.historialEstados.push({ estado: 'ENTREGADO', fecha: new Date() });
    await trace.save();

    return res.status(200).json({ item, trace });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al confirmar la entrega', error: error.message });
  }
};

module.exports = { reserveItem, confirmDelivery };