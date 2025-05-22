import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import Loader from './Loader';
import Notification from './Notification';
import { useCart } from './CartContext.jsx';

// Props: productId (string)
const ProductDetailCard = ({ productId, onAddToCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notify, setNotify] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      if (onAddToCart) onAddToCart(product);
      setNotify({ type: 'success', message: 'Added to cart!' });
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!product) return null;

  return (
    <Card sx={{ maxWidth: 500, m: 'auto', mt: 4, fontFamily: 'Montserrat' }}>
      {notify && (
        <Notification type={notify.type} message={notify.message} onClose={() => setNotify(null)} />
      )}
      {product.images && product.images.length > 0 && (
        <CardMedia
          component="img"
          height="240"
          image={product.images[0]}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Typography variant="h5" fontWeight={600} gutterBottom>{product.name}</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>{product.description}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 1 }}>
          <Typography variant="body2"><b>Category:</b> {product.category}</Typography>
          <Typography variant="body2"><b>Price:</b> ${product.price}</Typography>
          <Typography variant="body2"><b>Available:</b> {product.quantityAvailable}</Typography>
          <Typography variant="body2"><b>Location:</b> {product.location}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <b>Farmer:</b> {product.farmerName || 'N/A'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, fontWeight: 600, fontFamily: 'Montserrat' }}
          onClick={handleAddToCart}
          data-testid="add-to-cart-btn"
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductDetailCard;
