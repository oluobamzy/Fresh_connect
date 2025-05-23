import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderCheckout from '../Orders/OrderCheckout';
import OrderService from '../../services/OrderService';

// Mock OrderService
jest.mock('../../services/OrderService');

// Mock CartContext
jest.mock('../CartContext', () => ({
  useCart: () => ({
    cartItems: [
      { id: '1', name: 'Fresh Apples', price: 3.99, quantity: 2 },
      { id: '2', name: 'Organic Carrots', price: 2.49, quantity: 1 }
    ],
    clearCart: jest.fn()
  })
}));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('OrderCheckout Component', () => {
  beforeEach(() => {
    // Reset mocks
    OrderService.createOrder.mockReset();
    OrderService.createOrder.mockResolvedValue({ id: 'ORD-12345' });
    mockNavigate.mockReset();
  });

  test('renders order summary and form fields', () => {
    render(
      <MemoryRouter>
        <OrderCheckout />
      </MemoryRouter>
    );

    // Check for checkout heading
    expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
    
    // Check for order summary
    expect(screen.getByText(/Order Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Fresh Apples/i)).toBeInTheDocument();
    expect(screen.getByText(/Organic Carrots/i)).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zip Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    
    // Check for payment section
    expect(screen.getByText(/Payment Method/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Credit Card/i)).toBeInTheDocument();
    
    // Check for place order button
    expect(screen.getByRole('button', { name: /Place Order/i })).toBeInTheDocument();
  });

  test('displays total price correctly', () => {
    render(
      <MemoryRouter>
        <OrderCheckout />
      </MemoryRouter>
    );
    
    // Calculate expected total (3.99 * 2 + 2.49 * 1 = 10.47) plus shipping
    const subtotal = 3.99 * 2 + 2.49;
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping for orders over $50
    const expectedTotal = (subtotal + shipping).toFixed(2);
    
    expect(screen.getByText(`$${expectedTotal}`)).toBeInTheDocument();
  });

  test('validates form fields before submission', async () => {
    render(
      <MemoryRouter>
        <OrderCheckout />
      </MemoryRouter>
    );
    
    // Try to submit the form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /Place Order/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument();
    });
    
    // OrderService should not be called
    expect(OrderService.createOrder).not.toHaveBeenCalled();
  });

  test('submits order successfully when form is valid', async () => {
    // Use a manually controlled promise
    let resolveOrderPromise;
    const orderPromise = new Promise(resolve => {
      resolveOrderPromise = resolve;
    });
    
    // Setup the mock to use our controlled promise
    OrderService.createOrder.mockReturnValue(orderPromise);
    
    render(
      <MemoryRouter>
        <OrderCheckout />
      </MemoryRouter>
    );
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: 'Anytown' },
    });
    fireEvent.change(screen.getByLabelText(/State/i), {
      target: { value: 'CA' },
    });
    fireEvent.change(screen.getByLabelText(/Zip Code/i), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: '555-123-4567' },
    });
    
    // Select payment method
    fireEvent.click(screen.getByLabelText(/Credit Card/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Place Order/i }));
    
    // Wait for the loading state to be visible
    await waitFor(() => {
      expect(OrderService.createOrder).toHaveBeenCalled();
    });
    
    // Resolve the promise to complete the API call
    resolveOrderPromise({ id: 'ORD-12345' });
    
    // Check that service was called with correct data
    await waitFor(() => {
      expect(OrderService.createOrder).toHaveBeenCalledWith(expect.objectContaining({
        customerName: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        phone: '555-123-4567',
        paymentMethod: 'Credit Card'
      }));
    });
    
    // Check navigation happened
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/orders/confirmation/ORD-12345'));
    });
  });

  test('handles API errors during order submission', async () => {
    // Use a manually controlled promise
    let rejectOrderPromise;
    const orderPromise = new Promise((resolve, reject) => {
      rejectOrderPromise = reject;
    });
    
    // Setup the mock to use our controlled promise
    OrderService.createOrder.mockReturnValue(orderPromise);
    
    render(
      <MemoryRouter>
        <OrderCheckout />
      </MemoryRouter>
    );
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: 'Anytown' },
    });
    fireEvent.change(screen.getByLabelText(/State/i), {
      target: { value: 'CA' },
    });
    fireEvent.change(screen.getByLabelText(/Zip Code/i), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: '555-123-4567' },
    });
    
    // Select payment method
    fireEvent.click(screen.getByLabelText(/Credit Card/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Place Order/i }));
    
    // Wait for the createOrder method to be called
    await waitFor(() => {
      expect(OrderService.createOrder).toHaveBeenCalled();
    });
    
    // Reject the promise to simulate an API error
    rejectOrderPromise(new Error('Payment failed'));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Payment failed/i)).toBeInTheDocument();
    });
    
    // Cart should not be cleared on error and navigation should not happen
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
