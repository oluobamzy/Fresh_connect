const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dispute = sequelize.define('Dispute', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('Open', 'Resolved', 'Escalated'), defaultValue: 'Open' },
  adminNotes: { type: DataTypes.TEXT, allowNull: true },
});

module.exports = Dispute;
