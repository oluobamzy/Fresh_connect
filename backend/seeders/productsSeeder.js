const { Product, User } = require('../models');

/**
 * Seeds products into the database
 */
async function seedProducts() {
  try {
    console.log('Seeding products...');

    // First get the farmer IDs
    const farmer1 = await User.findOne({ where: { email: 'john@farm.com' } });
    const farmer2 = await User.findOne({ where: { email: 'maria@organicfarms.com' } });

    if (!farmer1 || !farmer2) {
      console.error('Required farmer users not found. Run seedUsers first.');
      throw new Error('Required farmer users not found. Run seedUsers first.');
    }

    const products = [
      // Farmer 1's products
      {
        name: 'Fresh Organic Tomatoes',
        description: 'Vine-ripened organic tomatoes grown with natural farming methods. Perfect for salads and cooking.',
        category: 'Vegetables',
        price: 3.99,
        quantityAvailable: 100,
        location: 'Green Valley, CA',
        images: ['https://images.unsplash.com/photo-1524593166156-312f362cada0'],
        farmerId: farmer1.id,
        isActive: true
      },
      {
        name: 'Leafy Green Spinach',
        description: 'Nutrient-rich spinach leaves, perfect for salads or cooking.',
        category: 'Vegetables',
        price: 2.49,
        quantityAvailable: 75,
        location: 'Green Valley, CA',
        images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb'],
        farmerId: farmer1.id,
        isActive: true
      },
      {
        name: 'Fresh Sweet Corn',
        description: 'Sweet and tender corn on the cob, picked at peak freshness.',
        category: 'Vegetables',
        price: 0.99,
        quantityAvailable: 200,
        location: 'Green Valley, CA',
        images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076'],
        farmerId: farmer1.id,
        isActive: true
      },

      // Farmer 2's products
      {
        name: 'Organic Navel Oranges',
        description: 'Sweet, seedless oranges perfect for juicing or eating fresh.',
        category: 'Fruits',
        price: 4.99,
        quantityAvailable: 150,
        location: 'Riverside, CA',
        images: ['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12'],
        farmerId: farmer2.id,
        isActive: true
      },
      {
        name: 'Ripe Hass Avocados',
        description: 'Creamy, nutrient-dense avocados, perfect for guacamole or toast.',
        category: 'Fruits',
        price: 2.99,
        quantityAvailable: 120,
        location: 'Riverside, CA',
        images: ['https://images.unsplash.com/photo-1601039641847-7857b994d704'],
        farmerId: farmer2.id,
        isActive: true
      },
      {
        name: 'Fresh Strawberries',
        description: 'Sweet, juicy strawberries picked at peak ripeness.',
        category: 'Fruits',
        price: 5.99,
        quantityAvailable: 80,
        location: 'Riverside, CA',
        images: ['https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2'],
        farmerId: farmer2.id,
        isActive: true
      }
    ];

    for (const productData of products) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ 
        where: { 
          name: productData.name,
          farmerId: productData.farmerId
        } 
      });
      
      if (!existingProduct) {
        await Product.create(productData);
      } else {
        console.log(`Product "${productData.name}" by farmer ID ${productData.farmerId} already exists, skipping.`);
      }
    }

    console.log('Products seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

module.exports = seedProducts;
