const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ForumPost = sequelize.define('ForumPost', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  replies: { type: DataTypes.JSONB, allowNull: true }, // [{userId, content, createdAt}]
  isModerated: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = ForumPost;
