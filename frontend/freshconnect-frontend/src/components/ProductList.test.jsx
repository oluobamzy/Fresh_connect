import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ProductList from './ProductList.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';

global.fetch = jest.fn((url) => {
  // Simulate filtering by name, category, location
  const params = new URL(url, 'http://localhost').searchParams;
  let data = [
    { id: '1', name: 'Apples', price: 3.99, category: 'Fruits', location: 'Ontario', images: ['apple.jpg'] },
    { id: '2', name: 'Carrots', price: 2.49, category: 'Vegetables', location: 'Quebec', images: ['carrot.jpg'] },
    { id: '3', name: 'Milk', price: 4.99, category: 'Dairy', location: 'Ontario', images: ['milk.jpg'] }
  ];
  if (params.get('name')) {
    data = data.filter(p => p.name.toLowerCase().includes(params.get('name').toLowerCase()));
  }
  if (params.get('category')) {
    data = data.filter(p => p.category === params.get('category'));
  }
  if (params.get('location')) {
    data = data.filter(p => p.location.toLowerCase().includes(params.get('location').toLowerCase()));
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
});

describe('ProductList', () => {
  const renderWithProviders = (ui) => {
    return render(
      <BrowserRouter>
        <ThemeProvider theme={createTheme()}>
          {ui}
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  it('fetches and displays products', async () => {
    renderWithProviders(<ProductList />);
    await waitFor(() => expect(screen.getByText('Apples')).toBeInTheDocument());
    expect(screen.getByText('Carrots')).toBeInTheDocument();
    expect(screen.getByText('Milk')).toBeInTheDocument();
  });

  it('filters products by name', async () => {
    renderWithProviders(<ProductList />);
    await waitFor(() => expect(screen.getByText('Apples')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/search by name/i), { target: { value: 'Milk' } });
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    await waitFor(() => expect(screen.getByText('Milk')).toBeInTheDocument());
    expect(screen.queryByText('Apples')).not.toBeInTheDocument();
    expect(screen.queryByText('Carrots')).not.toBeInTheDocument();
  });

  it('filters products by category', async () => {
    renderWithProviders(<ProductList />);
    await waitFor(() => expect(screen.getByText('Apples')).toBeInTheDocument());
    // Open the category select dropdown (MUI TextField with select)
    const categoryInput = screen.getByLabelText(/category/i);
    // Use mouseDown to open the dropdown
    fireEvent.mouseDown(categoryInput);
    // Wait for the option to appear and click it
    const option = await screen.findByRole('option', { name: 'Vegetables' });
    fireEvent.click(option);
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    await waitFor(() => expect(screen.getByText('Carrots')).toBeInTheDocument());
    expect(screen.queryByText('Apples')).not.toBeInTheDocument();
    expect(screen.queryByText('Milk')).not.toBeInTheDocument();
  });

  it('filters products by location', async () => {
    renderWithProviders(<ProductList />);
    await waitFor(() => expect(screen.getByText('Apples')).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Quebec' } });
    fireEvent.click(screen.getByRole('button', { name: /filter/i }));
    await waitFor(() => expect(screen.getByText('Carrots')).toBeInTheDocument());
    expect(screen.queryByText('Apples')).not.toBeInTheDocument();
    expect(screen.queryByText('Milk')).not.toBeInTheDocument();
  });
});
