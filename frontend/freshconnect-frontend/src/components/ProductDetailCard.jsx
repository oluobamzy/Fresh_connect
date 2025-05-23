import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  MobileStepper,
  Alert
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Loader from './Loader';
import Notification from './Notification';
import { useCart } from './CartContext.jsx';

const ProductDetailCard = ({ productId, onAddToCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notify, setNotify] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const { addToCart } = useCart();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

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

  const maxSteps = product.images ? product.images.length : 0;

  return (
    <Card sx={{ maxWidth: 500, m: 'auto', mt: 4, fontFamily: 'Montserrat' }}>
      {notify && (
        <Notification type={notify.type} message={notify.message} onClose={() => setNotify(null)} />
      )}
      <Box sx={{ position: 'relative' }}>
        {product.images && product.images.length > 0 && (
          <>
            <CardMedia
              component="img"
              height="240"
              image={product.images[activeStep]}
              alt={`${product.name} - image ${activeStep + 1}`}
              sx={{ objectFit: 'cover' }}
            />
            {maxSteps > 1 && (
              <>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 1
                  }}
                >
                  <IconButton
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
                    data-testid="prev-image-btn"
                  >
                    <KeyboardArrowLeft />
                  </IconButton>
                  <IconButton
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                    sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
                    data-testid="next-image-btn"
                  >
                    <KeyboardArrowRight />
                  </IconButton>
                </Box>
                <MobileStepper
                  steps={maxSteps}
                  position="static"
                  activeStep={activeStep}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    bgcolor: 'rgba(255,255,255,0.8)'
                  }}
                  nextButton={<Box />}
                  backButton={<Box />}
                />
              </>
            )}
          </>
        )}
      </Box>

      <CardContent>
        <Typography variant="h5" fontWeight={600} gutterBottom>{product.name}</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>{product.description}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 1 }}>
          <Typography variant="body2"><b>Category:</b> {product.category}</Typography>
          <Typography variant="body2"><b>Price:</b> ${product.price}</Typography>
          <Typography variant="body2">
            <b>Available:</b> {product.quantityAvailable > 0 ? product.quantityAvailable : 'Out of Stock'}
          </Typography>
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
          disabled={product.quantityAvailable <= 0}
          data-testid="add-to-cart-btn"
        >
          {product.quantityAvailable > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductDetailCard;
