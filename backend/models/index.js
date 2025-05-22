const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Payment = require('./Payment');
const ForumPost = require('./ForumPost');
const RecipeSuggestion = require('./RecipeSuggestion');
const Dispute = require('./Dispute');

// Associations
typeof User.hasMany === 'function' && User.hasMany(Order, { foreignKey: 'consumerId' });
typeof User.hasMany === 'function' && User.hasMany(Product, { foreignKey: 'farmerId' });
typeof Product.hasMany === 'function' && Product.hasMany(Order, { foreignKey: 'productId' });
typeof Order.belongsTo === 'function' && Order.belongsTo(User, { as: 'consumer', foreignKey: 'consumerId' });
typeof Order.belongsTo === 'function' && Order.belongsTo(User, { as: 'farmer', foreignKey: 'farmerId' });
typeof Order.belongsTo === 'function' && Order.belongsTo(Product, { foreignKey: 'productId' });
typeof Payment.belongsTo === 'function' && Payment.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = { User, Product, Order, Payment, ForumPost, RecipeSuggestion, Dispute };
