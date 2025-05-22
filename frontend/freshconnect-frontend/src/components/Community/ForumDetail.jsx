import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  CalendarToday as CalendarIcon,
  Report as ReportIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Send as SendIcon
} from '@mui/icons-material';
import ForumService from '../../services/ForumService';

const ForumDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [likedReplies, setLikedReplies] = useState([]);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const postData = await ForumService.getPost(postId);
      setPost(postData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch post details:', err);
      setError('Failed to load discussion. It may have been removed or you may not have permission to view it.');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
    if (submitError) setSubmitError(null);
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      setSubmitError('Reply cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      const result = await ForumService.addReply(postId, { content: replyContent });
      setPost(result.post);
      setReplyContent('');
      setSubmitError(null);
    } catch (err) {
      console.error('Failed to submit reply:', err);
      setSubmitError('Failed to submit your reply. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLikeReply = (replyId) => {
    if (likedReplies.includes(replyId)) {
      setLikedReplies(likedReplies.filter(id => id !== replyId));
    } else {
      setLikedReplies([...likedReplies, replyId]);
    }
  };

  const toggleLikePost = () => {
    setIsPostLiked(!isPostLiked);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleBackToForum = () => {
    navigate('/forum');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading discussion...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBackToForum}
          >
            Back to Forum
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToForum}
          sx={{ mb: 3 }}
        >
          Back to Forum
        </Button>
        
        {post && (
          <>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <Avatar 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {post.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                    <Typography variant="h6" color="primary">
                      {post.author.name}
                    </Typography>
                    <Chip 
                      label={post.author.role === 'farmer' ? 'Farmer' : 'Consumer'} 
                      color={post.author.role === 'farmer' ? 'success' : 'primary'}
                      sx={{ borderRadius: 4 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(post.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    onClick={toggleBookmark}
                    color={isBookmarked ? 'primary' : 'default'}
                    sx={{ border: 1, borderColor: 'divider' }}
                  >
                    {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </IconButton>
                  <IconButton 
                    sx={{ border: 1, borderColor: 'divider' }}
                  >
                    <ShareIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    sx={{ border: 1, borderColor: 'divider' }}
                  >
                    <ReportIcon />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" paragraph>
                {post.content}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
                <Chip 
                  label={post.category.charAt(0).toUpperCase() + post.category.slice(1).replace('-', ' ')} 
                  color="primary"
                  variant="outlined"
                />
                <Button
                  startIcon={isPostLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  onClick={toggleLikePost}
                  color={isPostLiked ? 'primary' : 'inherit'}
                  variant={isPostLiked ? 'contained' : 'outlined'}
                >
                  {isPostLiked ? 'Liked' : 'Like'} ({post.likes + (isPostLiked ? 1 : 0)})
                </Button>
              </Box>
            </Paper>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Replies ({post.replies.length})
              </Typography>
              
              {post.replies.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    No replies yet. Be the first to reply!
                  </Typography>
                </Paper>
              ) : (
                post.replies.map((reply, index) => (
                  <Paper 
                    key={reply.id} 
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      borderRadius: 2,
                      borderLeft: 4, 
                      borderColor: reply.author.role === 'farmer' ? 'success.main' : 'primary.main' 
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Avatar 
                        src={reply.author.avatar} 
                        alt={reply.author.name}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                            {reply.author.name}
                          </Typography>
                          <Chip 
                            size="small"
                            label={reply.author.role === 'farmer' ? 'Farmer' : 'Consumer'} 
                            color={reply.author.role === 'farmer' ? 'success' : 'primary'}
                            variant="outlined"
                            sx={{ borderRadius: 4 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(reply.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                          {reply.content}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            startIcon={likedReplies.includes(reply.id) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                            onClick={() => toggleLikeReply(reply.id)}
                            color={likedReplies.includes(reply.id) ? 'primary' : 'inherit'}
                          >
                            {reply.likes + (likedReplies.includes(reply.id) ? 1 : 0)}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))
              )}
            </Box>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Add Your Reply
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Write your reply here..."
                value={replyContent}
                onChange={handleReplyChange}
                error={!!submitError}
                helperText={submitError}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={handleSubmitReply}
                  disabled={submitting || !replyContent.trim()}
                >
                  {submitting ? 'Submitting...' : 'Post Reply'}
                </Button>
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ForumDetail;
