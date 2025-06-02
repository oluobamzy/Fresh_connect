import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Container, 
  Avatar, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  useMediaQuery, 
  useTheme,
  Divider,
  Badge
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import ForumIcon from '@mui/icons-material/Forum';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from './Auth/AuthContext';

export default function Header() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const { currentUser, logout, isAuthenticated } = useAuth();
  
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Marketplace', icon: <StorefrontIcon />, path: '/marketplace' }
  ];
  
  // Add authenticated routes
  if (isAuthenticated) {
    menuItems.push(
      { text: 'Orders', icon: <InventoryIcon />, path: '/orders' }
    );
  }
  
  // Add common routes
  menuItems.push(
    { text: 'Forum', icon: <ForumIcon />, path: '/forum' },
    { text: 'Recipes', icon: <RestaurantIcon />, path: '/recipes' }
  );
  
  // Only show admin link for admin users
  if (currentUser?.role === 'admin') {
    menuItems.push({ text: 'Admin', icon: <AdminPanelSettingsIcon />, path: '/admin' });
  }
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary" elevation={3} sx={{ backgroundColor: '#1565c0' }}>
      <Container>
        <Toolbar sx={{ py: 1 }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', mr: 2 }}>
            <img src="/freshconnect-logo.svg" alt="FreshConnect Logo" style={{ height: 40, marginRight: 12 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>FreshConnect</Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.text}
                  color="inherit" 
                  component={Link} 
                  to={item.path}
                  sx={{ 
                    mx: 0.5, 
                    fontWeight: pathname === item.path ? 'bold' : 'normal',
                    position: 'relative',
                    '&::after': pathname === item.path ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 5,
                      left: '25%',
                      width: '50%',
                      height: 3,
                      backgroundColor: 'white',
                      borderRadius: 3
                    } : {}
                  }}
                >
                  {item.text}
                </Button>
              ))}
              
              {!isAuthenticated && (
                <>
                  <Button 
                    color="inherit"
                    onClick={() => navigate('/login')}
                    sx={{ ml: 2 }}
                  >
                    Login
                  </Button>
                  
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/onboarding"
                    variant="outlined"
                    sx={{ 
                      ml: 1,
                      borderColor: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Join Now
                  </Button>
                </>
              )}
              
              <IconButton color="inherit" sx={{ ml: 1 }} onClick={() => navigate('/checkout')}>
                <ShoppingBasketIcon />
              </IconButton>
              
              {isAuthenticated && (
                <IconButton 
                  color="inherit" 
                  sx={{ ml: 1 }}
                  onClick={handleUserMenuOpen}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {currentUser?.name?.[0] || <PersonIcon fontSize="small" />}
                  </Avatar>
                </IconButton>
              )}
              
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleUserMenuClose(); navigate('/orders'); }}>
                  <ListItemIcon>
                    <InventoryIcon fontSize="small" />
                  </ListItemIcon>
                  My Orders
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
          
          {/* Mobile Menu Icon */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={() => navigate('/checkout')}>
                <ShoppingBasketIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handleMobileMenuToggle}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>
      
      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
              {currentUser?.name?.[0] || <PersonIcon />}
            </Avatar>
            <Typography variant="subtitle1">
              Hello, {currentUser ? currentUser.name : 'Guest'}
            </Typography>
          </Box>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => handleNavigation(item.path)}
                sx={{ 
                  backgroundColor: pathname === item.path ? 'rgba(0,0,0,0.04)' : 'transparent',
                  borderLeft: pathname === item.path ? '4px solid' : 'none',
                  borderColor: 'primary.main',
                  pl: pathname === item.path ? 1.5 : 2
                }}
              >
                <ListItemIcon sx={{ color: pathname === item.path ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: pathname === item.path ? 'bold' : 'normal'
                  }}
                />
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            {!isAuthenticated ? (
              <>
                <ListItem button onClick={() => handleNavigation('/login')}>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button onClick={() => handleNavigation('/onboarding')}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign Up" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button onClick={() => handleNavigation('/profile')}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
