require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const traceRoutes = require('./routes/traceRoutes');

connectDB();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});