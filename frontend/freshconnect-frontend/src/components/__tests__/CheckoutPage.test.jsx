import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../CartContext';
import CheckoutPage from '../Checkout/CheckoutPage';

// Mock components
jest.mock('../Checkout/DeliveryAddressForm', () => {
  return function MockDeliveryAddressForm({ onChange }) {
    return (
      <div data-testid="delivery-address-form">
        <button onClick={() => onChange({
          fullName: 'John Doe',
          addressLine1: '123 Main St',
          city: 'Anytown',
          state: 'California',
          zipCode: '12345',
          phoneNumber: '5551234567'
        })}>
          Fill Form
        </button>
      </div>
    );
  };
});

jest.mock('../Checkout/PaymentMethodForm', () => {
  return function MockPaymentMethodForm({ onChange }) {
    return (
      <div data-testid="payment-method-form">
        <button onClick={() => onChange({
          cardNumber: '4111 1111 1111 1111',
          nameOnCard: 'John Doe',
          expiryDate: '12/25',
          cvv: '123'
        })}>
          Fill Form
        </button>
      </div>
    );
  };
});

jest.mock('../Checkout/OrderSummary', () => {
  return function MockOrderSummary({ orderData, cartItems }) {
    return (
      <div data-testid="order-summary">
        <div>Order Data: {JSON.stringify(orderData)}</div>
        <div>Cart Items: {cartItems.length} items</div>
      </div>
    );
  };
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ orderId: 'test-order-123' }),
  })
);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CheckoutPage', () => {
  const sampleProduct = {
    id: '1',
    name: 'Fresh Apples',
    price: 3.5,
  };

  const renderWithProviders = (ui) => {
    return render(
      <CartProvider>
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </CartProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to marketplace if cart is empty', async () => {
    renderWithProviders(<CheckoutPage />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/marketplace');
    });
  });

  it('shows the stepper with three steps', () => {
    // Add item to cart first so it doesn't redirect
    const { getByText } = renderWithProviders(
      <CartProvider initialItems={[{ product: sampleProduct, quantity: 1 }]}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </CartProvider>
    );
    
    expect(getByText('Delivery Address')).toBeInTheDocument();
    expect(getByText('Payment Method')).toBeInTheDocument();
    expect(getByText('Review Order')).toBeInTheDocument();
  });

  it('progresses through checkout steps', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <CartProvider initialItems={[{ product: sampleProduct, quantity: 1 }]}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </CartProvider>
    );
    
    // Step 1: Delivery Address
    expect(getByTestId('delivery-address-form')).toBeInTheDocument();
    
    // Fill the delivery form and click next
    fireEvent.click(getByText('Fill Form'));
    fireEvent.click(getByText('Next'));
    
    // Step 2: Payment Method
    expect(getByTestId('payment-method-form')).toBeInTheDocument();
    
    // Fill the payment form and click next
    fireEvent.click(getByText('Fill Form'));
    fireEvent.click(getByText('Next'));
    
    // Step 3: Order Summary
    expect(getByTestId('order-summary')).toBeInTheDocument();
    expect(getByText('Place Order')).toBeInTheDocument();
  });

  it('places an order and redirects to confirmation page', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <CartProvider initialItems={[{ product: sampleProduct, quantity: 1 }]}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </CartProvider>
    );
    
    // Fill the delivery form and go to next step
    fireEvent.click(getByText('Fill Form'));
    fireEvent.click(getByText('Next'));
    
    // Fill the payment form and go to next step
    fireEvent.click(getByText('Fill Form'));
    fireEvent.click(getByText('Next'));
    
    // Place the order
    fireEvent.click(getByText('Place Order'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/orders', expect.any(Object));
      expect(mockNavigate).toHaveBeenCalledWith('/orders/confirmation/test-order-123');
    });
  });
});
