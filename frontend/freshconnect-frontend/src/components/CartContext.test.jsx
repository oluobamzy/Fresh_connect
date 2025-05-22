import { CartProvider, useCart } from './CartContext.jsx';
import React from 'react';
import { render } from '@testing-library/react';

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
});
