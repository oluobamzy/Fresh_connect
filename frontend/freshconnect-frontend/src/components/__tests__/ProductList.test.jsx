import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductList from '../ProductList.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve([
    { id: '1', name: 'Apples', price: 3.99, images: ['apple.jpg'] },
    { id: '2', name: 'Carrots', price: 2.49, images: ['carrot.jpg'] }
  ])
}));

describe('ProductList', () => {
  it('fetches and displays products', async () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={createTheme()}>
          <ProductList />
        </ThemeProvider>
      </BrowserRouter>
    );
    await waitFor(() => expect(screen.getByText('Apples')).toBeInTheDocument());
    expect(screen.getByText('Carrots')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /view details/i })).toHaveLength(2);
  });
});
