import { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import Loader from '../Loader';
import Notification from '../Notification';

export default function ProfileReviewApproval() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchPendingFarmers();
  }, []);

  const fetchPendingFarmers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users?role=farmer&isVerified=false');
      const data = await res.json();
      if (res.ok) {
        setFarmers(data);
      } else {
        setError(data.message || 'Failed to fetch pending farmers.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: true })
      });
      if (res.ok) {
        setNotification({ open: true, message: 'Profile approved.', severity: 'success' });
        setFarmers(farmers.filter(f => f.id !== id));
      } else {
        const data = await res.json();
        setNotification({ open: true, message: data.message || 'Approval failed.', severity: 'error' });
      }
    } catch (err) {
      setNotification({ open: true, message: 'Network error.', severity: 'error' });
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: false })
      });
      if (res.ok) {
        setNotification({ open: true, message: 'Profile rejected.', severity: 'info' });
        setFarmers(farmers.filter(f => f.id !== id));
      } else {
        const data = await res.json();
        setNotification({ open: true, message: data.message || 'Rejection failed.', severity: 'error' });
      }
    } catch (err) {
      setNotification({ open: true, message: 'Network error.', severity: 'error' });
    }
  };

  return (
    <Box maxWidth={800} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Pending Farmer Profiles</Typography>
      {loading ? <Loader /> : error ? <Alert severity="error">{error}</Alert> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Farm Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {farmers.length === 0 ? (
                <TableRow><TableCell colSpan={4}>No pending profiles.</TableCell></TableRow>
              ) : farmers.map(farmer => (
                <TableRow key={farmer.id}>
                  <TableCell>{farmer.name}</TableCell>
                  <TableCell>{farmer.email}</TableCell>
                  <TableCell>{farmer.farmDetails}</TableCell>
                  <TableCell>
                    <Button color="success" variant="contained" size="small" sx={{ mr: 1 }} onClick={() => handleApprove(farmer.id)}>Approve</Button>
                    <Button color="error" variant="outlined" size="small" onClick={() => handleReject(farmer.id)}>Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </Box>
  );
}
