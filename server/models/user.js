const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'El hash de la contraseña es obligatorio'],
  },
  rol: {
    type: String,
    enum: ['DONANTE', 'BENEFICIARIO', 'ADMIN'],
    required: true,
    default: 'DONANTE',
  },
  telefono: {
    type: String,
  },
  ubicacion: {
    localidad: {
      type: String,
      required: [true, 'La localidad es obligatoria'],
    },
    barrio: {
      type: String,
    },
  },
  institucionEducativa: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);