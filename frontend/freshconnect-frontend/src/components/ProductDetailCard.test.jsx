import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProductDetailCard from './ProductDetailCard';
import { CartProvider } from './CartContext.jsx';

// Mock Loader and Notification
jest.mock('./Loader', () => () => <div data-testid="loader">Loading...</div>);
jest.mock('./Notification', () => ({ type, message, onClose }) => (
  <div data-testid="notification">{message}</div>
));

describe('ProductDetailCard', () => {
  const product = {
    id: '1',
    name: 'Fresh Apples',
    description: 'Crisp and sweet apples from local farms.',
    category: 'Fruits',
    price: 3.5,
    quantityAvailable: 50,
    location: 'Springfield',
    farmerName: 'John Doe',
    images: ['https://images.unsplash.com/photo-apple.jpg'],
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

  it('renders loader initially', () => {
    renderWithProviders(<ProductDetailCard productId="1" />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders product details after fetch', async () => {
    renderWithProviders(<ProductDetailCard productId="1" />);
    await waitFor(() => expect(screen.getByText('Fresh Apples')).toBeInTheDocument());
    expect(screen.getByText('Crisp and sweet apples from local farms.')).toBeInTheDocument();
    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('$3.5')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Springfield')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', product.images[0]);
  });

  it('handles fetch error', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
    renderWithProviders(<ProductDetailCard productId="bad-id" />);
    await waitFor(() => expect(screen.getByText(/Failed to fetch product/)).toBeInTheDocument());
  });

  it('calls onAddToCart and shows notification', async () => {
    const onAddToCart = jest.fn();
    renderWithProviders(<ProductDetailCard productId="1" onAddToCart={onAddToCart} />);
    await waitFor(() => expect(screen.getByText('Fresh Apples')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('add-to-cart-btn'));
    expect(onAddToCart).toHaveBeenCalledWith(product);
    expect(screen.getByTestId('notification')).toHaveTextContent('Added to cart!');
  });
});
