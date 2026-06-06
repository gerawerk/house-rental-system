import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { Container, Typography } from '@mui/material';
import api from '../../../services/api';

const AllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [detailBooking, setDetailBooking] = useState(null);

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

  // Helper to build full URL for government ID
  const getGovIdUrl = (path) => {
    if (!path) return null;
    // Assuming REACT_APP_API_URL is like "http://localhost:5000/api"
    const baseUrl = process.env.REACT_APP_API_URL.replace('/api', '');
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
  };

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
        setDetailBooking(null);
      } else {
        message.error('Failed to cancel');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRelease = async (propertyId, bookingId) => {
    try {
      const res = await api.post('/owner/releaseproperty', { propertyId, bookingId });
      if (res.data.success) {
        message.success(res.data.message);
        getAllProperty();
        setDetailBooking(null);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: 'rgba(243,156,18,0.15)', color: '#f39c12' };
      case 'accepted': return { bg: 'rgba(46,204,113,0.15)', color: '#2ecc71' };
      case 'booked': return { bg: 'rgba(52,152,219,0.15)', color: '#3498db' };
      case 'cancelled': return { bg: 'rgba(231,76,60,0.15)', color: '#e74c3c' };
      default: return { bg: 'rgba(149,165,166,0.15)', color: '#95a5a6' };
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: '20px', borderRadius: 12 }}>
      <Container maxWidth="lg" sx={{ paddingTop: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          sx={{ 
            marginBottom: 4, 
            color: 'var(--text-main)',
            fontWeight: 600,
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Property Bookings
        </Typography>

        {/* Booking Table */}
        <div style={styles.tableContainer}>
          <Table hover responsive style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                <th>ID</th>
                <th>Tenant</th>
                <th>Property ID</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map((booking) => {
                const statusStyle = getStatusColor(booking.bookingStatus);
                return (
                  <tr key={booking._id} style={{ verticalAlign: 'middle' }}>
                    <td><span style={{ fontFamily: 'monospace', color: 'var(--text-light)' }}>#{booking._id.slice(-8)}</span></td>
                    <td style={{ fontWeight: 600 }}>{booking.userName}</td>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {booking.propertyId || 'N/A'}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: statusStyle.bg, color: statusStyle.color,
                      }}>
                        {booking.bookingStatus?.charAt(0).toUpperCase() + booking.bookingStatus?.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#a0a0c0', fontSize: 11, fontWeight: 600 }}>
                        💳 {booking.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setDetailBooking(booking)} style={{ ...styles.actionBtn, ...styles.detailBtn }}>
                          👁
                        </button>
                        {booking.bookingStatus === 'pending' && (
                          <>
                            <button onClick={() => handleAccept(booking._id, booking.propertyId)} style={{ ...styles.actionBtn, ...styles.acceptBtn }}>
                              ✓
                            </button>
                            <button onClick={() => handleCancel(booking._id)} style={{ ...styles.actionBtn, ...styles.cancelBtn }}>
                              ✕
                            </button>
                          </>
                        )}
                        {booking.bookingStatus === 'accepted' && (
                          <button onClick={() => handleRelease(booking.propertyId, booking._id)} style={{ ...styles.actionBtn, ...styles.releaseBtn }}>
                            🔄 Release
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        
        {allBookings.length === 0 && (
          <div style={styles.emptyState}>
            <span style={{ fontSize: 48 }}>📋</span>
            <p style={{ color: 'var(--text-light)', marginTop: 12 }}>No bookings found.</p>
          </div>
        )}
      </Container>

      {/* Detail Modal with Government ID display */}
      <Modal show={!!detailBooking} onHide={() => setDetailBooking(null)} size="lg" centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid #eaeaea' }}>
          <Modal.Title style={{ color: 'var(--text-main)', fontFamily: "'Playfair Display', serif" }}>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
          {detailBooking && (
            <div>
              <div style={styles.detailGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Booking ID</span>
                  <span style={styles.detailValue}>{detailBooking._id}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Tenant Name</span>
                  <span style={styles.detailValue}>{detailBooking.userName}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Phone</span>
                  <span style={styles.detailValue}>{detailBooking.phone}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Status</span>
                  <span style={{
                    ...styles.detailValue,
                    color: getStatusColor(detailBooking.bookingStatus).color,
                  }}>{detailBooking.bookingStatus}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Payment</span>
                  <span style={{
                    ...styles.detailValue,
                    color: detailBooking.paymentStatus === 'paid' ? '#2ecc71' : '#f39c12'
                  }}>{detailBooking.paymentStatus || 'pending'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Property ID</span>
                  <span style={styles.detailValue}>{detailBooking.propertyId}</span>
                </div>
              </div>

              {/* Government ID Section */}
              {detailBooking.governmentIdPath && (
                <div style={{ marginTop: 24, borderTop: '1px solid #eaeaea', paddingTop: 20 }}>
                  <h6 style={{ marginBottom: 12, color: 'var(--text-main)' }}>📄 Government ID Upload</h6>
                  {detailBooking.governmentIdOriginalName && (
                    <div style={styles.detailItem}>
                      {/* <span style={styles.detailLabel}>Original filename</span>
                      <span style={styles.detailValue}>{detailBooking.governmentIdOriginalName}</span> */}
                    </div>
                  )}
                  <div style={{ marginTop: 12, textAlign: 'center' }}>
                    {(() => {
                      const filePath = detailBooking.governmentIdPath;
                      const fullUrl = getGovIdUrl(filePath);
                      if (!fullUrl) return <p>No file available</p>;
                      
                      // Check if it's an image
                      const isImage = /\.(jpg|jpeg|png|gif)$/i.test(filePath);
                      if (isImage) {
                        return (
                          <img
                            src={fullUrl}
                            alt="Government ID"
                            style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, border: '1px solid #ddd' }}
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<p>Failed to load image</p>'; }}
                          />
                        );
                      } else {
                        // PDF or other file: provide download link
                        return (
                          <div>
                            <a href={fullUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>
                              📎 View / Download document
                            </a>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid #eaeaea' }}>
          {detailBooking && (
            <>
              {detailBooking.bookingStatus === 'pending' && (
                <Button variant="outline-success" onClick={() => handleAccept(detailBooking._id, detailBooking.propertyId)}>Accept</Button>
              )}
              {detailBooking.bookingStatus === 'accepted' && (
                <Button variant="outline-warning" onClick={() => handleRelease(detailBooking.propertyId, detailBooking._id)}>Release</Button>
              )}
              <Button variant="outline-danger" onClick={() => handleCancel(detailBooking._id)}>Delete</Button>
            </>
          )}
          <Button variant="secondary" onClick={() => setDetailBooking(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const styles = {
  tableContainer: {
    background: 'var(--bg-secondary)',
    border: '1px solid #eaeaea',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  },
  table: { marginBottom: 0 },
  tableHead: { background: 'var(--bg-primary)', borderBottom: '2px solid #eaeaea', color: 'var(--text-light)', textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5 },
  actionBtn: {
    padding: '6px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
    cursor: 'pointer', border: 'none', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
  },
  detailBtn: { background: 'rgba(52,152,219,0.15)', color: '#3498db' },
  acceptBtn: { background: 'rgba(46,204,113,0.15)', color: '#2ecc71' },
  cancelBtn: { background: 'rgba(231,76,60,0.15)', color: '#e74c3c' },
  releaseBtn: { background: 'rgba(201,168,76,0.15)', color: 'var(--accent-color)' },
  emptyState: { textAlign: 'center', padding: '80px 0' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 },
  detailItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  detailLabel: { fontSize: 11, color: '#a0a0c0', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 },
  detailValue: { color: 'var(--text-main)', fontSize: 15, fontWeight: 500 },
};

export default AllBookings;