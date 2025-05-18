const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
}, {
  tableName: "order",
  timestamps: true
});

module.exports = Order;
