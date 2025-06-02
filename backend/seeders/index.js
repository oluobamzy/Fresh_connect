/**
 * Main seeder file that runs all seeders in correct order
 */
const sequelize = require('../config/database');
const seedUsers = require('./usersSeeder');
const seedProducts = require('./productsSeeder');
const seedOrders = require('./ordersSeeder');
const seedPayments = require('./paymentsSeeder');
const seedDisputes = require('./disputesSeeder');
const seedForumPosts = require('./forumSeeder');
const seedRecipes = require('./recipesSeeder');

async function seedAll() {
  try {
    // Test database connection
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection successful!');

    // Run seeders in order of dependencies
    await seedUsers();
    await seedProducts();
    await seedOrders();
    await seedPayments();
    await seedDisputes();
    await seedForumPosts();
    await seedRecipes();

    console.log('✅ All seeders completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  seedAll();
}

module.exports = seedAll;
