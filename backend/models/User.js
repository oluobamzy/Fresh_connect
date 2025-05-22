const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('farmer', 'consumer', 'admin'), allowNull: false },
  foodPreferences: { type: DataTypes.JSONB, allowNull: true },
  paymentMethods: { type: DataTypes.JSONB, allowNull: true },
  farmDetails: { type: DataTypes.JSONB, allowNull: true },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = User;
