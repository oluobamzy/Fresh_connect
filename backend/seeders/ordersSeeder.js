const { Order, User, Product } = require('../models');

/**
 * Seeds orders into the database
 */
async function seedOrders() {
  try {
    console.log('Seeding orders...');

    // Get users and products
    const consumer1 = await User.findOne({ where: { email: 'alice@example.com' } });
    const consumer2 = await User.findOne({ where: { email: 'bob@example.com' } });
    const farmer1 = await User.findOne({ where: { email: 'john@farm.com' } });
    const farmer2 = await User.findOne({ where: { email: 'maria@organicfarms.com' } });

    if (!consumer1 || !consumer2 || !farmer1 || !farmer2) {
      console.error('Required users not found. Run seedUsers first.');
      throw new Error('Required users not found. Run seedUsers first.');
    }

    // Get products
    const products = await Product.findAll();
    if (products.length === 0) {
      console.error('No products found. Run seedProducts first.');
      throw new Error('No products found. Run seedProducts first.');
    }

    const getRandomProduct = () => products[Math.floor(Math.random() * products.length)];

    const orders = [
      // Consumer 1's orders from Farmer 1
      {
        consumerId: consumer1.id,
        farmerId: farmer1.id,
        status: 'Delivered',
        paymentStatus: 'Paid',
        productItems: [
          {
            productId: getRandomProduct().id,
            name: getRandomProduct().name,
            price: getRandomProduct().price,
            quantity: 3,
            totalPrice: getRandomProduct().price * 3
          },
          {
            productId: getRandomProduct().id,
            name: getRandomProduct().name,
            price: getRandomProduct().price,
            quantity: 2,
            totalPrice: getRandomProduct().price * 2
          }
        ]
      },
      // Consumer 1's order from Farmer 2
      {
        consumerId: consumer1.id,
        farmerId: farmer2.id,
        status: 'Confirmed',
        paymentStatus: 'Paid',
        productItems: [
          {
            productId: getRandomProduct().id,
            name: getRandomProduct().name,
            price: getRandomProduct().price,
            quantity: 5,
            totalPrice: getRandomProduct().price * 5
          }
        ]
      },
      // Consumer 2's order from Farmer 1
      {
        consumerId: consumer2.id,
        farmerId: farmer1.id,
        status: 'Pending',
        paymentStatus: 'Pending',
        productItems: [
          {
            productId: getRandomProduct().id,
            name: getRandomProduct().name,
            price: getRandomProduct().price,
            quantity: 1,
            totalPrice: getRandomProduct().price
          }
        ]
      },
      // Consumer 2's order from Farmer 2
      {
        consumerId: consumer2.id,
        farmerId: farmer2.id,
        status: 'Cancelled',
        paymentStatus: 'Refunded',
        productItems: [
          {
            productId: getRandomProduct().id,
            name: getRandomProduct().name,
            price: getRandomProduct().price,
            quantity: 4,
            totalPrice: getRandomProduct().price * 4
          },
          {
            productId: getRandomProduct().id,
            name: getRandomProduct().name,
            price: getRandomProduct().price,
            quantity: 2,
            totalPrice: getRandomProduct().price * 2
          }
        ]
      }
    ];

    for (const orderData of orders) {
      await Order.create(orderData);
    }

    console.log('Orders seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding orders:', error);
    throw error;
  }
}

module.exports = seedOrders;
