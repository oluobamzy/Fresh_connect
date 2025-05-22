import React from 'react';
import { Box, Typography, IconButton, Button, Divider } from '@mui/material';
import { useCart } from './CartContext.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ onCheckout }) => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart } = useCart();
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <Box sx={{ p: 3, maxWidth: 400, m: 'auto', fontFamily: 'Montserrat' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>Cart Summary</Typography>
      {items.length === 0 ? (
        <Typography color="text.secondary">Your cart is empty.</Typography>
      ) : (
        <>
          {items.map(({ product, quantity }) => (
            <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${product.price} × {quantity} = ${(product.price * quantity).toFixed(2)}
                </Typography>
              </Box>
              <IconButton aria-label="remove" onClick={() => removeFromCart(product.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight={600}>Total: ${total.toFixed(2)}</Typography>
          {items.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, fontWeight: 600, fontFamily: 'Montserrat' }}
              onClick={() => {
                if (onCheckout) {
                  onCheckout();
                } else {
                  navigate('/checkout');
                }
              }}
              data-testid="checkout-btn"
            >
              Checkout
            </Button>
          )}
          <Button
            variant="text"
            color="secondary"
            sx={{ mt: 1, ml: 2 }}
            onClick={clearCart}
            disabled={items.length === 0}
          >
            Clear Cart
          </Button>
        </>
      )}
    </Box>
  );
};

export default CartSummary;
