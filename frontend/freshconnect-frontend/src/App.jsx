import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Tabs, Tab, Grid, Card, CardContent } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import FarmerRegistrationForm from './components/Onboarding/FarmerRegistrationForm';
import ConsumerRegistrationForm from './components/Onboarding/ConsumerRegistrationForm';
import ProductList from './components/ProductList.jsx';
import OrdersContainer from './components/OrdersContainer';
import ProfileContainer from './components/ProfileContainer';
import RecipeSuggestions from './components/Community/RecipeSuggestions';
import ForumContainer from './components/Community/ForumContainer';
import CheckoutPage from './components/Checkout/CheckoutPage';
import OrderConfirmation from './components/Orders/OrderConfirmation';
import { CartProvider } from './components/CartContext.jsx';
import ProductPage from './pages/ProductPage';
import { AuthProvider } from './components/Auth/AuthContext';
import Login from './components/Auth/Login';
import Unauthorized from './components/Auth/Unauthorized';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Registration from './components/Onboarding/Registration';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <Container sx={{ mt: 4, pb: 8 }}>
            <Routes>            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/onboarding" element={<Registration />} />
              <Route path="/orders/*" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/orders/confirmation/:orderId" element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              } />
              <Route path="/profile/*" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/forum/*" element={<Forum />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Container>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

// Placeholder components for main pages
function Home() {
  return (
    <>
      <Box sx={{
        position: 'relative',
        height: '500px',
        overflow: 'hidden',
        borderRadius: 2,
        mb: 6,
        boxShadow: 3
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1
        }} />
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          textAlign: 'center',
          width: '80%'
        }}>
          <Typography variant="h2" component="h1" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            Fresh Food, Direct from Farms
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>
            Supporting local farmers and providing fresh produce to communities
          </Typography>
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              component={Link} 
              to="/marketplace"
              sx={{ mr: 2, px: 4, py: 1.5 }}
            >
              Shop Now
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              size="large" 
              component={Link} 
              to="/onboarding"
              sx={{ px: 4, py: 1.5, bgcolor: 'rgba(255,255,255,0.9)' }}
            >
              Join as Farmer
            </Button>
          </Box>
        </Box>
        <Box sx={{
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1500)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
          Why Choose FreshConnect?
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: 'Freshness Guaranteed',
              description: 'All produce comes direct from local farms to your table within 24 hours',
              icon: '🍅'
            },
            {
              title: 'Support Local Farmers',
              description: 'Fair prices for farmers and quality products for consumers',
              icon: '🌾'
            },
            {
              title: 'Environmental Impact',
              description: 'Reduced carbon footprint with shorter supply chains',
              icon: '🌍'
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, textAlign: 'center', '&:hover': { boxShadow: 6, transform: 'translateY(-5px)', transition: 'all 0.3s' } }}>
                <Typography variant="h2" sx={{ mb: 2 }}>{feature.icon}</Typography>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              name: 'Organic Strawberries',
              farm: 'Green Valley Farms',
              price: '$5.99',
              image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=500'
            },
            {
              name: 'Farm Fresh Eggs',
              farm: 'Sunrise Organic',
              price: '$4.49',
              image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=500'
            },
            {
              name: 'Grass-fed Beef',
              farm: 'Meadow Ranch',
              price: '$12.99',
              image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=500'
            }
          ].map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 6, transform: 'translateY(-5px)', transition: 'all 0.3s' } }}>
                <Box sx={{ position: 'relative', pt: '56.25%', overflow: 'hidden' }}>
                  <Box 
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.farm}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {product.price}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                  <Button variant="contained" fullWidth component={Link} to="/marketplace">
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
          Ready to Experience Fresh?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
          Join thousands of satisfied customers who have made the switch to farm-fresh produce and support local agriculture.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          component={Link} 
          to="/marketplace"
          sx={{ px: 6, py: 1.5 }}
        >
          Start Shopping
        </Button>
      </Box>
    </>
  );
}

function Marketplace() {
  return <ProductList />;
}
function Onboarding() {
  const [tab, setTab] = useState(0);
  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
        <Tab label="Farmer Registration" />
        <Tab label="Consumer Registration" />
      </Tabs>
      <Box mt={2}>
        {tab === 0 ? <FarmerRegistrationForm /> : <ConsumerRegistrationForm />}
      </Box>
    </Box>
  );
}
function Orders() {
  return <OrdersContainer />;
}
function Profile() {
  return <ProfileContainer />;
}
function Forum() {
  return <ForumContainer />;
}
function Recipes() {
  return <RecipeSuggestions />;
}
function AdminDashboard() {
  return <Box><Typography variant="h4">Admin Dashboard</Typography><Typography>Manage users, disputes, analytics, and more.</Typography></Box>;
}

export default App
