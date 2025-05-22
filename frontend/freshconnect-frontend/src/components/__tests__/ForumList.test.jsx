import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ForumList from '../Community/ForumList';
import ForumService from '../../services/ForumService';

// Mock the ForumService
jest.mock('../../services/ForumService');

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('ForumList Component', () => {
  const mockPosts = {
    posts: [
      {
        id: 'post-001',
        title: 'Tips for storing fresh vegetables longer',
        content: 'I recently purchased a variety of vegetables from local farmers...',
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
            content: 'For leafy greens, I recommend wrapping them...',
            author: {
              id: 'user-003',
              name: 'Green Valley Farms',
              role: 'farmer',
              avatar: 'https://example.com/avatar2.jpg'
            }
          }
        ]
      },
      {
        id: 'post-002',
        title: 'Growing tomatoes in small spaces',
        content: 'Hello fellow gardening enthusiasts!...',
        author: {
          id: 'user-005',
          name: 'Sarah Williams',
          role: 'consumer',
          avatar: 'https://example.com/avatar3.jpg'
        },
        category: 'gardening',
        createdAt: '2025-05-18T09:15:00Z',
        updatedAt: '2025-05-19T11:20:00Z',
        likes: 24,
        replies: []
      }
    ],
    totalPosts: 2,
    totalPages: 1,
    currentPage: 1
  };

  beforeEach(() => {
    ForumService.getPosts.mockResolvedValue(mockPosts);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders forum posts', async () => {
    render(
      <BrowserRouter>
        <ForumList />
      </BrowserRouter>
    );

    // Check for loading state
    expect(screen.getByText(/loading forum discussions/i)).toBeInTheDocument();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Tips for storing fresh vegetables longer')).toBeInTheDocument();
      expect(screen.getByText('Growing tomatoes in small spaces')).toBeInTheDocument();
    });

    // Check if author names are displayed
    expect(screen.getByText('Emily Johnson')).toBeInTheDocument();
    expect(screen.getByText('Sarah Williams')).toBeInTheDocument();
  });

  test('handles filtering by category', async () => {
    const mockFilteredPosts = {
      posts: [mockPosts.posts[0]],
      totalPosts: 1,
      totalPages: 1,
      currentPage: 1
    };

    // Mock the filtered response
    ForumService.getPosts.mockImplementation((page, limit, category) => {
      if (category === 'food-storage') {
        return Promise.resolve(mockFilteredPosts);
      }
      return Promise.resolve(mockPosts);
    });

    render(
      <BrowserRouter>
        <ForumList />
      </BrowserRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Tips for storing fresh vegetables longer')).toBeInTheDocument();
    });

    // Select the food-storage category
    fireEvent.mouseDown(screen.getByLabelText('Category'));
    
    // Use getAllByText to get all elements with 'Food Storage' text and click the MenuItem
    const foodStorageOptions = screen.getAllByText('Food Storage');
    // Find the MenuItem (second element in the array)
    const menuItem = foodStorageOptions.find(el => el.closest('[role="option"]'));
    fireEvent.click(menuItem);

    // Wait for the re-fetch to happen
    await waitFor(() => {
      expect(ForumService.getPosts).toHaveBeenCalledWith(1, 10, 'food-storage');
    });
  });

  test('handles creating a new post', async () => {
    const newPost = {
      id: 'post-003',
      title: 'New Discussion Topic',
      content: 'This is the content of my new discussion.',
      author: {
        id: 'current-user-id',
        name: 'Current User',
        role: 'consumer',
        avatar: 'https://example.com/avatar4.jpg'
      },
      category: 'general',
      createdAt: '2025-05-22T10:00:00Z',
      updatedAt: '2025-05-22T10:00:00Z',
      likes: 0,
      replies: []
    };

    ForumService.createPost.mockResolvedValue(newPost);
    // Make sure getPosts is properly mocked for the re-fetch
    ForumService.getPosts.mockResolvedValue({
      ...mockPosts,
      posts: [newPost, ...mockPosts.posts]
    });

    render(
      <BrowserRouter>
        <ForumList />
      </BrowserRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Tips for storing fresh vegetables longer')).toBeInTheDocument();
    });

    // Click on "New Discussion" button
    fireEvent.click(screen.getByText('New Discussion'));

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Discussion Topic' } });
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'This is the content of my new discussion.' } });

    // Submit the form
    fireEvent.click(screen.getByText('Create Discussion'));

    // Check that the correct API call was made
    await waitFor(() => {
      expect(ForumService.createPost).toHaveBeenCalledWith({
        title: 'New Discussion Topic',
        content: 'This is the content of my new discussion.',
        category: 'general'
      });
    });
  });

  test('handles error state', async () => {
    // Mock an error response
    ForumService.getPosts.mockRejectedValue(new Error('Failed to fetch posts'));
    
    render(
      <BrowserRouter>
        <ForumList />
      </BrowserRouter>
    );

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to load forum posts/i)).toBeInTheDocument();
    });
  });
});
