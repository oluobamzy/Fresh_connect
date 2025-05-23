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
  Alert,
  Rating,
  Divider,
  ButtonGroup,
  Tooltip
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Loader from './Loader';
import Notification from './Notification';
import { useCart } from './CartContext';

const EnhancedProductDetailCard = ({ productId, onAddToCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notify, setNotify] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.quantityAvailable) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      if (onAddToCart) onAddToCart({ ...product, quantity });
      setNotify({ type: 'success', message: `Added ${quantity} items to cart!` });
      setQuantity(1);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} on FreshConnect!`,
        url: window.location.href
      });
    } catch (err) {
      setNotify({ type: 'error', message: 'Failed to share product' });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setNotify({
      type: 'success',
      message: !isFavorite ? 'Added to favorites!' : 'Removed from favorites!'
    });
  };

  if (loading) return <Loader />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!product) return null;

  const maxSteps = product.images ? product.images.length : 0;
  const averageRating = product.reviews?.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews?.length || 0;

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight={600}>{product.name}</Typography>
          <Box>
            <IconButton 
              onClick={handleShare}
              data-testid="share-button"
              sx={{ mr: 1 }}
            >
              <ShareIcon />
            </IconButton>
            <IconButton
              onClick={toggleFavorite}
              data-testid="favorite-button"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          {product.description}
        </Typography>

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

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <ButtonGroup 
            variant="outlined" 
            aria-label="quantity selector"
            data-testid="quantity-selector"
          >
            <Button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              data-testid="decrease-quantity"
            >
              <RemoveIcon fontSize="small" />
            </Button>
            <Button disabled sx={{ px: 2 }} data-testid="quantity-value">
              {quantity}
            </Button>
            <Button
              onClick={increaseQuantity}
              disabled={quantity >= product.quantityAvailable}
              data-testid="increase-quantity"
            >
              <AddIcon fontSize="small" />
            </Button>
          </ButtonGroup>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            disabled={product.quantityAvailable <= 0}
            data-testid="add-to-cart-btn"
            sx={{ flex: 1 }}
          >
            {product.quantityAvailable > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>Reviews</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={averageRating} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({averageRating.toFixed(1)})
            </Typography>
          </Box>
          {product.reviews?.map(review => (
            <Box key={review.id} sx={{ mb: 2 }}>
              <Rating value={review.rating} size="small" readOnly />
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {review.comment}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(review.date).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedProductDetailCard;
