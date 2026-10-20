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
    required: [true, 'La categoría es obligatoria'],
    trim: true,
    // Quitamos el enum estricta para que acepte cualquier texto que mande el frontend ("Uniforme", "Útiles", etc.)
  },
  detalles: {
    genero: {
      type: String,
      default: 'UNISEX',
    },
    talla: {
      type: String,
      default: 'N/A',
    },
    estadoUso: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    colegio: {
      type: String,
      default: 'Comunidad UniRed', // Valor por defecto para que nunca falle si el formulario no lo envía
    },
  },
  fotos: {
    type: [String],
    default: [],
  },
  localidad: {
    type: String,
    required: [true, 'La localidad es obligatoria'],
    trim: true,
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