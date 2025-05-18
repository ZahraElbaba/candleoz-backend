const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Product = sequelize.define('product', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: DataTypes.STRING,
  image: DataTypes.STRING,
  price: DataTypes.DECIMAL
}, {
  timestamps: true
});

module.exports = Product;
