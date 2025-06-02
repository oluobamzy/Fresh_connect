const bcrypt = require('bcryptjs');
const { User } = require('../models');

/**
 * Seeds users into the database
 */
async function seedUsers() {
  try {
    console.log('Seeding users...');
    
    // Create default password hash
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create sample users
    const users = [
      // Admin
      {
        name: 'Admin User',
        email: 'admin@freshconnect.com',
        passwordHash,
        role: 'admin',
        isVerified: true,
        isActive: true
      },
      
      // Farmers
      {
        name: 'John Farmer',
        email: 'john@farm.com',
        passwordHash,
        role: 'farmer',
        farmDetails: {
          farmName: 'Green Valley Farm',
          location: 'Green Valley, CA',
          description: 'Family-owned organic farm specializing in fresh vegetables and fruits.',
          certifications: ['Organic', 'Sustainable'],
          farmSize: '25 acres',
          yearEstablished: 2010
        },
        isVerified: true,
        isActive: true
      },
      {
        name: 'Maria Rodriguez',
        email: 'maria@organicfarms.com',
        passwordHash,
        role: 'farmer',
        farmDetails: {
          farmName: 'Sunshine Organic Farms',
          location: 'Riverside, CA',
          description: 'Specializing in organic citrus fruits and avocados.',
          certifications: ['Organic', 'Non-GMO'],
          farmSize: '15 acres',
          yearEstablished: 2015
        },
        isVerified: true,
        isActive: true
      },
      
      // Consumers
      {
        name: 'Alice Consumer',
        email: 'alice@example.com',
        passwordHash,
        role: 'consumer',
        foodPreferences: {
          dietary: ['Vegetarian'],
          allergies: ['Nuts'],
          preferred: ['Organic', 'Local']
        },
        paymentMethods: {
          cards: [
            {
              type: 'Credit',
              last4: '1234',
              expiry: '12/26'
            }
          ]
        },
        isVerified: true,
        isActive: true
      },
      {
        name: 'Bob Martin',
        email: 'bob@example.com',
        passwordHash,
        role: 'consumer',
        foodPreferences: {
          dietary: ['Vegan'],
          allergies: ['Gluten'],
          preferred: ['Sustainable', 'Organic']
        },
        paymentMethods: {
          cards: [
            {
              type: 'Debit',
              last4: '5678',
              expiry: '06/25'
            }
          ]
        },
        isVerified: true,
        isActive: true
      }
    ];

    // Insert users
    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        await User.create(userData);
      } else {
        console.log(`User ${userData.email} already exists, skipping.`);
      }
    }

    console.log('Users seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

module.exports = seedUsers;
