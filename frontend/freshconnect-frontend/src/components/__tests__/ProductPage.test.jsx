import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductPage from '../../pages/ProductPage';
import { CartProvider } from '../CartContext';

// Mock the ProductDetailCard component
jest.mock('../ProductDetailCard', () => {
  return function MockProductDetailCard({ productId }) {
    return <div data-testid="product-detail-card">Product Detail Card {productId}</div>;
  };
});

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ productId: '1' }),
  BrowserRouter: jest.requireActual('react-router-dom').BrowserRouter,
  Routes: jest.requireActual('react-router-dom').Routes,
  Route: jest.requireActual('react-router-dom').Route
}));

describe('ProductPage', () => {
  const mockProduct = {
    id: '1',
    name: 'Fresh Apples',
    description: 'Crisp and sweet apples from local farms',
    price: 3.5,
    category: 'Fruits',
    farmerId: 'farmer123'
  };

  const mockFarmer = {
    id: 'farmer123',
    name: 'John Doe',
    rating: 4.5,
    location: 'Springfield Valley',
    joinedDate: '2020-01-01',
    verified: true,
    bio: 'Passionate about organic farming'
  };

  const mockRelatedProducts = [
    {
      id: '2',
      name: 'Organic Pears',
      price: 4.0
    },
    {
      id: '3',
      name: 'Fresh Oranges',
      price: 3.0
    }
  ];

  beforeEach(() => {
    // Mock fetch calls
    global.fetch = jest.fn((url) => {
      if (url.includes('/api/products/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProduct)
        });
      }
      if (url.includes('/api/users/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockFarmer)
        });
      }
      if (url.includes('/api/products?')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRelatedProducts)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = () => {
    return render(
      <CartProvider>
        <BrowserRouter>
          <ProductPage />
        </BrowserRouter>
      </CartProvider>
    );
  };

  it('renders loading state initially', () => {
    renderWithProviders();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders product and farmer information after loading', async () => {
    renderWithProviders();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('About the Farmer')).toBeInTheDocument();
    });

    // Check if farmer info is displayed
    expect(screen.getByText(mockFarmer.name)).toBeInTheDocument();
    expect(screen.getByText(mockFarmer.location)).toBeInTheDocument();
    expect(screen.getByText(mockFarmer.bio)).toBeInTheDocument();

    // Check if related products are displayed
    expect(screen.getByText('Related Products')).toBeInTheDocument();
    expect(screen.getByText(mockRelatedProducts[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockRelatedProducts[1].name)).toBeInTheDocument();
  });

  it('displays error message when product fetch fails', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Error loading product')).toBeInTheDocument();
    });
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    expect(screen.getByText('Return to Marketplace')).toBeInTheDocument();
  });

  it('renders related products section', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Related Products')).toBeInTheDocument();
    });

    mockRelatedProducts.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeInTheDocument();
    });
  });
});
