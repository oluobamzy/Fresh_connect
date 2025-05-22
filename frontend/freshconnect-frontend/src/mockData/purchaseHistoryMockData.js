// Mock purchase history data for development
const purchaseHistory = [
  {
    id: 'order-001',
    date: '2025-05-15',
    items: [
      {
        id: 'prod-tomato',
        name: 'Organic Tomatoes',
        quantity: 2,
        price: 3.99
      },
      {
        id: 'prod-cucumber',
        name: 'Cucumber',
        quantity: 1,
        price: 1.49
      },
      {
        id: 'prod-lettuce',
        name: 'Mixed Greens',
        quantity: 1,
        price: 4.99
      }
    ],
    farmer: 'Green Valley Farms',
    total: 14.46
  },
  {
    id: 'order-002',
    date: '2025-05-10',
    items: [
      {
        id: 'prod-beef',
        name: 'Grass-fed Beef',
        quantity: 1,
        price: 12.99
      },
      {
        id: 'prod-carrot',
        name: 'Organic Carrots',
        quantity: 1,
        price: 2.99
      },
      {
        id: 'prod-potato',
        name: 'Gold Potatoes',
        quantity: 2,
        price: 3.49
      }
    ],
    farmer: 'Meadow Ranch',
    total: 22.96
  },
  {
    id: 'order-003',
    date: '2025-05-05',
    items: [
      {
        id: 'prod-strawberry',
        name: 'Fresh Strawberries',
        quantity: 1,
        price: 5.99
      },
      {
        id: 'prod-blueberry',
        name: 'Organic Blueberries',
        quantity: 1,
        price: 6.49
      },
      {
        id: 'prod-yogurt',
        name: 'Plain Greek Yogurt',
        quantity: 1,
        price: 4.99
      }
    ],
    farmer: 'Sunrise Organic',
    total: 17.47
  }
];

export default purchaseHistory;
