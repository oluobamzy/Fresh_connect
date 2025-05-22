import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import OrderList from '../Orders/OrderList';
import OrderService from '../../services/OrderService';

// Mock the OrderService
jest.mock('../../services/OrderService');

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('OrderList Component', () => {
  const mockOrders = [
    {
      id: 'ORD-2023-001',
      consumerName: 'John Doe',
      farmerName: 'Green Acres Farm',
      createdAt: '2023-05-15T10:30:00Z',
      productItems: [
        { productId: 'prod1', price: 10, quantity: 2 },
        { productId: 'prod2', price: 5, quantity: 1 }
      ],
      status: 'Confirmed',
      paymentStatus: 'Paid'
    },
    {
      id: 'ORD-2023-002',
      consumerName: 'Jane Smith',
      farmerName: 'Organic Valley',
      createdAt: '2023-05-17T14:45:00Z',
      productItems: [
        { productId: 'prod3', price: 8, quantity: 3 }
      ],
      status: 'Pending',
      paymentStatus: 'Pending'
    }
  ];

  beforeEach(() => {
    OrderService.getOrders.mockResolvedValue(mockOrders);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders order list for consumer view', async () => {
    render(
      <BrowserRouter>
        <OrderList userRole="consumer" />
      </BrowserRouter>
    );

    // Initially shows loading state
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // After loading, displays orders
    await waitFor(() => {
      expect(screen.getByText('My Purchase History')).toBeInTheDocument();
      expect(screen.getByText('Green Acres Farm')).toBeInTheDocument();
      expect(screen.getByText('Organic Valley')).toBeInTheDocument();
    });

    // Displays correct number of orders
    expect(screen.getAllByRole('row')).toHaveLength(3); // Header row + 2 order rows
  });

  test('renders order list for farmer view', async () => {
    render(
      <BrowserRouter>
        <OrderList userRole="farmer" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Manage Customer Orders')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('filters orders by status', async () => {
    // Setup user event
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <OrderList userRole="consumer" />
      </BrowserRouter>
    );

    // Wait for orders to load
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(3); // Header + 2 orders
    });

    // Check that both orders are initially displayed
    expect(screen.getByText('ORD-2023-001')).toBeInTheDocument();
    expect(screen.getByText('ORD-2023-002')).toBeInTheDocument();

    // Find the status filter dropdown and open it
    const statusFilter = screen.getByLabelText('Status');
    await user.click(statusFilter);
    
    // Find the "Confirmed" option in the dropdown by its role and data-value attribute
    const confirmedOption = screen.getByRole('option', { name: 'Confirmed' });
    await user.click(confirmedOption);

    // After selecting "Confirmed", the filter should be applied
    // Wait for the component to re-render with filtered results
    await waitFor(() => {
      // ORD-2023-001 (Confirmed) should still be visible
      expect(screen.getByText('ORD-2023-001')).toBeInTheDocument();
      
      // ORD-2023-002 (Pending) should no longer be visible
      expect(screen.queryByText('ORD-2023-002')).not.toBeInTheDocument();
    });
  });

  test('handles error state properly', async () => {
    OrderService.getOrders.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <OrderList userRole="consumer" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load orders/i)).toBeInTheDocument();
    });
  });
});
