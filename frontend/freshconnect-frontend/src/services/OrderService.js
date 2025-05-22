// Service to handle all order-related API calls
import { mockOrders, getOrderById as getMockOrderById } from '../mockData/ordersMockData';

// Set to true to use mock data, false to use real API
const USE_MOCK_DATA = true;
const API_URL = 'http://localhost:5000/api/orders';

export const OrderService = {
  // Get all orders (automatically filtered by user role in the backend)
  async getOrders() {
    if (USE_MOCK_DATA) {
      console.log('Using mock order data');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockOrders;
    }
    
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Assuming authorization token is stored in localStorage
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getOrders:', error);
      throw error;
    }
  },
  
  // Get a specific order by ID
  async getOrderById(orderId) {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for order ${orderId}`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return getMockOrderById(orderId);
    }
    
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching order details: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getOrderById:', error);
      throw error;
    }
  },
  
  // Create a new order (for consumers)
  async createOrder(orderData) {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for order creation');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Return a mock created order
      return {
        id: `ORD-${Date.now()}`,
        ...orderData,
        status: 'Pending',
        paymentStatus: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error(`Error creating order: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  },
  
  // Update order status (primarily for farmers)
  async updateOrderStatus(orderId, status) {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data to update order ${orderId} status to ${status}`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const order = getMockOrderById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      // In a real app, we would update the backend and get the updated order
      // Here we just return a copy with the updated status
      return { ...order, status, updatedAt: new Date().toISOString() };
    }
    
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating order status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      throw error;
    }
  }
};

export default OrderService;
