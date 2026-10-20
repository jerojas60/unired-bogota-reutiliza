const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
  donanteId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El donante es obligatorio'],
  },
  beneficiarioId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Guarda el ID del estudiante que solicita/reserva el insumo
  },
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
  },
  categoria: {
    type: String,
    enum: ['UNIFORME', 'UTILES'],
    required: true,
  },
  detalles: {
    genero: {
      type: String,
      enum: ['MASCULINO', 'FEMENINO', 'UNISEX'],
    },
    talla: {
      type: String,
    },
    estadoUso: {
      type: Number,
      min: 1,
      max: 5,
    },
    colegio: {
      type: String,
      required: [true, 'El colegio es obligatorio'],
    },
  },
  fotos: {
    type: [String],
    default: [],
  },
  localidad: {
    type: String,
    required: [true, 'La localidad es obligatoria'],
  },
  estado: {
    type: String,
    enum: ['PENDIENTE', 'DISPONIBLE', 'RECHAZADO', 'RESERVADO', 'ENTREGADO'],
    default: 'PENDIENTE', // Inicia en PENDIENTE para que pase primero por la moderación del admin
  },
  comentarioRechazo: {
    type: String,
    default: '', // Motivo que escribe el admin si rechaza el insumo
  },
  comentarioEntrega: {
    type: String,
    default: '', // Instrucciones del donante sobre dónde y cuándo recoger
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ÍNDICE COMPUESTO: Optimiza las consultas del catálogo por filtros combinados
ItemSchema.index({ localidad: 1, 'detalles.colegio': 1, estado: 1 });

module.exports = mongoose.model('Item', ItemSchema);