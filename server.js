require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/ordersRoutes');
const sequelize = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/cart', cartRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🔥 Candleoz Backend is alive');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔴 Global Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Start server
const PORT = process.env.PORT || 8080;

// sequelize.sync({ alter: true }) // or { force: true } during development
//   .then(() => {
//     console.log('✅ All models were synchronized successfully.');
//   })
//   .catch(err => {
//     console.error('❌ Failed to sync models:', err);
//   });

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
