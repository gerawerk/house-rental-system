import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Badge, Container, Spinner, Alert } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import api from '../../../services/api';

const AllProperty = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingBookingId, setPayingBookingId] = useState(null);
  const testPhone = "0911222333";
  const getAllProperty = async () => {
    try {
     const response = await api.get('/user/getallbookings');
      if (response.data.success) {
        setAllProperties(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProperty();
  }, []);

const handlePayNow = async (bookingId, email, phone) => {
  // phone and email are no longer needed, but you can keep them optional
  if (payingBookingId) return;
  setPayingBookingId(bookingId);
  try {
   const res = await api.post('/payment/initiate', { bookingId });

    if (res.data.success && res.data.checkout_url) {
      window.location.href = res.data.checkout_url;
    } else {
      message.error(res.data.message || 'Payment initiation failed');
      setPayingBookingId(null);
    }
  } catch (error) {
    console.error(error);
    message.error('Payment initiation failed');
    setPayingBookingId(null);
  }
};
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your bookings...</p>
      </div>
    );
  }

  if (allProperties.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">You have no bookings yet. Browse properties and request a booking.</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4 text-light">My Bookings</h2>
      <div style={{ overflowX: 'auto' }}>
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr style={{ backgroundColor: '#1e1e2f', color: '#fff' }}>
              <th>Booking ID</th>
              <th>Property ID</th>
              <th>Tenant Name</th>
              <th>Phone</th>
              <th>Booking Status</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allProperties.map((booking) => (
              <tr key={booking._id} style={{ verticalAlign: 'middle' }}>
                <td><small>{booking._id}</small></td>
                <td><small>{booking.propertyId}</small></td>
                <td>{booking.userName}</td>
                <td>{booking.phone}</td>
                <td>
                  <Badge bg={
                    booking.bookingStatus === 'accepted' ? 'success' :
                    booking.bookingStatus === 'pending' ? 'warning' : 'secondary'
                  }>
                    {booking.bookingStatus === 'accepted' ? 'Accepted' : 'Pending'}
                  </Badge>
                </td>
                <td>
                  <Badge bg={
                    booking.paymentStatus === 'paid' ? 'success' :
                    booking.paymentStatus === 'failed' ? 'danger' : 'secondary'
                  }>
                    {booking.paymentStatus === 'paid' ? 'Paid' : (booking.paymentStatus || 'Pending')}
                  </Badge>
                </td>
                <td>
                  {booking.bookingStatus === 'accepted' && booking.paymentStatus !== 'paid' && (
                    <Button
                      onClick={() => handlePayNow(
                        booking._id,
                        
                      )}
                      variant="primary"
                      size="sm"
                      disabled={payingBookingId === booking._id}
                    >
                      {payingBookingId === booking._id ? 'Processing...' : 'Pay Now'}
                    </Button>
                  )}
                  {booking.paymentStatus === 'paid' && booking.bookingStatus === 'accepted' && (
                    <span className="text-success fw-bold">✓ Completed</span>
                  )}
                  {booking.bookingStatus === 'pending' && (
                    <span className="text-warning">Waiting for owner</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default AllProperty;