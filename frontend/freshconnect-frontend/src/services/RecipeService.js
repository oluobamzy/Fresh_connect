// Service for recipe suggestions API
import axios from 'axios';

// Base API URL - would be configured from environment in production
const API_URL = 'http://localhost:3000/api';

class RecipeService {
  // Get recipe suggestions based on purchased products
  async getRecipeSuggestions(productIds = []) {
    try {
      // This would be a real API call in production
      // return await axios.get(`${API_URL}/recipes/suggestions`, { params: { productIds } });
      
      // For development, return mock data
      return this.getMockRecipeSuggestions(productIds);
    } catch (error) {
      console.error('Error fetching recipe suggestions:', error);
      throw error;
    }
  }

  // Mock data for development
  async getMockRecipeSuggestions(productIds) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock recipes database
    const allRecipes = [
      {
        id: 'recipe-001',
        title: 'Garden Fresh Salad',
        description: 'A refreshing salad with locally grown vegetables',
        ingredients: [
          '2 cups mixed greens',
          '1 ripe tomato, diced',
          '1 cucumber, sliced',
          '1/4 red onion, thinly sliced',
          '1/2 avocado, diced',
          '2 tbsp olive oil',
          '1 tbsp balsamic vinegar',
          'Salt and pepper to taste'
        ],
        instructions: [
          'Wash and dry all produce thoroughly',
          'Combine greens, tomato, cucumber, and red onion in a large bowl',
          'Add diced avocado',
          'Drizzle with olive oil and balsamic vinegar',
          'Season with salt and pepper, toss gently, and serve immediately'
        ],
        prepTime: '10 minutes',
        difficulty: 'Easy',
        tags: ['vegetarian', 'vegan', 'salad', 'quick'],
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1500',
        relatedProducts: ['prod-tomato', 'prod-cucumber', 'prod-lettuce', 'prod-avocado']
      },
      {
        id: 'recipe-002',
        title: 'Farmhouse Beef Stew',
        description: 'A hearty beef stew with root vegetables',
        ingredients: [
          '1 lb grass-fed beef chuck, cubed',
          '2 tbsp olive oil',
          '1 large onion, diced',
          '3 carrots, sliced',
          '2 potatoes, cubed',
          '2 cloves garlic, minced',
          '2 cups beef broth',
          '1 cup red wine (optional)',
          'Fresh thyme and rosemary',
          'Salt and pepper to taste'
        ],
        instructions: [
          'Season beef with salt and pepper',
          'Heat oil in a large pot over medium-high heat',
          'Brown beef on all sides, then remove from pot',
          'Add onions and garlic to the pot, sauté until soft',
          'Add carrots and potatoes, cook for 5 minutes',
          'Return beef to the pot, add broth, wine, and herbs',
          'Bring to a boil, then reduce heat and simmer for 1.5-2 hours until meat is tender',
          'Adjust seasoning and serve hot'
        ],
        prepTime: '2.5 hours',
        difficulty: 'Medium',
        tags: ['beef', 'dinner', 'winter', 'comfort food'],
        imageUrl: 'https://images.unsplash.com/photo-1608500218890-c4cf6b09b823?auto=format&fit=crop&w=1500',
        relatedProducts: ['prod-beef', 'prod-carrot', 'prod-potato', 'prod-onion']
      },
      {
        id: 'recipe-003',
        title: 'Berry Breakfast Smoothie',
        description: 'A nutritious smoothie with fresh berries and yogurt',
        ingredients: [
          '1 cup mixed berries (strawberries, blueberries, raspberries)',
          '1 banana',
          '1/2 cup Greek yogurt',
          '1/4 cup milk or plant-based alternative',
          '1 tbsp honey or maple syrup',
          '1/2 tsp vanilla extract',
          'Ice cubes (optional)'
        ],
        instructions: [
          'Add all ingredients to a blender',
          'Blend until smooth and creamy',
          'Add more liquid if needed to reach desired consistency',
          'Pour into a glass and enjoy immediately'
        ],
        prepTime: '5 minutes',
        difficulty: 'Easy',
        tags: ['breakfast', 'quick', 'healthy', 'smoothie'],
        imageUrl: 'https://images.unsplash.com/photo-1553530666-090fc9e40f58?auto=format&fit=crop&w=1500',
        relatedProducts: ['prod-strawberry', 'prod-blueberry', 'prod-yogurt', 'prod-honey']
      },
      {
        id: 'recipe-004',
        title: 'Roasted Vegetable Medley',
        description: 'Colorful roasted seasonal vegetables with herbs',
        ingredients: [
          '1 zucchini, sliced',
          '1 bell pepper, chopped',
          '1 red onion, cut into wedges',
          '2 cups cherry tomatoes',
          '2 tbsp olive oil',
          '2 cloves garlic, minced',
          'Fresh herbs (rosemary, thyme)',
          'Salt and pepper to taste',
          'Balsamic glaze for drizzling'
        ],
        instructions: [
          'Preheat oven to 425°F (220°C)',
          'Combine all vegetables in a large bowl',
          'Add olive oil, garlic, herbs, salt, and pepper; toss to coat',
          'Spread in a single layer on a baking sheet',
          'Roast for 25-30 minutes, stirring halfway through',
          'Drizzle with balsamic glaze before serving'
        ],
        prepTime: '40 minutes',
        difficulty: 'Easy',
        tags: ['vegetarian', 'vegan', 'side dish', 'healthy'],
        imageUrl: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=1500',
        relatedProducts: ['prod-zucchini', 'prod-pepper', 'prod-tomato', 'prod-onion']
      },
      {
        id: 'recipe-005',
        title: 'Farm Fresh Frittata',
        description: 'A versatile egg dish with fresh vegetables',
        ingredients: [
          '8 large eggs',
          '1/4 cup milk',
          '1 cup diced vegetables (bell peppers, spinach, mushrooms)',
          '1/2 cup shredded cheese',
          '1/4 cup chopped fresh herbs',
          '2 tbsp olive oil',
          'Salt and pepper to taste'
        ],
        instructions: [
          'Preheat oven to 375°F (190°C)',
          'Whisk together eggs and milk in a bowl; season with salt and pepper',
          'Heat olive oil in an oven-safe skillet over medium heat',
          'Sauté vegetables until softened',
          'Pour egg mixture over vegetables',
          'Cook until edges begin to set, about 3-4 minutes',
          'Sprinkle with cheese and transfer to oven',
          'Bake for 15-20 minutes until eggs are set and top is golden',
          'Let cool slightly before slicing and serving'
        ],
        prepTime: '30 minutes',
        difficulty: 'Medium',
        tags: ['breakfast', 'brunch', 'vegetarian', 'high-protein'],
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1500',
        relatedProducts: ['prod-eggs', 'prod-spinach', 'prod-mushroom', 'prod-cheese']
      }
    ];

    // Filter recipes based on productIds or return all if no IDs provided
    if (productIds && productIds.length > 0) {
      // In a real app, we'd have a more sophisticated matching algorithm
      return allRecipes.filter(recipe => 
        recipe.relatedProducts.some(prod => productIds.includes(prod))
      );
    }
    
    return allRecipes;
  }
}

export default new RecipeService();
