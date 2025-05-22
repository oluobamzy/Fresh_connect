import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RecipeSuggestions from '../Community/RecipeSuggestions';
import RecipeService from '../../services/RecipeService';

// Mock the RecipeService
jest.mock('../../services/RecipeService');

describe('RecipeSuggestions Component', () => {
  const mockRecipes = [
    {
      id: 'recipe-001',
      title: 'Garden Fresh Salad',
      description: 'A refreshing salad with locally grown vegetables',
      ingredients: ['2 cups mixed greens', '1 ripe tomato, diced'],
      instructions: ['Wash and dry all produce thoroughly', 'Combine ingredients'],
      prepTime: '10 minutes',
      difficulty: 'Easy',
      tags: ['vegetarian', 'vegan', 'salad', 'quick'],
      imageUrl: 'https://example.com/salad.jpg',
      relatedProducts: ['prod-tomato', 'prod-cucumber', 'prod-lettuce']
    },
    {
      id: 'recipe-002',
      title: 'Farmhouse Beef Stew',
      description: 'A hearty beef stew with root vegetables',
      ingredients: ['1 lb grass-fed beef chuck, cubed', '2 tbsp olive oil'],
      instructions: ['Season beef with salt and pepper', 'Brown beef on all sides'],
      prepTime: '2.5 hours',
      difficulty: 'Medium',
      tags: ['beef', 'dinner', 'winter', 'comfort food'],
      imageUrl: 'https://example.com/stew.jpg',
      relatedProducts: ['prod-beef', 'prod-carrot', 'prod-potato']
    }
  ];

  beforeEach(() => {
    RecipeService.getRecipeSuggestions.mockResolvedValue(mockRecipes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders recipe suggestions', async () => {
    render(<RecipeSuggestions />);

    // Check for loading state
    expect(screen.getByText(/finding delicious recipes/i)).toBeInTheDocument();

    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText('Garden Fresh Salad')).toBeInTheDocument();
      expect(screen.getByText('Farmhouse Beef Stew')).toBeInTheDocument();
    });

    // Check if descriptions are displayed
    expect(screen.getByText('A refreshing salad with locally grown vegetables')).toBeInTheDocument();
    expect(screen.getByText('A hearty beef stew with root vegetables')).toBeInTheDocument();
  });

  test('allows viewing recipe details', async () => {
    render(<RecipeSuggestions />);

    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText('Garden Fresh Salad')).toBeInTheDocument();
    });

    // Click on "View Recipe" button for the first recipe
    const viewButtons = screen.getAllByText('View Recipe');
    fireEvent.click(viewButtons[0]);

    // Check if the dialog is displayed with recipe details
    await waitFor(() => {
      expect(screen.getByText('Ingredients')).toBeInTheDocument();
      expect(screen.getByText('Instructions')).toBeInTheDocument();
      expect(screen.getByText('2 cups mixed greens')).toBeInTheDocument();
      expect(screen.getByText('Wash and dry all produce thoroughly')).toBeInTheDocument();
    });

    // Close the dialog to clean up
    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);

    // Verify dialog is closed
    await waitFor(() => {
      expect(screen.queryByText('Ingredients')).not.toBeInTheDocument();
    });
  });

  test('handles empty state when no recipes are available', async () => {
    // Mock an empty response
    RecipeService.getRecipeSuggestions.mockResolvedValue([]);
    
    render(<RecipeSuggestions />);

    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText(/We're working on new recipe suggestions for you!/i)).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    // Mock an error response
    RecipeService.getRecipeSuggestions.mockRejectedValue(new Error('Failed to fetch recipes'));
    
    render(<RecipeSuggestions />);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to load recipe suggestions/i)).toBeInTheDocument();
    });
  });
});
