import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfileDetails from '../Profile/ProfileDetails';
import FarmerProfileDetails from '../Profile/FarmerProfileDetails';
import ConsumerProfileDetails from '../Profile/ConsumerProfileDetails';

// Mock the child components
jest.mock('../Profile/FarmerProfileDetails', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="farmer-profile-details-mock">Farmer Profile Details</div>)
}));

jest.mock('../Profile/ConsumerProfileDetails', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="consumer-profile-details-mock">Consumer Profile Details</div>)
}));

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('ProfileDetails Component', () => {
  const mockFarmerProfile = {
    id: 'farmer123',
    name: 'Farmer Joe',
    email: 'joe@farm.com',
    role: 'farmer',
    isActive: true,
    isVerified: true,
    createdAt: '2025-05-01T00:00:00.000Z',
    farmDetails: {
      name: 'Green Acres Farm',
      location: 'Countryside, ON',
      farmingMethod: 'Organic',
      deliveryOptions: 'Local Delivery, Farm Pickup',
      description: 'Family-owned organic farm since 2015',
      specialties: ['Tomatoes', 'Lettuce', 'Herbs']
    }
  };

  const mockConsumerProfile = {
    id: 'consumer123',
    name: 'Consumer Jane',
    email: 'jane@example.com',
    role: 'consumer',
    isActive: true,
    createdAt: '2025-05-01T00:00:00.000Z',
    foodPreferences: {
      restrictions: ['Gluten-free'],
      favorites: ['Apples', 'Berries']
    },
    paymentMethods: [
      {
        type: 'Credit Card',
        lastFour: '4242',
        expiryMonth: '12',
        expiryYear: '27',
        isDefault: true
      }
    ],
    addresses: [
      {
        name: 'Home',
        street: '123 Main St',
        city: 'Anytown',
        province: 'ON',
        postalCode: 'A1B 2C3',
        isDefault: true
      }
    ]
  };

  beforeEach(() => {
    // Clear mock calls
    FarmerProfileDetails.mockClear();
    ConsumerProfileDetails.mockClear();
    mockNavigate.mockClear();
  });

  test('renders farmer profile details for farmer user', () => {
    render(
      <MemoryRouter>
        <ProfileDetails userProfile={mockFarmerProfile} />
      </MemoryRouter>
    );

    // Basic user info should be displayed
    expect(screen.getAllByText('Farmer Joe')[0]).toBeInTheDocument(); // Use getAllByText instead of getByText
    expect(screen.getByText('Farmer')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();

    // Check that FarmerProfileDetails is rendered and ConsumerProfileDetails is not
    expect(screen.getByTestId('farmer-profile-details-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('consumer-profile-details-mock')).not.toBeInTheDocument();

    // Check that FarmerProfileDetails was called with the user profile
    expect(FarmerProfileDetails).toHaveBeenCalledWith({ userProfile: mockFarmerProfile }, {});
  });

  test('renders consumer profile details for consumer user', () => {
    render(
      <MemoryRouter>
        <ProfileDetails userProfile={mockConsumerProfile} />
      </MemoryRouter>
    );

    // Basic user info should be displayed
    expect(screen.getAllByText('Consumer Jane')[0]).toBeInTheDocument(); // Use getAllByText instead of getByText
    expect(screen.getByText('Consumer')).toBeInTheDocument();

    // Check that ConsumerProfileDetails is rendered and FarmerProfileDetails is not
    expect(screen.getByTestId('consumer-profile-details-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('farmer-profile-details-mock')).not.toBeInTheDocument();

    // Check that ConsumerProfileDetails was called with the user profile
    expect(ConsumerProfileDetails).toHaveBeenCalledWith({ userProfile: mockConsumerProfile }, {});
  });

  test('navigates to edit profile page when Edit Profile button is clicked', () => {
    render(
      <MemoryRouter>
        <ProfileDetails userProfile={mockConsumerProfile} />
      </MemoryRouter>
    );

    // Find and click the Edit Profile button
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    fireEvent.click(editButton);

    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/profile/edit');
  });

  test('navigates to orders page when Order History button is clicked', () => {
    render(
      <MemoryRouter>
        <ProfileDetails userProfile={mockConsumerProfile} />
      </MemoryRouter>
    );

    // Find and click the Order History button
    const ordersButton = screen.getByRole('button', { name: /order history/i });
    fireEvent.click(ordersButton);

    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/orders');
  });

  test('displays account information correctly', () => {
    render(
      <MemoryRouter>
        <ProfileDetails userProfile={mockConsumerProfile} />
      </MemoryRouter>
    );

    // Check that account information is displayed correctly
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getAllByText('Consumer Jane')).toHaveLength(2); // Check that name appears twice
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Member Since')).toBeInTheDocument();
    expect(screen.getByText('Account Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
