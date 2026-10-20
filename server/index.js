require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const traceRoutes = require('./routes/traceRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/trace', traceRoutes);

app.get('/', (req, res) => {
  res.send('API UniRed Bogotá Reutiliza funcionando 🚀');
});

// Función para crear el admin por defecto para los jurados
const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@unired.edu.co';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Admin123*', salt);

      await User.create({
        nombre: 'Administrador UniRed',
        email: adminEmail,
        passwordHash,
        rol: 'ADMIN',
        ubicacion: { localidad: 'Bogotá' }
      });
      console.log('👑 Usuario administrador listo: admin@unired.edu.co / Admin123*');
    }
  } catch (error) {
    console.error('Error al verificar/crear el admin por defecto:', error.message);
  }
};

const PORT = process.env.PORT || 5000;

// Inicializamos la conexión a DB y luego creamos el admin y encendemos el puerto
const startServer = async () => {
  try {
    await connectDB();
    await createDefaultAdmin();
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
  }
};

startServer();