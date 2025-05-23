import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PasswordChangeForm from '../Profile/PasswordChangeForm';
import ProfileService from '../../services/ProfileService';

// Mock the ProfileService
jest.mock('../../services/ProfileService', () => ({
  updatePassword: jest.fn()
}));

describe('PasswordChangeForm Component', () => {
  beforeEach(() => {
    // Clear mock calls
    ProfileService.updatePassword.mockClear();
    // Mock successful password update
    ProfileService.updatePassword.mockResolvedValue({ message: 'Password updated successfully' });
  });

  test('renders the password change form with all fields', () => {
    render(<PasswordChangeForm />);
    
    // Check that all fields are rendered
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument(); // Use exact label text
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument(); // Use exact label text
    expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
  });

  test('validates form fields on submission', async () => {
    render(<PasswordChangeForm />);
    
    // Try to submit without filling in any fields
    const submitButton = screen.getByRole('button', { name: /update password/i });
    fireEvent.click(submitButton);
    
    // Check that validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/current password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your new password/i)).toBeInTheDocument();
    });
    
    // ProfileService should not be called
    expect(ProfileService.updatePassword).not.toHaveBeenCalled();
  });

  test('validates password match', async () => {
    render(<PasswordChangeForm />);
    
    // Fill in the form with non-matching passwords
    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'currentPass123' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPass123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'differentPass123' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /update password/i });
    fireEvent.click(submitButton);
    
    // Check that password match error is displayed
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
    
    // ProfileService should not be called
    expect(ProfileService.updatePassword).not.toHaveBeenCalled();
  });

  test('validates minimum password length', async () => {
    render(<PasswordChangeForm />);
    
    // Fill in the form with a short password
    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'currentPass123' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'short' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /update password/i });
    fireEvent.click(submitButton);
    
    // Check that password length error is displayed
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
    
    // ProfileService should not be called
    expect(ProfileService.updatePassword).not.toHaveBeenCalled();
  });

  test('submits form with valid data and shows success message', async () => {
    render(<PasswordChangeForm />);
    
    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'currentPass123' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPass123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'newPass123' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /update password/i });
    fireEvent.click(submitButton);
    
    // Check that ProfileService was called with the correct data
    await waitFor(() => {
      expect(ProfileService.updatePassword).toHaveBeenCalledWith({
        currentPassword: 'currentPass123',
        newPassword: 'newPass123'
      });
    });
    
    // Success message should be displayed
    await waitFor(() => {
      expect(screen.getByText(/password updated successfully/i)).toBeInTheDocument();
    });
    
    // Form should be reset
    expect(screen.getByLabelText(/current password/i)).toHaveValue('');
    expect(screen.getByLabelText('New Password')).toHaveValue('');
    expect(screen.getByLabelText('Confirm New Password')).toHaveValue('');
  });

  test('displays error message when password update fails', async () => {
    // Mock a failed password update
    ProfileService.updatePassword.mockRejectedValueOnce(new Error('Incorrect current password'));
    
    render(<PasswordChangeForm />);
    
    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'wrongPass123' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPass123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'newPass123' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /update password/i });
    fireEvent.click(submitButton);
    
    // Error message should be displayed
    await waitFor(() => {
      expect(screen.getByText(/incorrect current password/i)).toBeInTheDocument();
    });
    
    // Form should not be reset
    expect(screen.getByLabelText(/current password/i)).toHaveValue('wrongPass123');
    expect(screen.getByLabelText('New Password')).toHaveValue('newPass123');
    expect(screen.getByLabelText('Confirm New Password')).toHaveValue('newPass123');
  });
});
