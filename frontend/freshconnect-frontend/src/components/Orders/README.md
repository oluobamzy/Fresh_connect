# Orders Management Feature

This directory contains the components for the FreshConnect Orders Management feature. The feature allows consumers to track their purchases and farmers to manage incoming orders.

## Components

### OrderList
A table view of orders with filtering and search capabilities. Shows different information based on user role:
- For consumers: Shows their purchase history with farm information
- For farmers: Shows incoming orders with customer information

### OrderDetails
A detailed view of a specific order, including:
- Order status tracker
- List of products ordered with quantities and prices
- Order total
- Payment information
- Delivery details

### OrderStatusTracker
A component showing the progress of an order through various statuses:
- Pending
- Confirmed
- Processing
- Ready
- Delivered
- Cancelled

For farmers, this component includes controls to update the order status.

## Service

### OrderService
A utility for interacting with the order-related API endpoints:
- getOrders() - Fetches all orders for the current user (filtered by role)
- getOrderById(orderId) - Fetches details for a specific order
- createOrder(orderData) - Creates a new order (for consumers)
- updateOrderStatus(orderId, status) - Updates the status of an order (for farmers)

## Usage

The Orders feature is accessed through the `/orders` route in the application. It contains nested routes:
- `/orders` - Shows the order list view
- `/orders/:orderId` - Shows the details for a specific order

Role-based access control ensures that consumers and farmers see appropriate views and actions.

## Testing

Each component has corresponding test files in the `__tests__` directory:
- OrderList.test.jsx
- OrderStatusTracker.test.jsx
- OrderDetails.test.jsx

## Future Enhancements

- Order notifications
- Order history export
- Order cancellation with refund requests
- Delivery tracking integration
