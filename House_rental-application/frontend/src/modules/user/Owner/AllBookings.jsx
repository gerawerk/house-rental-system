import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from 'react-bootstrap';
import { Container, Typography } from '@mui/material';
import api from '../../../services/api';

const AllProperty = () => {
  const [allBookings, setAllBookings] = useState([]);

  const getAllProperty = async () => {
    try {
     const response = await api.get('/owner/getallbookings');

      if (response.data.success) {
        setAllBookings(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProperty();
  }, []);

  const handleAccept = async (bookingId, propertyId) => {
    try {
     const res = await api.post('/owner/handlebookingstatus', { bookingId, propertyId, status: 'accepted' });

      if (res.data.success) {
        message.success('Booking accepted');
        getAllProperty();
      } else {
        message.error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
     const res = await api.post('/owner/deletebooking', { bookingId });
      if (res.data.success) {
        message.success('Booking cancelled and removed');
        getAllProperty();
      } else {
        message.error('Failed to cancel');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f0f1f 0%, #1a1a2e 100%)', minHeight: '100vh', padding: '20px' }}>
      <Container maxWidth="lg" sx={{ paddingTop: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          sx={{ 
            marginBottom: 4, 
            color: '#ffffff',
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          All Property Bookings
        </Typography>
        <TableContainer 
          component={Paper} 
          sx={{ 
            backgroundColor: '#1e1e2f',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
            border: '1px solid #2a2a3a'
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#0f0f1a' }}>
                <TableCell sx={{ color: '#e0e0ff', fontWeight: 'bold', borderBottom: '2px solid #3a3a5a' }}>Booking ID</TableCell>
                <TableCell sx={{ color: '#e0e0ff', fontWeight: 'bold', borderBottom: '2px solid #3a3a5a' }} align="center">Property ID</TableCell>
                <TableCell sx={{ color: '#e0e0ff', fontWeight: 'bold', borderBottom: '2px solid #3a3a5a' }} align="center">Tenant Name</TableCell>
                <TableCell sx={{ color: '#e0e0ff', fontWeight: 'bold', borderBottom: '2px solid #3a3a5a' }} align="center">Phone</TableCell>
                <TableCell sx={{ color: '#e0e0ff', fontWeight: 'bold', borderBottom: '2px solid #3a3a5a' }} align="center">Booking Status</TableCell>
                <TableCell sx={{ color: '#e0e0ff', fontWeight: 'bold', borderBottom: '2px solid #3a3a5a' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allBookings.map((booking) => (
                <TableRow 
                  key={booking._id} 
                  sx={{ 
                    backgroundColor: '#26263a',
                    transition: 'all 0.2s',
                    '&:hover': { backgroundColor: '#2f2f48' },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell sx={{ color: '#d0d0e8', fontSize: '0.85rem' }}>{booking._id}</TableCell>
                  <TableCell align="center" sx={{ color: '#d0d0e8' }}>{booking.propertyId}</TableCell>
                  <TableCell align="center" sx={{ color: '#d0d0e8' }}>{booking.userName}</TableCell>
                  <TableCell align="center" sx={{ color: '#d0d0e8' }}>{booking.phone}</TableCell>
                  <TableCell align="center">
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: booking.bookingStatus === 'pending' ? '#ffc10720' : '#28a74520',
                      color: booking.bookingStatus === 'pending' ? '#ffc107' : '#28a745',
                      fontWeight: 500,
                      fontSize: '0.85rem'
                    }}>
                      {booking.bookingStatus === 'pending' ? 'Pending' : 'Accepted'}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    {booking.bookingStatus === 'pending' ? (
                      <>
                        <Button 
                          onClick={() => handleAccept(booking._id, booking.propertyId)} 
                          variant="outline-success" 
                          size="sm"
                          style={{ borderColor: '#28a745', color: '#28a745', marginRight: '8px' }}
                        >
                          Accept
                        </Button>
                        <Button 
                          onClick={() => handleCancel(booking._id)} 
                          variant="outline-danger" 
                          size="sm"
                          style={{ borderColor: '#dc3545', color: '#dc3545' }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <span style={{ color: '#28a745', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        ✓ Accepted
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {allBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: '#aaa', py: 4 }}>
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default AllProperty;