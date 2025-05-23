import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  Avatar,
  Rating,
  Button,
  Divider,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import ProductDetailCard from '../components/EnhancedProductDetailCard';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch product details
        const productRes = await fetch(`/api/products/${productId}`);
        if (!productRes.ok) throw new Error('Failed to fetch product');
        const productData = await productRes.json();
        setProduct(productData);

        // Fetch farmer details
        const farmerRes = await fetch(`/api/users/${productData.farmerId}`);
        if (!farmerRes.ok) throw new Error('Failed to fetch farmer details');
        const farmerData = await farmerRes.json();
        setFarmer(farmerData);

        // Fetch related products
        const relatedRes = await fetch(`/api/products?category=${productData.category}&limit=4&exclude=${productId}`);
        if (!relatedRes.ok) throw new Error('Failed to fetch related products');
        const relatedData = await relatedRes.json();
        setRelatedProducts(relatedData);

      } catch (err) {
        console.error('Error fetching product data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error loading product
          </Typography>
          <Typography color="text.secondary">{error}</Typography>
          <Button
            component={Link}
            to="/marketplace"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Return to Marketplace
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!product || !farmer) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <ProductDetailCard productId={productId} />
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              About the Farmer
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={farmer.avatarUrl}
                alt={farmer.name}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {farmer.name}
                  </Typography>
                  {farmer.verified && (
                    <VerifiedIcon 
                      color="primary" 
                      sx={{ ml: 1, fontSize: 20 }} 
                      data-testid="verified-icon"
                    />
                  )}
                </Box>
                <Rating value={farmer.rating || 4.5} precision={0.5} readOnly size="small" />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {farmer.location}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(farmer.joinedDate).getFullYear()}
              </Typography>
            </Box>

            <Typography variant="body2" paragraph>
              {farmer.bio || "This farmer is committed to providing fresh, locally-grown produce to their community."}
            </Typography>

            <Button
              component={Link}
              to={`/farmers/${farmer.id}`}
              variant="outlined"
              fullWidth
            >
              View Farmer's Profile
            </Button>
          </Paper>

          {relatedProducts.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Related Products
              </Typography>
              <Grid container spacing={2}>
                {relatedProducts.map((relatedProduct) => (
                  <Grid item xs={12} key={relatedProduct.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {relatedProduct.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ${relatedProduct.price.toFixed(2)}
                        </Typography>
                        <Button
                          component={Link}
                          to={`/products/${relatedProduct.id}`}
                          size="small"
                          color="primary"
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductPage;
