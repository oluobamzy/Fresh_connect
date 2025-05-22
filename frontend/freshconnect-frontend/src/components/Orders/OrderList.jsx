import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import OrderService from '../../services/OrderService';

// Status color mapping for the chips
const statusColors = {
  'Pending': 'warning',
  'Confirmed': 'info',
  'Processing': 'primary',
  'Ready': 'secondary',
  'Delivered': 'success',
  'Cancelled': 'error'
};

const OrderList = ({ userRole }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await OrderService.getOrders();
        setOrders(data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Apply filters to the orders
  const filteredOrders = orders.filter(order => {
    // Filter by status if not 'All'
    const statusMatch = statusFilter === 'All' || order.status === statusFilter;
    
    // Search in order ID or customer/farmer name
    const searchMatch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userRole === 'farmer' ? 
        (order.consumerName?.toLowerCase().includes(searchTerm.toLowerCase())) : 
        (order.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    
    return statusMatch && searchMatch;
  });
  
  // Get unique statuses from orders for the filter
  const availableStatuses = ['All', ...new Set(orders.map(order => order.status))];
  
  // Handle viewing order details
  const handleViewDetails = (orderId) => {
    navigate(`${orderId}`);
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }
  
  // Calculate total for an order
  const calculateOrderTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {userRole === 'farmer' ? 'Manage Customer Orders' : 'My Purchase History'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Search and Filter Controls */}
      <Box sx={{ display: 'flex', mb: 3, gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: '150px' }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon fontSize="small" />
              </InputAdornment>
            }
          >
            {availableStatuses.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* View mode toggle */}
        <Box>
          <Button 
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('table')}
            sx={{ mr: 1 }}
          >
            Table
          </Button>
          <Button 
            variant={viewMode === 'cards' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('cards')}
          >
            Cards
          </Button>
        </Box>
      </Box>
      
      {/* Orders display - empty state */}
      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No orders found. {userRole === 'consumer' && "Start shopping to place your first order!"}
          </Typography>
          {userRole === 'consumer' && (
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/')}
            >
              Shop Now
            </Button>
          )}
        </Paper>
      ) : viewMode === 'table' ? (
        /* Table View */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>{userRole === 'farmer' ? 'Customer' : 'Farm'}</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {userRole === 'farmer' ? order.consumerName : order.farmerName}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.productItems.length} items
                  </TableCell>
                  <TableCell>
                    ${calculateOrderTotal(order.productItems)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={statusColors[order.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.paymentStatus} 
                      color={order.paymentStatus === 'Paid' ? 'success' : 
                             order.paymentStatus === 'Refunded' ? 'error' : 'warning'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(order.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        /* Card View */
        <Grid container spacing={3}>
          {filteredOrders.map(order => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div">
                      {order.id}
                    </Typography>
                    <Chip 
                      label={order.status} 
                      color={statusColors[order.status] || 'default'}
                      size="small"
                    />
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                      {userRole === 'farmer' ? 'C' : 'F'}
                    </Avatar>
                    <Typography variant="body2">
                      {userRole === 'farmer' ? order.consumerName : order.farmerName}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <DateRangeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {order.productItems.length} items
                  </Typography>
                  
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {order.productItems.slice(0, 3).map(item => (
                      <Box key={item.productId} sx={{ position: 'relative' }}>
                        <Avatar 
                          variant="rounded" 
                          src={item.image} 
                          alt={item.name}
                          sx={{ width: 40, height: 40 }}
                        />
                        {item.quantity > 1 && (
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: -6, 
                              right: -6, 
                              bgcolor: 'primary.main',
                              color: 'white',
                              borderRadius: '50%',
                              width: 18,
                              height: 18,
                              fontSize: '0.7rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {item.quantity}
                          </Box>
                        )}
                      </Box>
                    ))}
                    {order.productItems.length > 3 && (
                      <Avatar 
                        variant="rounded" 
                        sx={{ width: 40, height: 40, bgcolor: 'action.selected', color: 'text.primary' }}
                      >
                        +{order.productItems.length - 3}
                      </Avatar>
                    )}
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <PaymentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Chip 
                        label={order.paymentStatus} 
                        color={order.paymentStatus === 'Paid' ? 'success' : 
                              order.paymentStatus === 'Refunded' ? 'error' : 'warning'}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Typography variant="h6" color="primary">
                      ${calculateOrderTotal(order.productItems)}
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={() => handleViewDetails(order.id)}
                    startIcon={<VisibilityIcon />}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};


export default OrderList;
