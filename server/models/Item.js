const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
  donanteId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El donante es obligatorio'],
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
    enum: ['DISPONIBLE', 'RESERVADO', 'ENTREGADO'],
    default: 'DISPONIBLE',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Item', ItemSchema);