const { Payment, Order } = require('../models');

/**
 * Seeds payments into the database
 */
async function seedPayments() {
  try {
    console.log('Seeding payments...');

    // Get orders
    const orders = await Order.findAll();
    if (orders.length === 0) {
      console.error('No orders found. Run seedOrders first.');
      throw new Error('No orders found. Run seedOrders first.');
    }

    for (const order of orders) {
      // Skip if order payment status is not 'Paid'
      if (order.paymentStatus !== 'Paid' && order.paymentStatus !== 'Refunded') {
        continue;
      }
      
      // Calculate total amount from order items
      let totalAmount = 0;
      if (order.productItems && Array.isArray(order.productItems)) {
        totalAmount = order.productItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      }
      
      // Define payment data
      const paymentData = {
        orderId: order.id,
        amount: totalAmount,
        method: Math.random() > 0.5 ? 'Credit Card' : 'PayPal',
        status: order.paymentStatus === 'Refunded' ? 'Refunded' : 'Completed',
        transactionId: `trx-${Math.floor(Math.random() * 100000)}-${Date.now()}`
      };
      
      // Check if payment already exists for this order
      const existingPayment = await Payment.findOne({ where: { orderId: order.id } });
      if (!existingPayment) {
        await Payment.create(paymentData);
      } else {
        console.log(`Payment for order ID ${order.id} already exists, skipping.`);
      }
    }

    console.log('Payments seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding payments:', error);
    throw error;
  }
}

module.exports = seedPayments;
