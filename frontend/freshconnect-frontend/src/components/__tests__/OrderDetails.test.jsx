import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OrderDetails from '../Orders/OrderDetails';
import OrderService from '../../services/OrderService';

// Mock the OrderService
jest.mock('../../services/OrderService');

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orderId: 'order123' }),
  useNavigate: () => jest.fn()
}));

describe('OrderDetails Component', () => {
  const mockOrder = {
    id: 'order123',
    consumerName: 'John Doe',
    farmerName: 'Green Acres Farm',
    farmLocation: '123 Farm Road, Countryside',
    deliveryAddress: '456 Main St, Cityville',
    deliveryNotes: 'Leave at the front door',
    createdAt: '2023-05-15T10:30:00Z',
    productItems: [
      { productId: 'prod1', name: 'Organic Apples', price: 10, quantity: 2 },
      { productId: 'prod2', name: 'Fresh Carrots', price: 5, quantity: 1 }
    ],
    status: 'Confirmed',
    paymentStatus: 'Paid'
  };

  beforeEach(() => {
    OrderService.getOrderById.mockResolvedValue(mockOrder);
    OrderService.updateOrderStatus.mockResolvedValue({ ...mockOrder, status: 'Processing' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    render(
      <MemoryRouter>
        <OrderDetails userRole="consumer" />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders order details for consumer view', async () => {
    render(
      <MemoryRouter>
        <OrderDetails userRole="consumer" />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Just check for the order ID instead of the formatted text
      expect(screen.getByText('order123')).toBeInTheDocument();
    });

    // Check for consumer-specific information
    expect(screen.getByText('Farmer Information')).toBeInTheDocument();
    expect(screen.getByText('Green Acres Farm')).toBeInTheDocument();
    expect(screen.getByText('123 Farm Road, Countryside')).toBeInTheDocument();
    
    // Check for product information
    expect(screen.getByText('Organic Apples')).toBeInTheDocument();
    expect(screen.getByText('Fresh Carrots')).toBeInTheDocument();
    
    // Check for delivery information
    expect(screen.getByText('456 Main St, Cityville')).toBeInTheDocument();
    expect(screen.getByText('Leave at the front door')).toBeInTheDocument();
    
    // Check for status and payment information (use getAllByText for 'Paid' since it appears multiple times)
    expect(screen.getAllByText('Paid')[0]).toBeInTheDocument();
    
    // Check for current status using a more flexible approach
    const statusElement = screen.getByText(/Current Status/i);
    expect(statusElement).toBeInTheDocument();
    expect(statusElement.textContent).toContain('Confirmed');
  });

  test('renders order details for farmer view', async () => {
    render(
      <MemoryRouter>
        <OrderDetails userRole="farmer" />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Just check for the order ID instead of the formatted text
      expect(screen.getByText('order123')).toBeInTheDocument();
    });

    // Check for farmer-specific information
    expect(screen.getByText('Customer Information')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check for editable status buttons (as farmer)
    expect(screen.getByText('Move to Processing')).toBeInTheDocument();
    expect(screen.getByText('Cancel Order')).toBeInTheDocument();
  });

  test('handles error state properly', async () => {
    OrderService.getOrderById.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <MemoryRouter>
        <OrderDetails userRole="consumer" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load order details/i)).toBeInTheDocument();
    });
  });

  test('handles not found state properly', async () => {
    OrderService.getOrderById.mockResolvedValue(null);

    render(
      <MemoryRouter>
        <OrderDetails userRole="consumer" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Order not found or you don't have permission/i)).toBeInTheDocument();
    });
  });
});
