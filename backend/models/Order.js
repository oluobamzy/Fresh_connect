const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  status: { type: DataTypes.ENUM('Pending', 'Confirmed', 'Delivered', 'Cancelled'), defaultValue: 'Pending' },
  paymentStatus: { type: DataTypes.ENUM('Pending', 'Paid', 'Refunded'), defaultValue: 'Pending' },
  productItems: { type: DataTypes.JSONB, allowNull: false },
});

module.exports = Order;
