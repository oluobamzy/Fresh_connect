// Mock for OrderService
const OrderService = {
  getOrders: jest.fn(),
  getOrderById: jest.fn(),
  updateOrderStatus: jest.fn(),
  createOrder: jest.fn()
};

export default OrderService;
