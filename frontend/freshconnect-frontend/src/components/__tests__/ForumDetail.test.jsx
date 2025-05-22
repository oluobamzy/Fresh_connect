import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ForumDetail from '../Community/ForumDetail';
import ForumService from '../../services/ForumService';

// Mock the ForumService
jest.mock('../../services/ForumService');

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('ForumDetail Component', () => {
  const mockPost = {
    id: 'post-001',
    title: 'Tips for storing fresh vegetables longer',
    content: 'I recently purchased a variety of vegetables from local farmers, and I\'m looking for tips on how to store them properly to maximize their freshness. Any advice from experienced consumers or farmers?',
    author: {
      id: 'user-002',
      name: 'Emily Johnson',
      role: 'consumer',
      avatar: 'https://example.com/avatar1.jpg'
    },
    category: 'food-storage',
    createdAt: '2025-05-20T14:30:00Z',
    updatedAt: '2025-05-20T16:45:00Z',
    likes: 12,
    replies: [
      {
        id: 'reply-001',
        content: 'For leafy greens, I recommend wrapping them in a slightly damp paper towel and storing them in an airtight container in the refrigerator.',
        author: {
          id: 'user-003',
          name: 'Green Valley Farms',
          role: 'farmer',
          avatar: 'https://example.com/avatar2.jpg'
        },
        createdAt: '2025-05-20T15:10:00Z',
        likes: 8
      }
    ]
  };

  const mockReplyResponse = {
    post: {
      ...mockPost,
      replies: [
        ...mockPost.replies,
        {
          id: 'reply-002',
          content: 'Test reply content',
          author: {
            id: 'current-user-id',
            name: 'Current User',
            role: 'consumer',
            avatar: 'https://example.com/avatar3.jpg'
          },
          createdAt: '2025-05-22T10:00:00Z',
          likes: 0
        }
      ]
    },
    reply: {
      id: 'reply-002',
      content: 'Test reply content',
      author: {
        id: 'current-user-id',
        name: 'Current User',
        role: 'consumer',
        avatar: 'https://example.com/avatar3.jpg'
      },
      createdAt: '2025-05-22T10:00:00Z',
      likes: 0
    }
  };

  beforeEach(() => {
    ForumService.getPost.mockResolvedValue(mockPost);
    ForumService.addReply.mockResolvedValue(mockReplyResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (ui, { route = '/forum/post-001' } = {}) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/forum/:postId" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders post details correctly', async () => {
    renderWithRouter(<ForumDetail />);

    // Check for loading state
    expect(screen.getByText(/loading discussion/i)).toBeInTheDocument();

    // Wait for post to load
    await waitFor(() => {
      expect(screen.getByText('Tips for storing fresh vegetables longer')).toBeInTheDocument();
    });

    // Check if content is displayed
    expect(screen.getByText(mockPost.content)).toBeInTheDocument();
    expect(screen.getByText('Emily Johnson')).toBeInTheDocument();
    expect(screen.getByText(mockPost.replies[0].content)).toBeInTheDocument();
    expect(screen.getByText('Green Valley Farms')).toBeInTheDocument();
  });

  test('allows adding a new reply', async () => {
    renderWithRouter(<ForumDetail />);

    // Wait for post to load
    await waitFor(() => {
      expect(screen.getByText('Tips for storing fresh vegetables longer')).toBeInTheDocument();
    });

    // Add a reply
    const replyInput = screen.getByPlaceholderText('Write your reply here...');
    fireEvent.change(replyInput, { target: { value: 'Test reply content' } });
    
    // Submit the reply
    const submitButton = screen.getByText('Post Reply');
    fireEvent.click(submitButton);

    // Check that the correct API call was made
    await waitFor(() => {
      expect(ForumService.addReply).toHaveBeenCalledWith('post-001', { content: 'Test reply content' });
    });
  });

  test('handles empty reply submission', async () => {
    renderWithRouter(<ForumDetail />);

    // Wait for post to load
    await waitFor(() => {
      expect(screen.getByText('Tips for storing fresh vegetables longer')).toBeInTheDocument();
    });

    // Try to submit an empty reply
    const submitButton = screen.getByText('Post Reply');
    
    // Submit button should be disabled for empty input
    expect(submitButton).toBeDisabled();
  });

  test('handles error when loading post', async () => {
    // Mock an error response
    ForumService.getPost.mockRejectedValue(new Error('Failed to fetch post'));
    
    renderWithRouter(<ForumDetail />);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to load discussion/i)).toBeInTheDocument();
    });

    // Check for back button
    expect(screen.getByText('Back to Forum')).toBeInTheDocument();
  });

  test('handles toggling like on a post', async () => {
    renderWithRouter(<ForumDetail />);

    // Wait for post to load
    await waitFor(() => {
      expect(screen.getByText('Tips for storing fresh vegetables longer')).toBeInTheDocument();
    });

    // Find and click the like button
    const likeButton = screen.getByText(/like/i, { selector: 'button' });
    fireEvent.click(likeButton);

    // Check that the button text changed to "Liked"
    expect(screen.getByText(/liked/i)).toBeInTheDocument();
    
    // Check that the likes count increased
    expect(screen.getByText(/liked \(13\)/i)).toBeInTheDocument();
  });
});
