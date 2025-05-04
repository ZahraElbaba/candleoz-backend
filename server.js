require('dotenv').config(); // Load environment variables
const express = require('express');
const sequelize = require('./db');
const User = require('./models/user'); // Load your user model
const authRoutes = require('./routes/authRoutes'); // Auth routes
const productRoutes = require('./routes/productRoutes'); // Product routes
const cors = require('cors');

const app = express();
app.use((cors()))

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes)

// Test route
app.get('/', (req, res) => {
  res.send('🔥 Candleoz Backend is alive');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔴 Global Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// DB sync and server start
sequelize.sync({ alter: true }) // Use { force: true } only during dev if needed
  .then(() => {
    console.log('✅ Database synced successfully.');
    app.listen(3000, () => {
      console.log('🚀 Server is running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('❌ Error syncing DB:', err);
  });
