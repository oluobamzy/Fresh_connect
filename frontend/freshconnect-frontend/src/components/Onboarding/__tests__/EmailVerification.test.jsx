import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailVerification from '../EmailVerification.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';

global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

describe('EmailVerification', () => {
  it('renders and submits the verification code', async () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <EmailVerification email="test@example.com" />
      </ThemeProvider>
    );
    fireEvent.change(screen.getByLabelText(/verification code/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /verify email/i }));
    await waitFor(() => {
      const successMessages = screen.getAllByText(/email verified/i);
      expect(successMessages.length).toBeGreaterThan(0);
    });
  });
});
