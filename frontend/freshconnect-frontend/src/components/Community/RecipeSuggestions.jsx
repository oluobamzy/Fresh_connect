import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Divider,
  Container,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  LocalDining as DiningIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Restaurant as RestaurantIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import RecipeService from '../../services/RecipeService';
import purchaseHistory from '../../mockData/purchaseHistoryMockData';

const RecipeSuggestions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  
  // Extract product IDs from purchase history
  const purchasedProductIds = purchaseHistory.flatMap(order => 
    order.items.map(item => item.id)
  );
  
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        const recipeData = await RecipeService.getRecipeSuggestions(purchasedProductIds);
        setRecipes(recipeData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
        setError('Failed to load recipe suggestions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipes();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };
  
  const handleCloseDialog = () => {
    setSelectedRecipe(null);
  };
  
  const toggleBookmark = (recipeId) => {
    if (bookmarkedRecipes.includes(recipeId)) {
      setBookmarkedRecipes(bookmarkedRecipes.filter(id => id !== recipeId));
    } else {
      setBookmarkedRecipes([...bookmarkedRecipes, recipeId]);
    }
  };
  
  // Filter recipes based on selected tab
  const filteredRecipes = tabValue === 0 
    ? recipes 
    : recipes.filter(recipe => bookmarkedRecipes.includes(recipe.id));
  
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Finding delicious recipes for you...
          </Typography>
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #4CAF50 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Recipe Suggestions
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          Discover delicious recipes based on your purchases from local farmers
        </Typography>
      </Box>
      
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2
            }
          }}
        >
          <Tab 
            icon={<RestaurantIcon />} 
            iconPosition="start" 
            label="All Recipes" 
          />
          <Tab 
            icon={<BookmarkFilledIcon />} 
            iconPosition="start" 
            label="Saved Recipes" 
            disabled={bookmarkedRecipes.length === 0}
          />
        </Tabs>
      </Paper>
      
      {filteredRecipes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
          <Typography variant="h5" gutterBottom>
            {tabValue === 0 
              ? "We're working on new recipe suggestions for you!" 
              : "You haven't saved any recipes yet"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {tabValue === 0 
              ? "Check back soon or make more purchases to get personalized recipes." 
              : "Browse our suggestions and bookmark your favorites."}
          </Typography>
          {tabValue === 1 && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setTabValue(0)}
            >
              Browse Recipes
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={recipe.imageUrl}
                    alt={recipe.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      p: 1
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(recipe.id);
                      }}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.9)', 
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' } 
                      }}
                    >
                      {bookmarkedRecipes.includes(recipe.id) 
                        ? <BookmarkFilledIcon color="primary" /> 
                        : <BookmarkIcon />}
                    </IconButton>
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {recipe.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {recipe.prepTime}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                    {recipe.tags.length > 3 && (
                      <Chip label={`+${recipe.tags.length - 3}`} size="small" variant="outlined" />
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => handleRecipeClick(recipe)}
                    startIcon={<DiningIcon />}
                  >
                    View Recipe
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Recipe Detail Dialog */}
      <Dialog
        open={!!selectedRecipe}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            overflow: 'hidden'
          }
        }}
      >
        {selectedRecipe && (
          <>
            <DialogTitle 
              sx={{ 
                px: { xs: 2, sm: 3 }, 
                pt: { xs: 2, sm: 3 },
                pb: 0,
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}
            >
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {selectedRecipe.title}
              </Typography>
              <IconButton edge="end" onClick={handleCloseDialog} aria-label="close">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
              <Box 
                sx={{ 
                  borderRadius: 2, 
                  overflow: 'hidden', 
                  mb: 3,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                <img 
                  src={selectedRecipe.imageUrl} 
                  alt={selectedRecipe.title} 
                  style={{ 
                    width: '100%', 
                    height: isMobile ? '200px' : '300px', 
                    objectFit: 'cover' 
                  }} 
                />
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Ingredients
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <Box 
                        component="li" 
                        key={index} 
                        sx={{ 
                          mb: 1,
                          display: 'flex',
                          alignItems: 'flex-start'
                        }}
                      >
                        <Typography variant="body1">
                          {ingredient}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Instructions
                  </Typography>
                  <Box component="ol" sx={{ pl: 2 }}>
                    {selectedRecipe.instructions.map((step, index) => (
                      <Box 
                        component="li" 
                        key={index}
                        sx={{ 
                          mb: 2,
                          display: 'flex',
                          alignItems: 'flex-start'
                        }}
                      >
                        <Typography variant="body1">
                          {step}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Recipe Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedRecipe.tags.map(tag => (
                    <Chip key={tag} label={tag} />
                  ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
              <Button 
                onClick={() => toggleBookmark(selectedRecipe.id)} 
                startIcon={bookmarkedRecipes.includes(selectedRecipe.id) ? <BookmarkFilledIcon /> : <BookmarkIcon />}
              >
                {bookmarkedRecipes.includes(selectedRecipe.id) ? 'Saved' : 'Save'}
              </Button>
              <Button startIcon={<PrintIcon />}>
                Print
              </Button>
              <Button startIcon={<ShareIcon />}>
                Share
              </Button>
              <Button 
                variant="contained" 
                onClick={handleCloseDialog}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default RecipeSuggestions;
