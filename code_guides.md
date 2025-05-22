# FreshConnect Code Guides

This document maps out the core components, pages, models, and API endpoints required to implement the FreshConnect platform as described in the implementation plan.

---

## 1. Components

### Shared Components
- Header/Navbar
- Footer
- Sidebar (Admin/Farmer dashboards)
- Notification/Alert
- Modal/Dialog
- Form Input (Text, Select, Checkbox, etc.)
- Loader/Spinner

### User Onboarding
- Farmer Registration Form
- Consumer Registration Form
- Email Verification Component
- Profile Review/Admin Approval Component

### Marketplace
- Product List/Grid
- Product Filter/Search
- Product Detail Card
- Add to Cart Button
- Cart/Checkout Summary

### Orders
- Order Status Tracker
- Order Confirmation Modal
- Farmer Order Notification
- Order Management Table (Farmer/Admin)

### Payments
- Payment Method Selector
- Payment Status Indicator
- Refund Request/Processing Component

### Community
- Recipe Suggestions Widget
- Forum Thread List
- Forum Post/Reply Editor

### AI/Automation
- Recommendation Carousel
- Chatbot Widget

### Admin
- User Management Table
- Dispute Resolution Panel
- Analytics Dashboard

---

## 2. Pages

- Home
- Login
- Register (Farmer/Consumer)
- Product Marketplace
- Product Details
- Cart/Checkout
- Order History (Consumer)
- Order Management (Farmer)
- Profile (Farmer/Consumer)
- Admin Dashboard
  - User Management
  - Dispute Resolution
  - Refund Management
  - Analytics
- Forum
- Recipe Suggestions
- Support/Chat
- 404/Not Found

---

## 3. Data Models (Simplified)

### User (Farmer/Consumer)
- id
- name
- email
- passwordHash
- role (farmer/consumer/admin)
- foodPreferences (consumer)
- paymentMethods (consumer)
- farmDetails (farmer)
- isVerified (farmer)
- isActive

### Product
- id
- farmerId
- name
- description
- category
- price
- quantityAvailable
- location
- images
- isActive

### Order
- id
- consumerId
- farmerId
- productItems [{productId, quantity, price}]
- status (Pending, Confirmed, Delivered, Cancelled)
- paymentStatus (Pending, Paid, Refunded)
- createdAt
- updatedAt

### Payment
- id
- orderId
- amount
- method
- status
- transactionId
- createdAt

### ForumPost
- id
- userId
- title
- content
- createdAt
- replies [{userId, content, createdAt}]
- isModerated

### RecipeSuggestion
- id
- userId
- productIds
- recipeText
- createdAt

### Dispute
- id
- userId
- orderId
- description
- status (Open, Resolved, Escalated)
- adminNotes
- createdAt

---

## 4. API Endpoints (RESTful Example)

### Auth
- POST   /api/auth/register (farmer/consumer)
- POST   /api/auth/login
- POST   /api/auth/verify-email
- POST   /api/auth/logout

### Users
- GET    /api/users/me
- PATCH  /api/users/me
- GET    /api/users (admin)
- PATCH  /api/users/:id (admin)
- DELETE /api/users/:id (admin)

### Products
- GET    /api/products
- GET    /api/products/:id
- POST   /api/products (farmer)
- PATCH  /api/products/:id (farmer)
- DELETE /api/products/:id (farmer)

### Orders
- POST   /api/orders
- GET    /api/orders (consumer/farmer)
- GET    /api/orders/:id
- PATCH  /api/orders/:id (farmer/admin)

### Payments
- POST   /api/payments
- GET    /api/payments/:orderId
- POST   /api/payments/refund (admin)

### Forum
- GET    /api/forum/posts
- POST   /api/forum/posts
- GET    /api/forum/posts/:id
- POST   /api/forum/posts/:id/reply
- PATCH  /api/forum/posts/:id (moderator)

### Recipes
- GET    /api/recipes/suggestions (user)

### Recommendations
- GET    /api/recommendations (user)

### Chatbot
- POST   /api/chatbot/query

### Disputes
- POST   /api/disputes
- GET    /api/disputes (admin)
- PATCH  /api/disputes/:id (admin)

### Analytics
- GET    /api/analytics/overview (admin)
- GET    /api/analytics/sales (admin)
- GET    /api/analytics/users (admin)

---

*This guide provides a high-level map for developers to structure the FreshConnect codebase and APIs.*
