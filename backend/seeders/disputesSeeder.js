const { Dispute, Order, User } = require('../models');

/**
 * Seeds disputes into the database
 */
async function seedDisputes() {
  try {
    console.log('Seeding disputes...');

    // Get completed/canceled orders and admin user
    const orders = await Order.findAll({
      where: {
        status: ['Delivered', 'Cancelled']
      }
    });
    
    if (orders.length === 0) {
      console.log('No completed or cancelled orders found. No disputes to create.');
      return true;
    }

    const admin = await User.findOne({ where: { role: 'admin' } });

    // Create disputes for 20% of completed/canceled orders
    for (const order of orders) {
      // Only create disputes for 20% of orders randomly
      if (Math.random() > 0.2) continue;
      
      const consumer = await User.findByPk(order.consumerId);
      if (!consumer) continue;

      // Define dispute data
      const status = Math.random() > 0.6 ? 'Open' : (Math.random() > 0.5 ? 'Resolved' : 'Escalated');
      
      const disputeData = {
        userId: consumer.id,
        orderId: order.id,
        description: getRandomDisputeReason(order.status),
        status,
        adminNotes: status !== 'Open' ? getRandomAdminNote(status) : null
      };
      
      // Check if dispute already exists for this order
      const existingDispute = await Dispute.findOne({ where: { orderId: order.id } });
      if (!existingDispute) {
        await Dispute.create(disputeData);
      } else {
        console.log(`Dispute for order ID ${order.id} already exists, skipping.`);
      }
    }

    console.log('Disputes seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding disputes:', error);
    throw error;
  }
}

/**
 * Generate a random dispute reason based on order status
 */
function getRandomDisputeReason(orderStatus) {
  const deliveredDisputes = [
    'The produce I received was damaged or spoiled.',
    'Items were missing from my order.',
    'I received the wrong items.',
    'The quality of produce was not as described.',
    'The delivery was extremely late and produce was warm.'
  ];
  
  const cancelledDisputes = [
    'My order was cancelled without explanation.',
    'I was charged despite order cancellation.',
    'The farmer cancelled too close to delivery time.',
    'I requested a specific delivery time but my request was ignored.'
  ];
  
  const disputeArray = orderStatus === 'Delivered' ? deliveredDisputes : cancelledDisputes;
  return disputeArray[Math.floor(Math.random() * disputeArray.length)];
}

/**
 * Generate a random admin note based on dispute status
 */
function getRandomAdminNote(status) {
  const resolvedNotes = [
    'Issue resolved with full refund.',
    'Replacement product sent to customer.',
    'Farmer provided partial refund for quality issues.',
    'Misunderstanding cleared after farmer provided delivery evidence.'
  ];
  
  const escalatedNotes = [
    'Customer not satisfied with farmer response. Escalated to review board.',
    'Multiple quality issues reported. Need to review farm certification.',
    'Ongoing issue with this farmer. Scheduling inspection visit.',
    'Third complaint this month. Considering temporary suspension.'
  ];
  
  const notesArray = status === 'Resolved' ? resolvedNotes : escalatedNotes;
  return notesArray[Math.floor(Math.random() * notesArray.length)];
}

module.exports = seedDisputes;
