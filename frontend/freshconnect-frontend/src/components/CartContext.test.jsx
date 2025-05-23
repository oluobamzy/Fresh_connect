import { CartProvider, useCart } from './CartContext.jsx';
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('CartContext exports', () => {
  it('should export CartProvider and useCart', () => {
    expect(typeof CartProvider).toBe('function');
    expect(typeof useCart).toBe('function');
  });

  it('should provide context without crashing', () => {
    function Dummy() {
      useCart();
      return <div>ok</div>;
    }
    render(
      <CartProvider>
        <Dummy />
      </CartProvider>
    );
  });

  it('adds item with specific quantity', () => {
    const product = { id: '1', name: 'Test Product', price: 10 };
    function TestComponent() {
      const { cartItems, addToCart } = useCart();
      React.useEffect(() => {
        addToCart(product, 3);
      }, []);
      return <div>{cartItems[0]?.quantity}</div>;
    }
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('increases quantity for existing item', () => {
    const product = { id: '1', name: 'Test Product', price: 10 };
    function TestComponent() {
      const { cartItems, addToCart } = useCart();
      React.useEffect(() => {
        addToCart(product, 2);
        addToCart(product, 3);
      }, []);
      return <div>{cartItems[0]?.quantity}</div>;
    }
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });

});
