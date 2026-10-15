const mongoose = require('mongoose');
const { Schema } = mongoose;

const HistorialEstadoSchema = new Schema(
  {
    estado: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } 
);

const DonationTraceSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'El item es obligatorio'],
  },
  donanteId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El donante es obligatorio'],
  },
  beneficiarioId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  historialEstados: {
    type: [HistorialEstadoSchema],
    default: [],
  },
  confirmacionRecepcion: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('DonationTrace', DonationTraceSchema);