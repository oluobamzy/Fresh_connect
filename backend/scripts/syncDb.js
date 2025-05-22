// Script to sync Sequelize models with the database
const sequelize = require('../config/database');
require('../models');

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Database sync failed:', err);
    process.exit(1);
  }
})();
