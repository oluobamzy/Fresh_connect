import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProfileContainer from '../ProfileContainer';
import ProfileDetails from '../Profile/ProfileDetails';
import ProfileEdit from '../Profile/ProfileEdit';
import ProfileService from '../../services/ProfileService';

// Mock the child components
jest.mock('../Profile/ProfileDetails', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="profile-details-mock">Profile Details Component</div>)
}));

jest.mock('../Profile/ProfileEdit', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="profile-edit-mock">Profile Edit Component</div>)
}));

// Mock the ProfileService
jest.mock('../../services/ProfileService', () => ({
  getProfile: jest.fn(),
  updateProfile: jest.fn()
}));

describe('ProfileContainer Component', () => {
  const mockUserProfile = {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'consumer',
    isActive: true,
    createdAt: '2025-05-01T00:00:00.000Z',
    foodPreferences: {
      restrictions: ['Gluten-free', 'Vegan'],
      favorites: ['Apples', 'Tomatoes']
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
    ProfileDetails.mockClear();
    ProfileEdit.mockClear();
    ProfileService.getProfile.mockResolvedValue(mockUserProfile);
    ProfileService.updateProfile.mockResolvedValue({ user: mockUserProfile, message: 'Profile updated successfully' });
  });

  test('renders loader while fetching profile data', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile/*" element={<ProfileContainer />} />
        </Routes>
      </MemoryRouter>
    );

    // Loader should be displayed initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for the profile data to load
    await waitFor(() => {
      expect(ProfileService.getProfile).toHaveBeenCalled();
    });
  });

  test('renders ProfileDetails for the base profile route', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile/*" element={<ProfileContainer />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the profile data to load
    await waitFor(() => {
      expect(screen.getByTestId('profile-details-mock')).toBeInTheDocument();
      // ProfileEdit should not be rendered
      expect(screen.queryByTestId('profile-edit-mock')).not.toBeInTheDocument();
    });
    
    // Check if ProfileDetails was called with the user profile
    expect(ProfileDetails).toHaveBeenCalled();
    const props = ProfileDetails.mock.calls[0][0];
    expect(props.userProfile).toEqual(mockUserProfile);
  });

  test('renders ProfileEdit for the edit route', async () => {
    render(
      <MemoryRouter initialEntries={['/profile/edit']}>
        <Routes>
          <Route path="/profile/*" element={<ProfileContainer />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the profile data to load
    await waitFor(() => {
      expect(screen.getByTestId('profile-edit-mock')).toBeInTheDocument();
      // ProfileDetails should not be rendered
      expect(screen.queryByTestId('profile-details-mock')).not.toBeInTheDocument();
    });
    
    // Check if ProfileEdit was called with the user profile and onUpdate prop
    expect(ProfileEdit).toHaveBeenCalled();
    const props = ProfileEdit.mock.calls[0][0];
    expect(props.userProfile).toEqual(mockUserProfile);
    expect(typeof props.onUpdate).toBe('function');
  });

  test('changes tab and navigates when clicking tabs', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile/*" element={<ProfileContainer />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for the profile data to load
    await waitFor(() => {
      expect(screen.getByTestId('profile-details-mock')).toBeInTheDocument();
    });
    
    // Find the "Edit Profile" tab
    const editTab = screen.getByRole('tab', { name: /edit profile/i });
    
    // Click the tab
    await user.click(editTab);
    
    // Check that ProfileEdit is now rendered instead of ProfileDetails
    await waitFor(() => {
      expect(ProfileEdit).toHaveBeenCalled();
    });
  });

  test('handles profile update and navigates back to profile details', async () => {
    render(
      <MemoryRouter initialEntries={['/profile/edit']}>
        <Routes>
          <Route path="/profile/*" element={<ProfileContainer />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for the profile data to load
    await waitFor(() => {
      expect(screen.getByTestId('profile-edit-mock')).toBeInTheDocument();
    });
    
    // Get the onUpdate function from the props passed to ProfileEdit
    const props = ProfileEdit.mock.calls[0][0];
    const onUpdate = props.onUpdate;
    
    // Call the onUpdate function with updated profile data
    const updatedProfile = { ...mockUserProfile, name: 'Updated Name' };
    await onUpdate(updatedProfile);
    
    // Check that updateProfile was called with the updated profile
    expect(ProfileService.updateProfile).toHaveBeenCalledWith(updatedProfile);
  });

  test('displays error message when profile fetch fails', async () => {
    // Mock a failed API call
    ProfileService.getProfile.mockRejectedValueOnce(new Error('Failed to fetch profile'));
    
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile/*" element={<ProfileContainer />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/failed to load profile data/i)).toBeInTheDocument();
    });
    
    // No profile components should be rendered
    expect(screen.queryByTestId('profile-details-mock')).not.toBeInTheDocument();
    expect(screen.queryByTestId('profile-edit-mock')).not.toBeInTheDocument();
  });
});
