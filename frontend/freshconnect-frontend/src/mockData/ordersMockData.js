// Mock data for Orders Management feature
export const mockOrders = [
  {
    id: 'ORD-2023-001',
    consumerName: 'Alice Johnson',
    consumerEmail: 'alice@example.com',
    farmerName: 'Green Valley Farms',
    farmLocation: '123 Valley Road, Greenfield',
    deliveryAddress: '789 Oak Street, Springfield',
    deliveryNotes: 'Please leave at the front door',
    createdAt: '2023-05-10T14:30:00Z',
    updatedAt: '2023-05-10T16:45:00Z',
    productItems: [
      { 
        productId: 'PROD-001', 
        name: 'Organic Apples', 
        price: 4.99, 
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500&auto=format&fit=crop'
      },
      { 
        productId: 'PROD-002', 
        name: 'Fresh Spinach', 
        price: 3.49, 
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop'
      },
      { 
        productId: 'PROD-003', 
        name: 'Free Range Eggs', 
        price: 5.99, 
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop'
      }
    ],
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-2023-002',
    consumerName: 'Bob Smith',
    consumerEmail: 'bob@example.com',
    farmerName: 'Sunrise Organic Farm',
    farmLocation: '456 Sunrise Lane, Farmville',
    deliveryAddress: '101 Pine Avenue, Metropolis',
    deliveryNotes: 'Call before delivery',
    createdAt: '2023-05-15T09:15:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
    productItems: [
      { 
        productId: 'PROD-004', 
        name: 'Grass-fed Beef', 
        price: 12.99, 
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format&fit=crop'
      },
      { 
        productId: 'PROD-005', 
        name: 'Organic Tomatoes', 
        price: 3.99, 
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1524593166156-312f362cada0?w=500&auto=format&fit=crop'
      }
    ],
    status: 'Processing',
    paymentStatus: 'Paid',
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-2023-003',
    consumerName: 'Charlie Davis',
    consumerEmail: 'charlie@example.com',
    farmerName: 'Hillside Harvest',
    farmLocation: '789 Hill Road, Countryside',
    deliveryAddress: '202 Maple Street, Downtown',
    deliveryNotes: '',
    createdAt: '2023-05-18T16:45:00Z',
    updatedAt: '2023-05-18T18:00:00Z',
    productItems: [
      { 
        productId: 'PROD-006', 
        name: 'Fresh Strawberries', 
        price: 6.99, 
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop'
      },
      { 
        productId: 'PROD-007', 
        name: 'Organic Milk', 
        price: 4.49, 
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop'
      },
      { 
        productId: 'PROD-008', 
        name: 'Honey', 
        price: 8.99, 
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&auto=format&fit=crop'
      }
    ],
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-2023-004',
    consumerName: 'Dana Wilson',
    consumerEmail: 'dana@example.com',
    farmerName: 'Green Valley Farms',
    farmLocation: '123 Valley Road, Greenfield',
    deliveryAddress: '303 Cedar Boulevard, Suburbia',
    deliveryNotes: 'Weekend delivery preferred',
    createdAt: '2023-05-20T11:30:00Z',
    updatedAt: '2023-05-20T12:45:00Z',
    productItems: [
      { 
        productId: 'PROD-009', 
        name: 'Organic Lettuce', 
        price: 2.99, 
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&auto=format&fit=crop'
      },
      { 
        productId: 'PROD-010', 
        name: 'Fresh Blueberries', 
        price: 5.99, 
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&auto=format&fit=crop'
      }
    ],
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'ORD-2023-005',
    consumerName: 'Eve Brown',
    consumerEmail: 'eve@example.com',
    farmerName: 'Sunrise Organic Farm',
    farmLocation: '456 Sunrise Lane, Farmville',
    deliveryAddress: '404 Birch Road, Riverside',
    deliveryNotes: '',
    createdAt: '2023-05-21T15:00:00Z',
    updatedAt: '2023-05-21T15:15:00Z',
    productItems: [
      { 
        productId: 'PROD-011', 
        name: 'Organic Carrots', 
        price: 3.49, 
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop'
      },
      { 
        productId: 'PROD-012', 
        name: 'Free Range Chicken', 
        price: 9.99, 
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&auto=format&fit=crop'
      }
    ],
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    paymentMethod: 'Credit Card'
  }
];

// Helper function to get an order by ID
export const getOrderById = (orderId) => {
  return mockOrders.find(order => order.id === orderId) || null;
};

// Helper function to filter orders by user role
export const getOrdersByRole = (role, userId) => {
  // In a real app, we would filter based on the userID
  // For the mock data, we'll just return all orders
  return mockOrders;
};

// Export both named exports and a default export
export default {
  mockOrders,
  getOrderById,
  getOrdersByRole
};
