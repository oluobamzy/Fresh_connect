const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecipeSuggestion = sequelize.define('RecipeSuggestion', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  productIds: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
  recipeText: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = RecipeSuggestion;
