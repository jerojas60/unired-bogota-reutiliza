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
    default: null,
  },
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
  },
  descripcion: { 
    type: String,
    default: '',
    trim: true,
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true,
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
      default: 'Comunidad UniRed',
    },
    instruccionesRecogida: { // 🌟 AÑADIDO PARA QUE MONGOOSE NO LO FILTRE
      type: String,
      default: '',
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
    default: 'PENDIENTE',
  },
  comentarioRechazo: {
    type: String,
    default: '',
  },
  comentarioEntrega: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ItemSchema.index({ localidad: 1, 'detalles.colegio': 1, estado: 1 });

module.exports = mongoose.model('Item', ItemSchema);