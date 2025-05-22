import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConsumerRegistrationForm from '../ConsumerRegistrationForm';
import { ThemeProvider, createTheme } from '@mui/material/styles';

global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

describe('ConsumerRegistrationForm', () => {
  it('renders and submits the form', async () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <ConsumerRegistrationForm />
      </ThemeProvider>
    );
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/food preferences/i), { target: { value: 'Vegetarian' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      const successMessages = screen.getAllByText(/registration successful/i);
      expect(successMessages.length).toBeGreaterThan(0);
    });
  });
});
