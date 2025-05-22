import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext.jsx';
import CartSummary from './CartSummary';

// Mock the Delete icon
jest.mock('@mui/icons-material/Delete', () => () => <span data-testid="delete-icon" />);

const Wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const sampleProduct = {
  id: '1',
  name: 'Fresh Apples',
  price: 3.5,
};

describe('CartSummary', () => {
  // Set a timeout for all tests in this suite
  jest.setTimeout(5000);
  
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('shows empty cart message', () => {
    render(<CartSummary />, { wrapper: Wrapper });
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('displays cart items and total', () => {
    // Use wrapper and add item via context
    function TestComponent() {
      const { addToCart } = useCart();
      // Using an empty dependency array to avoid infinite loops
      // This way the effect runs only once after the initial render
      React.useEffect(() => { 
        addToCart(sampleProduct); 
      }, []); // Empty dependency array
      return <CartSummary />;
    }
    render(<TestComponent />, { wrapper: Wrapper });
    expect(screen.getByText('Fresh Apples')).toBeInTheDocument();
    expect(screen.getByText('$3.5 × 1 = $3.50')).toBeInTheDocument();
    expect(screen.getByText(/total/i)).toHaveTextContent('Total: $3.50');
  });

  it('removes item from cart', () => {
    function TestComponent() {
      const { addToCart } = useCart();
      React.useEffect(() => { 
        addToCart(sampleProduct); 
      }, []); // Empty dependency array
      return <CartSummary />;
    }
    render(<TestComponent />, { wrapper: Wrapper });
    const removeBtn = screen.getByLabelText('remove');
    fireEvent.click(removeBtn);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('clears cart', () => {
    function TestComponent() {
      const { addToCart } = useCart();
      React.useEffect(() => { 
        addToCart(sampleProduct); 
      }, []); // Empty dependency array
      return <CartSummary />;
    }
    render(<TestComponent />, { wrapper: Wrapper });
    const clearBtn = screen.getByText(/clear cart/i);
    fireEvent.click(clearBtn);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('calls onCheckout when checkout button is clicked', () => {
    const onCheckout = jest.fn();
    function TestComponent() {
      const { addToCart } = useCart();
      React.useEffect(() => { 
        addToCart(sampleProduct); 
      }, []); // Empty dependency array
      return <CartSummary onCheckout={onCheckout} />;
    }
    render(<TestComponent />, { wrapper: Wrapper });
    
    // Find and click the checkout button
    const checkoutBtn = screen.getByTestId('checkout-btn');
    fireEvent.click(checkoutBtn);
    
    // Verify that onCheckout was called
    expect(onCheckout).toHaveBeenCalledTimes(1);
  });
  it('does not show checkout button when cart is empty', () => {
    render(<CartSummary />, { wrapper: Wrapper });
    const checkoutBtn = screen.queryByTestId('checkout-btn');
    expect(checkoutBtn).not.toBeInTheDocument();
  });

 
});
