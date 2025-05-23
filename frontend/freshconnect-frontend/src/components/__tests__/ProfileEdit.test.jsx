import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfileEdit from '../Profile/ProfileEdit';
import FarmerProfileEdit from '../Profile/FarmerProfileEdit';
import ConsumerProfileEdit from '../Profile/ConsumerProfileEdit';
import PasswordChangeForm from '../Profile/PasswordChangeForm';

// Mock the child components
jest.mock('../Profile/FarmerProfileEdit', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="farmer-profile-edit-mock">Farmer Profile Edit</div>)
}));

jest.mock('../Profile/ConsumerProfileEdit', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="consumer-profile-edit-mock">Consumer Profile Edit</div>)
}));

jest.mock('../Profile/PasswordChangeForm', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="password-change-form-mock">Password Change Form</div>)
}));

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('ProfileEdit Component', () => {
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

  const mockOnUpdate = jest.fn().mockResolvedValue({ success: true, message: 'Profile updated successfully' });

  beforeEach(() => {
    // Clear mock calls
    FarmerProfileEdit.mockClear();
    ConsumerProfileEdit.mockClear();
    PasswordChangeForm.mockClear();
    mockNavigate.mockClear();
    mockOnUpdate.mockClear();
  });

  test('renders farmer profile edit form for farmer user', () => {
    render(
      <MemoryRouter>
        <ProfileEdit userProfile={mockFarmerProfile} onUpdate={mockOnUpdate} />
      </MemoryRouter>
    );

    // Default active tab should be 'personal'
    expect(screen.getByRole('tab', { name: /personal information/i })).toHaveAttribute('aria-selected', 'true');
    
    // Farm Details tab should be present for farmer
    expect(screen.getByRole('tab', { name: /farm details/i })).toBeInTheDocument();
    
    // Preferences tab should not be present for farmer
    expect(screen.queryByRole('tab', { name: /preferences & payment/i })).not.toBeInTheDocument();
    
    // Check that FarmerProfileEdit is rendered with personal section
    expect(FarmerProfileEdit).toHaveBeenCalled();
    expect(FarmerProfileEdit.mock.calls[0][0].section).toBe('personal');
  });

  test('renders consumer profile edit form for consumer user', () => {
    render(
      <MemoryRouter>
        <ProfileEdit userProfile={mockConsumerProfile} onUpdate={mockOnUpdate} />
      </MemoryRouter>
    );

    // Default active tab should be 'personal'
    expect(screen.getByRole('tab', { name: /personal information/i })).toHaveAttribute('aria-selected', 'true');
    
    // Preferences tab should be present for consumer
    expect(screen.getByRole('tab', { name: /preferences & payment/i })).toBeInTheDocument();
    
    // Farm Details tab should not be present for consumer
    expect(screen.queryByRole('tab', { name: /farm details/i })).not.toBeInTheDocument();
    
    // Check that ConsumerProfileEdit is rendered with personal section
    expect(ConsumerProfileEdit).toHaveBeenCalled();
    expect(ConsumerProfileEdit.mock.calls[0][0].section).toBe('personal');
  });

  test('changes content when switching tabs for farmer', () => {
    render(
      <MemoryRouter>
        <ProfileEdit userProfile={mockFarmerProfile} onUpdate={mockOnUpdate} />
      </MemoryRouter>
    );

    // Switch to Farm Details tab
    const farmTab = screen.getByRole('tab', { name: /farm details/i });
    fireEvent.click(farmTab);
    
    // Check that FarmerProfileEdit is called with farm section
    expect(FarmerProfileEdit).toHaveBeenCalledWith(
      expect.objectContaining({ section: 'farm' }),
      expect.anything()
    );
    
    // Switch to Password tab
    const passwordTab = screen.getByRole('tab', { name: /password/i });
    fireEvent.click(passwordTab);
    
    // Check that PasswordChangeForm is rendered
    expect(PasswordChangeForm).toHaveBeenCalled();
  });

  test('changes content when switching tabs for consumer', () => {
    render(
      <MemoryRouter>
        <ProfileEdit userProfile={mockConsumerProfile} onUpdate={mockOnUpdate} />
      </MemoryRouter>
    );

    // Switch to Preferences tab
    const preferencesTab = screen.getByRole('tab', { name: /preferences & payment/i });
    fireEvent.click(preferencesTab);
    
    // Check that ConsumerProfileEdit is called with preferences section
    expect(ConsumerProfileEdit).toHaveBeenCalledWith(
      expect.objectContaining({ section: 'preferences' }),
      expect.anything()
    );
    
    // Switch to Password tab
    const passwordTab = screen.getByRole('tab', { name: /password/i });
    fireEvent.click(passwordTab);
    
    // Check that PasswordChangeForm is rendered
    expect(PasswordChangeForm).toHaveBeenCalled();
  });

  test('handles form submission and calls onUpdate', async () => {
    render(
      <MemoryRouter>
        <ProfileEdit userProfile={mockConsumerProfile} onUpdate={mockOnUpdate} />
      </MemoryRouter>
    );

    // Find and click the Save Changes button
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);
    
    // Check that onUpdate was called
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
    
    // Success message should be displayed
    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    });
  });

  test('navigates back to profile details when cancel button is clicked', () => {
    render(
      <MemoryRouter>
        <ProfileEdit userProfile={mockConsumerProfile} onUpdate={mockOnUpdate} />
      </MemoryRouter>
    );

    // Find and click the Cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  test('handles update failure and displays error message', async () => {
    // Mock a failed update
    const mockFailedUpdate = jest.fn().mockResolvedValue({ 
      success: false, 
      message: 'Failed to update profile' 
    });
    
    render(
      <MemoryRouter>
        <ProfileEdit userProfile={mockConsumerProfile} onUpdate={mockFailedUpdate} />
      </MemoryRouter>
    );

    // Find and click the Save Changes button
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);
    
    // Error message should be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
    });
  });
});
