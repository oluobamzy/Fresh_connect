// Service for community forum API
import axios from 'axios';

// Base API URL - would be configured from environment in production
const API_URL = 'http://localhost:3000/api';

// Mock forum posts data
const mockForumPosts = [
  {
    id: 'post-001',
    title: 'Tips for storing fresh vegetables longer',
    content: 'I recently purchased a variety of vegetables from local farmers, and I\'m looking for tips on how to store them properly to maximize their freshness. Any advice from experienced consumers or farmers?',
    userId: 'user-002',
    author: {
      id: 'user-002',
      name: 'Emily Johnson',
      role: 'consumer',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    category: 'food-storage',
    createdAt: '2025-05-20T14:30:00Z',
    updatedAt: '2025-05-20T16:45:00Z',
    likes: 12,
    replies: [
      {
        id: 'reply-001',
        content: 'For leafy greens, I recommend wrapping them in a slightly damp paper towel and storing them in an airtight container in the refrigerator.',
        userId: 'user-003',
        author: {
          id: 'user-003',
          name: 'Green Valley Farms',
          role: 'farmer',
          avatar: 'https://i.pravatar.cc/150?img=12'
        },
        createdAt: '2025-05-20T15:10:00Z',
        likes: 8
      },
      {
        id: 'reply-002',
        content: 'Root vegetables like carrots and beets last longer if you remove the greens before storing.',
        userId: 'user-004',
        author: {
          id: 'user-004',
          name: 'Michael Chen',
          role: 'consumer',
          avatar: 'https://i.pravatar.cc/150?img=3'
        },
        createdAt: '2025-05-20T16:45:00Z',
        likes: 5
      }
    ],
    isModerated: true
  },
  {
    id: 'post-002',
    title: 'Growing tomatoes in small spaces - Urban gardening',
    content: 'Hello fellow gardening enthusiasts! I live in an apartment with a small balcony and want to try growing my own tomatoes.',
    userId: 'user-005',
    author: {
      id: 'user-005',
      name: 'Sarah Williams',
      role: 'consumer',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    category: 'gardening',
    createdAt: '2025-05-18T09:15:00Z',
    updatedAt: '2025-05-19T11:20:00Z',
    likes: 24,
    replies: [
      {
        id: 'reply-003',
        content: 'Cherry tomatoes like "Tiny Tim" or "Tumbling Tom" are great for balconies.',
        userId: 'user-006',
        author: {
          id: 'user-006',
          name: 'Sunrise Organic',
          role: 'farmer',
          avatar: 'https://i.pravatar.cc/150?img=15'
        },
        createdAt: '2025-05-18T10:30:00Z',
        likes: 13
      },
      {
        id: 'reply-004',
        content: 'I\'ve had success with "Balcony Beauty" tomatoes in hanging baskets. They\'re determinate tomatoes, so they won\'t grow too large for your space. Just make sure they get at least 6 hours of sunlight daily!',
        userId: 'user-007',
        author: {
          id: 'user-007',
          name: 'Alex Rodriguez',
          role: 'consumer',
          avatar: 'https://i.pravatar.cc/150?img=7'
        },
        createdAt: '2025-05-18T14:45:00Z',
        likes: 9
      },
      {
        id: 'reply-005',
        content: 'Don\'t forget to fertilize regularly! I use a liquid organic fertilizer every two weeks.',
        userId: 'user-003',
        author: {
          id: 'user-003',
          name: 'Green Valley Farms',
          role: 'farmer',
          avatar: 'https://i.pravatar.cc/150?img=12'
        },
        createdAt: '2025-05-19T11:20:00Z',
        likes: 7
      }
    ],
    isModerated: true
  },
  {
    id: 'post-003',
    title: 'Best seasonal fruits for summer preserves',
    content: 'Summer is approaching, and I\'m planning to make preserves this year. Which fruits would you recommend?',
    userId: 'user-008',
    author: {
      id: 'user-008',
      name: 'David Thompson',
      role: 'consumer',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    category: 'food-preservation',
    createdAt: '2025-05-15T16:20:00Z',
    updatedAt: '2025-05-17T08:30:00Z',
    likes: 18,
    replies: [
      {
        id: 'reply-006',
        content: 'Strawberries and blackberries make wonderful preserves. Try low-sugar pectin.',
        userId: 'user-009',
        author: {
          id: 'user-009',
          name: 'Berry Good Farm',
          role: 'farmer',
          avatar: 'https://i.pravatar.cc/150?img=13'
        },
        createdAt: '2025-05-15T17:30:00Z',
        likes: 6
      },
      {
        id: 'reply-007',
        content: 'Plums and sour cherries are great for preserves, and not too sweet.',
        userId: 'user-010',
        author: {
          id: 'user-010',
          name: 'Jessica Lee',
          role: 'consumer',
          avatar: 'https://i.pravatar.cc/150?img=10'
        },
        createdAt: '2025-05-16T10:15:00Z',
        likes: 4
      }
    ],
    isModerated: true
  },
  {
    id: 'post-004',
    title: 'Seeking recommendations for organic pest control',
    content: 'I\'m growing vegetables and want to avoid chemical pesticides.',
    userId: 'user-011',
    author: {
      id: 'user-011',
      name: 'Robert Garcia',
      role: 'consumer',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    category: 'gardening',
    createdAt: '2025-05-12T13:40:00Z',
    updatedAt: '2025-05-14T09:25:00Z',
    likes: 32,
    replies: [
      {
        id: 'reply-008',
        content: 'Neem oil for aphids and Bt for caterpillars are both effective and organic.',
        userId: 'user-006',
        author: {
          id: 'user-006',
          name: 'Sunrise Organic',
          role: 'farmer',
          avatar: 'https://i.pravatar.cc/150?img=15'
        },
        createdAt: '2025-05-12T14:20:00Z',
        likes: 15
      },
      {
        id: 'reply-009',
        content: 'Try companion planting with marigolds or garlic to repel pests.',
        userId: 'user-012',
        author: {
          id: 'user-012',
          name: 'Meadow Ranch',
          role: 'farmer',
          avatar: 'https://i.pravatar.cc/150?img=14'
        },
        createdAt: '2025-05-13T08:50:00Z',
        likes: 11
      },
      {
        id: 'reply-010',
        content: 'Homemade dish soap spray works well. Just avoid degreasers.',
        userId: 'user-007',
        author: {
          id: 'user-007',
          name: 'Alex Rodriguez',
          role: 'consumer',
          avatar: 'https://i.pravatar.cc/150?img=7'
        },
        createdAt: '2025-05-14T09:25:00Z',
        likes: 8
      }
    ],
    isModerated: true
  },
  {
    id: 'post-005',
    title: 'How to support local farmers year-round?',
    content: 'I love the farmers market in summer, but want to support local agriculture all year.',
    userId: 'user-013',
    author: {
      id: 'user-013',
      name: 'Lisa Mitchell',
      role: 'consumer',
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    category: 'community',
    createdAt: '2025-05-08T11:10:00Z',
    updatedAt: '2025-05-10T15:35:00Z',
    likes: 45,
    replies: [
      {
        id: 'reply-011',
        content: 'Winter crops and farm stores are great options.',
        userId: 'user-003',
        author: {
          id: 'user-003',
          name: 'Green Valley Farms',
          role: 'farmer',
          avatar: 'https://i.pravatar.cc/150?img=12'
        },
        createdAt: '2025-05-08T12:05:00Z',
        likes: 18
      },
      {
        id: 'reply-012',
        content: 'Some farms offer meat, eggs, or indoor greens during winter.',
        userId: 'user-012',
        author: {
          id: 'user-012',
          name: 'Meadow Ranch',
          role: 'farmer',
          avatar: 'https://i.pravatar.cc/150?img=14'
        },
        createdAt: '2025-05-09T09:40:00Z',
        likes: 12
      },
      {
        id: 'reply-013',
        content: 'Preserve food during peak season—freezing or canning helps!',
        userId: 'user-010',
        author: {
          id: 'user-010',
          name: 'Jessica Lee',
          role: 'consumer',
          avatar: 'https://i.pravatar.cc/150?img=10'
        },
        createdAt: '2025-05-10T15:35:00Z',
        likes: 9
      }
    ],
    isModerated: true
  }
];

class ForumService {
  async getPosts(page = 1, limit = 10, category = null) {
    try {
      // return await axios.get(`${API_URL}/forum/posts`, { params: { page, limit, category } });
      return this.getMockPosts(page, limit, category);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      throw error;
    }
  }

  async getPost(postId) {
    try {
      // return await axios.get(`${API_URL}/forum/posts/${postId}`);
      return this.getMockPostDetails(postId);
    } catch (error) {
      console.error('Error fetching forum post:', error);
      throw error;
    }
  }

  async createPost(postData) {
    try {
      // return await axios.post(`${API_URL}/forum/posts`, postData);
      return this.createMockPost(postData);
    } catch (error) {
      console.error('Error creating forum post:', error);
      throw error;
    }
  }

  async addReply(postId, replyData) {
    try {
      // return await axios.post(`${API_URL}/forum/posts/${postId}/reply`, replyData);
      return this.addMockReply(postId, replyData);
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  }

  // Mock Methods
  async getMockPosts(page = 1, limit = 10, category = null) {
    await new Promise(resolve => setTimeout(resolve, 800));
    let filteredPosts = [...mockForumPosts];
    if (category) filteredPosts = filteredPosts.filter(post => post.category === category);
    const startIndex = (page - 1) * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);
    return {
      posts: paginatedPosts,
      totalPosts: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limit),
      currentPage: page
    };
  }

  async getMockPostDetails(postId) {
    await new Promise(resolve => setTimeout(resolve, 600));
    const post = mockForumPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async createMockPost(postData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Generate a unique ID with timestamp + random string to prevent duplicates
    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: postData.title,
      content: postData.content,
      userId: 'current-user-id',
      author: {
        id: 'current-user-id',
        name: 'Current User',
        role: 'consumer',
        avatar: 'https://i.pravatar.cc/150?img=11'
      },
      category: postData.category || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      isModerated: true
    };
    mockForumPosts.unshift(newPost);
    return newPost;
  }

  async addMockReply(postId, replyData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const post = mockForumPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    const newReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: replyData.content,
      userId: 'current-user-id',
      author: {
        id: 'current-user-id',
        name: 'Current User',
        role: 'consumer',
        avatar: 'https://i.pravatar.cc/150?img=11'
      },
      createdAt: new Date().toISOString(),
      likes: 0
    };
    post.replies.push(newReply);
    post.updatedAt = new Date().toISOString();
    return { post, reply: newReply };
  }
}

export default new ForumService();
