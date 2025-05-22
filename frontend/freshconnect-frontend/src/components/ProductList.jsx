import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, Alert, TextField, MenuItem, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom';
import Loader from './Loader';

const categories = [
  '', 'Fruits', 'Vegetables', 'Dairy', 'Meat', 'Grains', 'Other'
];

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ name: '', category: '', location: '' });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async (filterParams = filters) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filterParams.name) params.append('name', filterParams.name);
      if (filterParams.category) params.append('category', filterParams.category);
      if (filterParams.location) params.append('location', filterParams.location);
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        setError(data.message || 'Failed to fetch products.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" mb={3}>Marketplace</Typography>
      <Box component="form" onSubmit={handleSearch} mb={3} display="flex" gap={2} flexWrap="wrap">
        <TextField
          label="Search by name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">🔍</InputAdornment>
          }}
          size="small"
        />
        <TextField
          select
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat || 'All Categories'}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Location"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          size="small"
        />
        <Button type="submit" variant="contained" color="primary">Filter</Button>
      </Box>
      {loading ? <Loader /> : error ? <Alert severity="error">{error}</Alert> : (
        <Grid container spacing={3}>
          {products.length === 0 ? (
            <Typography>No products found.</Typography>
          ) : products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card 
                component={Link} 
                to={`/products/${product.id}`}
                sx={{ 
                  textDecoration: 'none',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                {product.images && product.images[0] && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={product.images[0]}
                    alt={product.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="text.secondary">${product.price}</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 1 }}>View Details</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
