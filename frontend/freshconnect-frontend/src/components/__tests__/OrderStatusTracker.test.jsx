import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderStatusTracker from '../Orders/OrderStatusTracker';

describe('OrderStatusTracker Component', () => {
  const defaultProps = {
    status: 'Confirmed',
    orderId: 'order123',
    isEditable: false,
    onStatusUpdate: jest.fn()
  };

  test('renders correct status in stepper', () => {
    render(<OrderStatusTracker {...defaultProps} />);
    
    // Should show all non-cancelled statuses
    expect(screen.getByText('Pending', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getAllByText('Confirmed')[0]).toBeInTheDocument(); // Use getAllByText since 'Confirmed' appears multiple times
    expect(screen.getByText('Processing', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('Ready', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('Delivered', { selector: 'p' })).toBeInTheDocument();
    
    // Should not show Cancelled in the stepper
    expect(screen.queryByText('Cancelled')).not.toBeInTheDocument();
    
    // Should show current status text
    expect(screen.getByText(/Current Status:/i)).toBeInTheDocument();
    // Use getAllByText since 'Confirmed' appears multiple times
    expect(screen.getAllByText('Confirmed')[0]).toBeInTheDocument();
  });

  test('does not show update buttons when not editable', () => {
    render(<OrderStatusTracker {...defaultProps} />);
    
    // No buttons should be rendered
    expect(screen.queryByText('Move to Processing')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel Order')).not.toBeInTheDocument();
  });

  test('shows update buttons when editable', () => {
    render(<OrderStatusTracker {...defaultProps} isEditable={true} />);
    
    // Should show buttons for next status and cancel
    expect(screen.getByText('Move to Processing')).toBeInTheDocument();
    expect(screen.getByText('Cancel Order')).toBeInTheDocument();
  });

  test('calls onStatusUpdate with next status when next button clicked', () => {
    const mockOnStatusUpdate = jest.fn();
    render(
      <OrderStatusTracker 
        {...defaultProps} 
        isEditable={true} 
        onStatusUpdate={mockOnStatusUpdate} 
      />
    );
    
    // Click the next status button
    fireEvent.click(screen.getByText('Move to Processing'));
    
    // Should call onStatusUpdate with correct params
    expect(mockOnStatusUpdate).toHaveBeenCalledWith('order123', 'Processing');
  });

  test('calls onStatusUpdate with Cancelled when cancel button clicked', () => {
    const mockOnStatusUpdate = jest.fn();
    render(
      <OrderStatusTracker 
        {...defaultProps} 
        isEditable={true} 
        onStatusUpdate={mockOnStatusUpdate} 
      />
    );
    
    // Click the cancel button
    fireEvent.click(screen.getByText('Cancel Order'));
    
    // Should call onStatusUpdate with correct params
    expect(mockOnStatusUpdate).toHaveBeenCalledWith('order123', 'Cancelled');
  });

  test('does not show buttons for Delivered status', () => {
    render(
      <OrderStatusTracker 
        {...defaultProps} 
        status="Delivered" 
        isEditable={true} 
      />
    );
    
    // No buttons should be rendered for Delivered status
    expect(screen.queryByText(/Move to/)).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel Order')).not.toBeInTheDocument();
  });

  test('does not show buttons for Cancelled status', () => {
    render(
      <OrderStatusTracker 
        {...defaultProps} 
        status="Cancelled" 
        isEditable={true} 
      />
    );
    
    // No buttons should be rendered for Cancelled status
    expect(screen.queryByText(/Move to/)).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel Order')).not.toBeInTheDocument();
  });
});
