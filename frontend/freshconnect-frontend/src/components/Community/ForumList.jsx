import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  Avatar,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Forum as ForumIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ForumService from '../../services/ForumService';

const ForumList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Categories for forum posts
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'gardening', label: 'Gardening' },
    { value: 'food-storage', label: 'Food Storage' },
    { value: 'food-preservation', label: 'Food Preservation' },
    { value: 'cooking', label: 'Cooking & Recipes' },
    { value: 'community', label: 'Community' },
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'general', label: 'General Discussion' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [currentPage, category]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await ForumService.getPosts(currentPage, 10, category === 'all' ? null : category);
      setPosts(response.posts);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch forum posts:', err);
      setError('Failed to load forum posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would trigger a search API call
    console.log('Searching for:', searchTerm);
    // For now, we'll just filter the current posts client-side
    fetchPosts();
  };

  const openCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setCreateDialogOpen(false);
    setNewPost({ title: '', content: '', category: 'general' });
    setFormErrors({});
  };

  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newPost.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!newPost.content.trim()) {
      errors.content = 'Content is required';
    } else if (newPost.content.trim().length < 10) {
      errors.content = 'Content must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePost = async () => {
    if (!validateForm()) return;
    
    try {
      setSubmitLoading(true);
      const newCreatedPost = await ForumService.createPost(newPost);
      
      // Add the new post to the list and close the dialog
      // Check if the post already exists to avoid duplicates
      setPosts(prevPosts => {
        const exists = prevPosts.some(post => post.id === newCreatedPost.id);
        return exists ? prevPosts : [newCreatedPost, ...prevPosts];
      });
      closeCreateDialog();
      
      // Show success message (in a real app, use a toast/snackbar)
      console.log('Post created successfully!');
    } catch (err) {
      console.error('Failed to create post:', err);
      setFormErrors({ 
        submit: 'Failed to create post. Please try again.' 
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/forum/${postId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && posts.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading forum discussions...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Filter posts based on search term (client-side filtering for now)
  const filteredPosts = searchTerm
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()))
    : posts;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 5, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #4CAF50 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Community Forum
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            sx={{ 
              borderRadius: 4,
              px: 3,
              py: 1,
              boxShadow: 3,
              background: 'linear-gradient(45deg, #2196F3 30%, #4CAF50 90%)'
            }}
          >
            New Discussion
          </Button>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Connect with farmers and fellow consumers to share knowledge and experiences
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper component="form" onSubmit={handleSearch} sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 3, borderRadius: 2 }}>
            <TextField
              fullWidth
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 1 }}
            />
            <Button type="submit" variant="contained" sx={{ borderRadius: 2, px: 3 }}>
              Search
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={category}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {filteredPosts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <ForumIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No discussions found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm 
              ? "No discussions match your search criteria." 
              : category !== 'all' 
                ? "There are no discussions in this category yet." 
                : "Be the first to start a discussion!"}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={openCreateDialog}
          >
            Start a New Discussion
          </Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            {filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea onClick={() => handlePostClick(post.id)}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        sx={{ width: 48, height: 48, mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                          {post.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                          <Typography variant="subtitle1" color="primary">
                            {post.author.name}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={post.author.role === 'farmer' ? 'Farmer' : 'Consumer'} 
                            color={post.author.role === 'farmer' ? 'success' : 'primary'}
                            variant="outlined"
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(post.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {post.content}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Chip 
                          label={categories.find(cat => cat.value === post.category)?.label || post.category} 
                          size="small"
                          sx={{ borderRadius: 4 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ThumbUpIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {post.likes}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CommentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {post.replies.length}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </>
      )}

      {/* Create New Post Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={closeCreateDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              Start a New Discussion
            </Typography>
            <IconButton edge="end" onClick={closeCreateDialog} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newPost.title}
            onChange={handleNewPostChange}
            error={!!formErrors.title}
            helperText={formErrors.title}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="new-post-category-label">Category</InputLabel>
            <Select
              labelId="new-post-category-label"
              id="category"
              name="category"
              value={newPost.category}
              onChange={handleNewPostChange}
              label="Category"
            >
              {categories.filter(cat => cat.value !== 'all').map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="content"
            name="content"
            label="Content"
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            value={newPost.content}
            onChange={handleNewPostChange}
            error={!!formErrors.content}
            helperText={formErrors.content}
          />
          {formErrors.submit && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {formErrors.submit}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeCreateDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePost} 
            variant="contained"
            disabled={submitLoading}
            startIcon={submitLoading ? <CircularProgress size={20} /> : null}
          >
            {submitLoading ? 'Creating...' : 'Create Discussion'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ForumList;
