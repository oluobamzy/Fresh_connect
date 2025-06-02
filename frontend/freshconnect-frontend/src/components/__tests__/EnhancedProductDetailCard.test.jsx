import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import EnhancedProductDetailCard from '../EnhancedProductDetailCard';
import { CartProvider } from '../CartContext';

// Mock Loader and Notification
jest.mock('../Loader', () => () => <div data-testid="loader">Loading...</div>);
jest.mock('../Notification', () => ({ type, message, onClose }) => (
  <div data-testid="notification">{message}</div>
));

describe('EnhancedProductDetailCard', () => {
  const product = {
    id: '1',
    name: 'Fresh Apples',
    description: 'Crisp and sweet apples from local farms.',
    category: 'Fruits',
    price: 3.5,
    quantityAvailable: 50,
    location: 'Springfield',
    farmerName: 'John Doe',
    images: [
      'https://images.unsplash.com/photo-apple1.jpg',
      'https://images.unsplash.com/photo-apple2.jpg',
      'https://images.unsplash.com/photo-apple3.jpg'
    ],
    rating: 4.5,
    reviews: [
      { id: 1, userId: 'user1', rating: 5, comment: 'Great apples!', date: '2025-05-01' },
      { id: 2, userId: 'user2', rating: 4, comment: 'Very fresh', date: '2025-05-02' }
    ]
  };

  function renderWithProviders(ui) {
    return render(
      <BrowserRouter>
        <ThemeProvider theme={createTheme()}>
          <CartProvider>{ui}</CartProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(product),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('navigates through product images', async () => {
    renderWithProviders(<EnhancedProductDetailCard productId="1" />);
    await waitFor(() => expect(screen.getByRole('img')).toBeInTheDocument());

    // Initial state: first image
    expect(screen.getByRole('img')).toHaveAttribute('src', product.images[0]);

    // Next image
    fireEvent.click(screen.getByTestId('next-image-btn'));
    expect(screen.getByRole('img')).toHaveAttribute('src', product.images[1]);

    // Next image again
    fireEvent.click(screen.getByTestId('next-image-btn'));
    expect(screen.getByRole('img')).toHaveAttribute('src', product.images[2]);

    // Back to second image
    fireEvent.click(screen.getByTestId('prev-image-btn'));
    expect(screen.getByRole('img')).toHaveAttribute('src', product.images[1]);
  });

  it('displays reviews section', async () => {
    renderWithProviders(<EnhancedProductDetailCard productId="1" />);
    await waitFor(() => expect(screen.getByText(/reviews/i)).toBeInTheDocument());

    expect(screen.getByText('Great apples!')).toBeInTheDocument();
    expect(screen.getByText('Very fresh')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument(); // Average rating
  });

  it('shows quantity selector when adding to cart', async () => {
    renderWithProviders(<EnhancedProductDetailCard productId="1" />);
    await waitFor(() => expect(screen.getByTestId('quantity-selector')).toBeInTheDocument());

    // Increase quantity
    fireEvent.click(screen.getByTestId('increase-quantity'));
    fireEvent.click(screen.getByTestId('increase-quantity'));
    expect(screen.getByTestId('quantity-value')).toHaveTextContent('3');

    // Decrease quantity
    fireEvent.click(screen.getByTestId('decrease-quantity'));
    expect(screen.getByTestId('quantity-value')).toHaveTextContent('2');

    // Add to cart with selected quantity
    fireEvent.click(screen.getByTestId('add-to-cart-btn'));
    expect(screen.getByTestId('notification')).toHaveTextContent('Added 2 items to cart!');
  });

  it('allows sharing the product', async () => {
    // Mock navigator.share
    const mockShare = jest.fn();
    global.navigator.share = mockShare;

    renderWithProviders(<EnhancedProductDetailCard productId="1" />);
    await waitFor(() => expect(screen.getByTestId('share-button')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('share-button'));
    expect(mockShare).toHaveBeenCalledWith({
      title: 'Fresh Apples',
      text: 'Check out Fresh Apples on FreshConnect!',
      url: expect.any(String)
    });
  });

  it('saves product to favorites', async () => {
    renderWithProviders(<EnhancedProductDetailCard productId="1" />);
    await waitFor(() => expect(screen.getByTestId('favorite-button')).toBeInTheDocument());

    // Initial state: not favorited
    expect(screen.getByTestId('favorite-button')).toHaveAttribute('aria-label', 'Add to favorites');

    // Click to favorite
    fireEvent.click(screen.getByTestId('favorite-button'));
    expect(screen.getByTestId('favorite-button')).toHaveAttribute('aria-label', 'Remove from favorites');
    expect(screen.getByTestId('notification')).toHaveTextContent('Added to favorites!');

    // Click again to unfavorite
    fireEvent.click(screen.getByTestId('favorite-button'));
    expect(screen.getByTestId('favorite-button')).toHaveAttribute('aria-label', 'Add to favorites');
    expect(screen.getByTestId('notification')).toHaveTextContent('Removed from favorites!');
  });
});
