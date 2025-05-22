import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FarmerRegistrationForm from '../FarmerRegistrationForm';
import { ThemeProvider, createTheme } from '@mui/material/styles';

global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

describe('FarmerRegistrationForm', () => {
  it('renders and submits the form', async () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <FarmerRegistrationForm />
      </ThemeProvider>
    );
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/farm details/i), { target: { value: 'Green Acres' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      const successMessages = screen.getAllByText(/registration successful/i);
      expect(successMessages.length).toBeGreaterThan(0);
    });
  });
});
