const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  method: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  transactionId: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Payment;
