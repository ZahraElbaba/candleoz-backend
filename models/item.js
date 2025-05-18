const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Order = require('./orders');

const Item = sequelize.define('item', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: "item",
  timestamps: true
});

Order.hasMany(Item, { foreignKey: 'orderId', onDelete: 'CASCADE' });
Item.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = Item;
