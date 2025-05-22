import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Button, Paper, StepConnector, stepConnectorClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingIcon from '@mui/icons-material/Pending';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CancelIcon from '@mui/icons-material/Cancel';

// Order statuses in the flow
const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Ready', 'Delivered', 'Cancelled'];

// Icons for each status
const STATUS_ICONS = {
  'Pending': <PendingIcon />,
  'Confirmed': <FactCheckIcon />,
  'Processing': <InventoryIcon />,
  'Ready': <CheckCircleOutlineIcon />,
  'Delivered': <LocalShippingIcon />,
  'Cancelled': <CancelIcon />
};

// Custom connector for the stepper
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to right, #4caf50, #2196f3)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to right, #4caf50, #4caf50)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom step icon
const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient(136deg, #2196f3 0%, #4caf50 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient(136deg, #4caf50 0%, #4caf50 100%)',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;
  const icons = STATUS_ICONS;

  // Get the corresponding status for this step
  const status = ORDER_STATUSES[icon - 1];
  
  // Don't show the Cancelled status in the normal flow
  if (status === 'Cancelled') return null;
  
  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[status]}
    </ColorlibStepIconRoot>
  );
}

const OrderStatusTracker = ({ 
  status, 
  orderId, 
  isEditable = false, 
  onStatusUpdate = () => {} 
}) => {
  // Find the current step index based on the order status
  const currentStep = ORDER_STATUSES.indexOf(status);
  
  // Handle moving to the next status
  const handleNextStatus = () => {
    if (currentStep < ORDER_STATUSES.length - 2) { // -2 because we don't want to auto-advance to "Cancelled"
      const nextStatus = ORDER_STATUSES[currentStep + 1];
      onStatusUpdate(orderId, nextStatus);
    }
  };
  
  // Handle cancelling an order
  const handleCancelOrder = () => {
    onStatusUpdate(orderId, 'Cancelled');
  };

  // If order is cancelled, show a special message
  if (status === 'Cancelled') {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          bgcolor: '#ffebee', 
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #ffcdd2'
        }}
      >
        <CancelIcon color="error" sx={{ mr: 2 }} />
        <Typography variant="subtitle1" color="error" fontWeight="medium">
          This order has been cancelled
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', my: 4 }}>
      <Stepper 
        activeStep={currentStep} 
        alternativeLabel
        connector={<ColorlibConnector />}
      >
        {ORDER_STATUSES.filter(s => s !== 'Cancelled').map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: currentStep === index ? 'bold' : 'regular',
                  color: currentStep === index ? 'primary.main' : 'text.primary'
                }}
              >
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 1.5, 
            px: 3,
            bgcolor: '#f5f5f5', 
            borderRadius: 2,
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          <Typography variant="body1">
            Current Status: <strong>{status}</strong>
          </Typography>
        </Paper>
        
        {isEditable && status !== 'Delivered' && status !== 'Cancelled' && (
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleNextStatus}
              sx={{ mr: 1 }}
            >
              Move to {ORDER_STATUSES[currentStep + 1]}
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleCancelOrder}
            >
              Cancel Order
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

OrderStatusTracker.propTypes = {
  status: PropTypes.oneOf(ORDER_STATUSES).isRequired,
  orderId: PropTypes.string.isRequired,
  isEditable: PropTypes.bool,
  onStatusUpdate: PropTypes.func
};

export default OrderStatusTracker;
