const { ForumPost, User } = require('../models');

/**
 * Seeds forum posts into the database
 */
async function seedForumPosts() {
  try {
    console.log('Seeding forum posts...');

    // Get users
    const admin = await User.findOne({ where: { email: 'admin@freshconnect.com' } });
    const consumer1 = await User.findOne({ where: { email: 'alice@example.com' } });
    const consumer2 = await User.findOne({ where: { email: 'bob@example.com' } });
    const farmer1 = await User.findOne({ where: { email: 'john@farm.com' } });
    const farmer2 = await User.findOne({ where: { email: 'maria@organicfarms.com' } });

    if (!admin || !consumer1 || !consumer2 || !farmer1 || !farmer2) {
      console.error('Required users not found. Run seedUsers first.');
      throw new Error('Required users not found. Run seedUsers first.');
    }

    const forumPosts = [
      {
        title: 'Welcome to FreshConnect Community!',
        content: 'Hello everyone, welcome to our farming community! Feel free to share your experiences and ask questions.',
        userId: admin.id,
        category: 'Announcements',
        tags: ['welcome', 'community']
      },
      {
        title: 'Tips for Starting a Home Garden',
        content: 'I\'ve been farming for 10 years and wanted to share some tips for beginners: 1. Start small, 2. Choose easy crops, 3. Prepare your soil properly.',
        userId: farmer1.id,
        category: 'Gardening',
        tags: ['gardening', 'tips', 'beginners']
      },
      {
        title: 'Best Organic Farming Practices',
        content: 'Organic farming is all about sustainability. Here\'s how we maintain our organic certification and keep our soil healthy year after year...',
        userId: farmer2.id,
        category: 'Organic',
        tags: ['organic', 'certification', 'sustainability']
      },
      {
        title: 'Looking for Pesticide-Free Berries',
        content: 'Can anyone recommend a farmer who grows pesticide-free berries in the Los Angeles area?',
        userId: consumer1.id,
        category: 'Questions',
        tags: ['berries', 'pesticide-free', 'local']
      },
      {
        title: 'Recipe Exchange: What to Cook with Seasonal Veggies',
        content: 'I\'ve got lots of summer squash and don\'t know what to do with it all. Anyone have good recipes to share?',
        userId: consumer2.id,
        category: 'Recipes',
        tags: ['seasonal', 'recipes', 'summer']
      }
    ];

    for (const postData of forumPosts) {
      // Check if post already exists
      const existingPost = await ForumPost.findOne({ 
        where: { 
          title: postData.title,
          userId: postData.userId
        } 
      });
      
      if (!existingPost) {
        await ForumPost.create(postData);
      } else {
        console.log(`Forum post "${postData.title}" by user ID ${postData.userId} already exists, skipping.`);
      }
    }

    console.log('Forum posts seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding forum posts:', error);
    throw error;
  }
}

module.exports = seedForumPosts;
