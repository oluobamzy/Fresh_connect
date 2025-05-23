import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OrdersContainer from '../OrdersContainer';
import OrderList from '../Orders/OrderList';
import OrderDetails from '../Orders/OrderDetails';

// Mock the child components
jest.mock('../Orders/OrderList', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="order-list-mock">Order List Component</div>)
}));

jest.mock('../Orders/OrderDetails', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="order-details-mock">Order Details Component</div>)
}));

describe('OrdersContainer Component', () => {
  beforeEach(() => {
    // Clear mock calls
    OrderList.mockClear();
    OrderDetails.mockClear();
  });

  test('renders OrderList for base orders route', async () => {
    render(
      <MemoryRouter initialEntries={['/orders']}>
        <Routes>
          <Route path="/orders/*" element={<OrdersContainer />} />
        </Routes>
      </MemoryRouter>
    );

    // OrderList should be rendered
    await waitFor(() => {
      expect(screen.getByTestId('order-list-mock')).toBeInTheDocument();
      // OrderDetails should not be rendered
      expect(screen.queryByTestId('order-details-mock')).not.toBeInTheDocument();
    });
    
    // Check if OrderList was called with the expected props format
    expect(OrderList).toHaveBeenCalled();
    const props = OrderList.mock.calls[0][0];
    expect(props.userRole).toBe('consumer'); // Default is consumer
  });

  test('renders OrderDetails for specific order route', async () => {
    render(
      <MemoryRouter initialEntries={['/orders/order123']}>
        <Routes>
          <Route path="/orders/*" element={<OrdersContainer />} />
        </Routes>
      </MemoryRouter>
    );

    // OrderDetails should be rendered
    await waitFor(() => {
      expect(screen.getByTestId('order-details-mock')).toBeInTheDocument();
      // OrderList should not be rendered in this case (since we're on a detail route)
      expect(screen.queryByTestId('order-list-mock')).not.toBeInTheDocument();
    });
    
    // Check if OrderDetails was called with correct props
    expect(OrderDetails).toHaveBeenCalled();
    const props = OrderDetails.mock.calls[0][0];
    expect(props.userRole).toBe('consumer'); // Default is consumer
  });

  test('updates userRole when role tabs are clicked', async () => {
    // Create a user event instance
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/orders']}>
        <Routes>
          <Route path="/orders/*" element={<OrdersContainer />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Find the "Farmer View" tab
    const farmerTab = screen.getByRole('tab', { name: /farmer view/i });
    
    // Make sure the tab is in the document
    await waitFor(() => {
      expect(farmerTab).toBeInTheDocument();
    });
    
    // Use userEvent to click the tab which properly wraps in act()
    await user.click(farmerTab);
    
    // Wait for re-render and check that OrderList was called with updated userRole
    await waitFor(() => {
      const latestCall = OrderList.mock.calls[OrderList.mock.calls.length - 1];
      expect(latestCall[0].userRole).toBe('farmer');
    });
  });
});
