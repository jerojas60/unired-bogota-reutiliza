const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { nombre, email, password, rol, telefono, ubicacion, institucionEducativa } = req.body;

  
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (nombre, email, password)' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      nombre,
      email,
      passwordHash,
      rol: rol || 'user', // Por defecto asigna el rol 'user' si no viene especificado
      telefono: telefono || '',
      ubicacion: ubicacion || { localidad: 'Bogotá' }, // Valor por defecto opcional
      institucionEducativa: institucionEducativa || '',
    });

    return res.status(201).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// @route POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    return res.status(200).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      ubicacion: user.ubicacion,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// @route GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };