import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OrderConfirmation from '../Orders/OrderConfirmation';
import OrderService from '../../services/OrderService';

// Mock OrderService
jest.mock('../../services/OrderService', () => ({
  getOrderById: jest.fn()
}));

describe('OrderConfirmation Component', () => {
  const mockOrder = {
    id: 'ORD-12345',
    date: '2023-05-23',
    status: 'Processing',
    items: [
      { name: 'Fresh Apples', quantity: 2, price: 3.5 },
      { name: 'Organic Carrots', quantity: 1, price: 2.5 }
    ],
    shipping: 5,
    total: 14.5,
    deliveryAddress: {
      fullName: 'John Doe',
      addressLine1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    estimatedDelivery: '2023-05-26'
  };

  beforeEach(() => {
    // Reset mock and set up default response
    OrderService.getOrderById.mockReset();
    OrderService.getOrderById.mockResolvedValue(mockOrder);
  });

  test('renders loading state initially', async () => {
    // Use a manually controlled promise for OrderService
    let resolveOrderPromise;
    const orderPromise = new Promise(resolve => {
      resolveOrderPromise = resolve;
    });
    
    // Setup the mock to use our controlled promise
    OrderService.getOrderById.mockReturnValue(orderPromise);
    
    render(
      <MemoryRouter initialEntries={['/orders/confirmation/ORD-12345']}>
        <Routes>
          <Route path="/orders/confirmation/:orderId" element={<OrderConfirmation />} />
        </Routes>
      </MemoryRouter>
    );

    // In the loading state, these elements should be present
    expect(screen.getByText(/loading your order confirmation/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Resolve the promise to complete the test
    resolveOrderPromise(mockOrder);
    
    // Wait for the loading state to clear
    await waitFor(() => {
      expect(screen.queryByText(/loading your order confirmation/i)).not.toBeInTheDocument();
    });
  });

  test('renders order confirmation details after loading', async () => {
    // Use a manually controlled promise
    let resolveOrderPromise;
    const orderPromise = new Promise(resolve => {
      resolveOrderPromise = resolve;
    });
    
    // Set up the mock to use our controlled promise
    OrderService.getOrderById.mockReturnValue(orderPromise);
    
    render(
      <MemoryRouter initialEntries={['/orders/confirmation/ORD-12345']}>
        <Routes>
          <Route path="/orders/confirmation/:orderId" element={<OrderConfirmation />} />
        </Routes>
      </MemoryRouter>
    );

    // Immediately resolve the promise with mock data
    resolveOrderPromise(mockOrder);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/loading your order confirmation/i)).not.toBeInTheDocument();
    });

    // Check for order ID
    expect(screen.getByText(/ORD-12345/i)).toBeInTheDocument();
    
    // Check for order status
    expect(screen.getByText(/Processing/i)).toBeInTheDocument();
    
    // Check for delivery address
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
    
    // Check for order items
    expect(screen.getByText(/Fresh Apples/i)).toBeInTheDocument();
    expect(screen.getByText(/Organic Carrots/i)).toBeInTheDocument();
    
    // Check for order total
    expect(screen.getByText(/\$14.50/i)).toBeInTheDocument();
    
    // Check for navigation buttons
    expect(screen.getByRole('link', { name: /track order/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    // Use a manually controlled promise
    let rejectOrderPromise;
    const orderPromise = new Promise((resolve, reject) => {
      rejectOrderPromise = reject;
    });
    
    // Set up the mock to use our controlled promise
    OrderService.getOrderById.mockReturnValue(orderPromise);
    
    render(
      <MemoryRouter initialEntries={['/orders/confirmation/ORD-12345']}>
        <Routes>
          <Route path="/orders/confirmation/:orderId" element={<OrderConfirmation />} />
        </Routes>
      </MemoryRouter>
    );

    // Immediately reject the promise with an error
    rejectOrderPromise(new Error('Network error'));

    await waitFor(() => {
      expect(screen.getByText(/there was a problem loading your order details/i)).toBeInTheDocument();
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
    
    // Check if the view all orders button is present
    expect(screen.getByRole('link', { name: /view all orders/i })).toBeInTheDocument();
  });
});
