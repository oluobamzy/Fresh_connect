import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProfileReviewApproval from '../ProfileReviewApproval.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';

global.fetch = jest.fn((url, options) => {
  if (url.startsWith('/api/users?')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: '1', name: 'Alice', email: 'alice@farm.com', farmDetails: 'Sunny Farm' },
        { id: '2', name: 'Bob', email: 'bob@farm.com', farmDetails: 'Green Pastures' }
      ])
    });
  }
  if (url.startsWith('/api/users/1') && options.method === 'PATCH') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  }
  if (url.startsWith('/api/users/2') && options.method === 'PATCH') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  }
  return Promise.resolve({ ok: false, json: () => Promise.resolve({ message: 'Error' }) });
});

describe('ProfileReviewApproval', () => {
  it('renders pending farmers and allows approval', async () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <ProfileReviewApproval />
      </ThemeProvider>
    );
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    fireEvent.click(screen.getAllByText('Approve')[0]);
    await waitFor(() => expect(screen.getByText('Profile approved.')).toBeInTheDocument());
  });
  it('renders pending farmers and allows rejection', async () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <ProfileReviewApproval />
      </ThemeProvider>
    );
    await waitFor(() => expect(screen.getByText('Bob')).toBeInTheDocument());
    fireEvent.click(screen.getAllByText('Reject')[0]);
    await waitFor(() => expect(screen.getByText('Profile rejected.')).toBeInTheDocument());
  });
});
