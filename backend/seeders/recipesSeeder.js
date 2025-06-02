const { RecipeSuggestion, User } = require('../models');

/**
 * Seeds recipe suggestions into the database
 */
async function seedRecipes() {
  try {
    console.log('Seeding recipe suggestions...');

    // Get users
    const admin = await User.findOne({ where: { email: 'admin@freshconnect.com' } });
    const farmer1 = await User.findOne({ where: { email: 'john@farm.com' } });
    const farmer2 = await User.findOne({ where: { email: 'maria@organicfarms.com' } });

    if (!admin || !farmer1 || !farmer2) {
      console.error('Required users not found. Run seedUsers first.');
      throw new Error('Required users not found. Run seedUsers first.');
    }

    const recipes = [
      {
        title: 'Fresh Tomato Pasta',
        ingredients: ['2 cups cherry tomatoes', '3 cloves garlic', '1/4 cup olive oil', '8 oz pasta', 'Fresh basil', 'Salt and pepper'],
        instructions: 'Sauté garlic in olive oil. Add halved cherry tomatoes and cook until soft. Toss with cooked pasta and fresh basil.',
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficultyLevel: 'Easy',
        createdBy: farmer1.id,
        tags: ['quick', 'vegetarian', 'pasta'],
        imageUrl: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb'
      },
      {
        title: 'Simple Avocado Toast',
        ingredients: ['1 ripe avocado', '2 slices whole grain bread', 'Lemon juice', 'Red pepper flakes', 'Salt', 'Optional: eggs for topping'],
        instructions: 'Toast bread. Mash avocado with lemon juice and salt. Spread on toast and top with red pepper flakes and optional eggs.',
        prepTime: 5,
        cookTime: 5,
        servings: 2,
        difficultyLevel: 'Easy',
        createdBy: farmer2.id,
        tags: ['breakfast', 'quick', 'healthy'],
        imageUrl: 'https://images.unsplash.com/photo-1588137378133-f469d4a15a35'
      },
      {
        title: 'Fresh Corn Salad',
        ingredients: ['4 ears corn', '1 red bell pepper', '1/2 red onion', '1/4 cup olive oil', '2 tbsp lime juice', 'Salt and pepper', 'Fresh cilantro'],
        instructions: 'Cut corn kernels from cobs. Dice bell pepper and onion. Combine all ingredients in a bowl. Add lime juice, olive oil, salt and pepper. Toss and garnish with cilantro.',
        prepTime: 15,
        cookTime: 0,
        servings: 6,
        difficultyLevel: 'Easy',
        createdBy: farmer1.id,
        tags: ['salad', 'summer', 'no-cook'],
        imageUrl: 'https://images.unsplash.com/photo-1615887151146-9f9e5a7b935b'
      },
      {
        title: 'Citrus Fruit Salad',
        ingredients: ['2 oranges', '2 grapefruits', '1 lime', '2 tbsp honey', 'Fresh mint'],
        instructions: 'Peel and segment citrus fruits. Combine in a bowl. Drizzle with honey and garnish with mint leaves.',
        prepTime: 15,
        cookTime: 0,
        servings: 4,
        difficultyLevel: 'Easy',
        createdBy: farmer2.id,
        tags: ['fruit', 'breakfast', 'dessert'],
        imageUrl: 'https://images.unsplash.com/photo-1590590470233-195e8f23dddb'
      },
      {
        title: 'Seasonal Vegetable Soup',
        ingredients: ['Assorted seasonal vegetables', '1 onion', '2 cloves garlic', '6 cups vegetable broth', 'Herbs of choice', 'Salt and pepper'],
        instructions: 'Chop all vegetables. Sauté onion and garlic. Add remaining vegetables and broth. Simmer until vegetables are tender. Season with herbs, salt, and pepper.',
        prepTime: 20,
        cookTime: 30,
        servings: 8,
        difficultyLevel: 'Medium',
        createdBy: admin.id,
        tags: ['soup', 'vegetarian', 'seasonal'],
        imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd'
      }
    ];

    for (const recipeData of recipes) {
      // Check if recipe already exists
      const existingRecipe = await RecipeSuggestion.findOne({ 
        where: { 
          title: recipeData.title,
          createdBy: recipeData.createdBy
        } 
      });
      
      if (!existingRecipe) {
        await RecipeSuggestion.create(recipeData);
      } else {
        console.log(`Recipe "${recipeData.title}" by user ID ${recipeData.createdBy} already exists, skipping.`);
      }
    }

    console.log('Recipe suggestions seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding recipes:', error);
    throw error;
  }
}

module.exports = seedRecipes;
