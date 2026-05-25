import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Badge, Container, Spinner, Alert, Modal, Button as BsButton } from 'react-bootstrap';
import api from '../../../services/api';

const AllProperty = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingBookingId, setPayingBookingId] = useState(null);
  const [detailBooking, setDetailBooking] = useState(null);

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

  const handlePayNow = async (bookingId) => {
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

  const getStatusColor = (status) => {
    switch (status) {
       case 'pending': return { bg: 'rgba(243,156,18,0.15)', color: '#f39c12' };
       case 'accepted': return { bg: 'rgba(46,204,113,0.15)', color: '#2ecc71' };
       case 'booked': return { bg: 'rgba(52,152,219,0.15)', color: '#3498db' };
       case 'cancelled': return { bg: 'rgba(231,76,60,0.15)', color: '#e74c3c' };
       default: return { bg: 'rgba(149,165,166,0.15)', color: '#95a5a6' };
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
       case 'paid': return { bg: 'rgba(46,204,113,0.15)', color: '#2ecc71' };
       case 'failed': return { bg: 'rgba(231,76,60,0.15)', color: '#e74c3c' };
       default: return { bg: 'rgba(149,165,166,0.15)', color: '#95a5a6' };
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" style={{ color: 'var(--accent-color)' }} />
        <p className="mt-2" style={{ color: '#a0a0c0' }}>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <Container fluid className="mt-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h2 style={{ color: 'var(--text-main)', fontWeight: 600, fontFamily: "'Playfair Display', serif", marginBottom: 24 }}>
         My Booking History
      </h2>
      
      {allProperties.length === 0 ? (
        <Alert variant="info" style={{ background: 'rgba(52,152,219,0.1)', color: '#2980b9', border: 'none' }}>
           You have no bookings yet. Browse properties and request a booking.
        </Alert>
      ) : (
         <div style={styles.grid}>
            {allProperties.map((booking) => {
               const statusStyle = getStatusColor(booking.bookingStatus);
               const paymentStyle = getPaymentColor(booking.paymentStatus);
               return (
                  <div key={booking._id} style={styles.bookingCard}>
                     <div style={styles.cardHeader}>
                        <div>
                           <p style={styles.bookingId}>Booking #{booking._id.slice(-8)}</p>
                           <h4 style={styles.tenantName}>{booking.userName}</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                           <span style={{
                              padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                              background: statusStyle.bg, color: statusStyle.color
                           }}>
                              {booking.bookingStatus?.charAt(0).toUpperCase() + booking.bookingStatus?.slice(1)}
                           </span>
                           <span style={{
                              padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                              background: paymentStyle.bg, color: paymentStyle.color
                           }}>
                              💳 {booking.paymentStatus || 'pending'}
                           </span>
                        </div>
                     </div>

                     <div style={styles.cardMeta}>
                        <div style={styles.metaItem}>
                           <span style={styles.metaLabel}>Property ID</span>
                           <span style={{ ...styles.metaValue, fontFamily: 'monospace' }}>
                              {booking.propertyId || booking.propertId}
                           </span>
                        </div>
                        <div style={styles.metaItem}>
                           <span style={styles.metaLabel}>Rent Amount</span>
                           <span style={styles.metaValue}>
                              {booking.rentAmount ? `Br ${booking.rentAmount.toLocaleString()}` : 'N/A'}
                           </span>
                        </div>
                     </div>

                     <div style={styles.cardActions}>
                        <button onClick={() => setDetailBooking(booking)} style={{ ...styles.actionBtn, ...styles.detailBtn }}>
                           👁 View Details
                        </button>
                        
                        {booking.bookingStatus === 'accepted' && booking.paymentStatus !== 'paid' && (
                           <button 
                              onClick={() => handlePayNow(booking._id)}
                              disabled={payingBookingId === booking._id}
                              style={{ ...styles.actionBtn, ...styles.payBtn, opacity: payingBookingId === booking._id ? 0.7 : 1 }}
                           >
                              {payingBookingId === booking._id ? 'Processing...' : '💳 Pay Now'}
                           </button>
                        )}
                        {booking.paymentStatus === 'paid' && booking.bookingStatus === 'accepted' && (
                           <span style={{ color: '#2ecc71', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center' }}>
                              ✓ Completed
                           </span>
                        )}
                        {booking.bookingStatus === 'pending' && (
                           <span style={{ color: '#f39c12', fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center' }}>
                              ⏳ Waiting for owner
                           </span>
                        )}
                     </div>
                  </div>
               )
            })}
         </div>
      )}

      {/* Detail Modal */}
      <Modal show={!!detailBooking} onHide={() => setDetailBooking(null)} size="lg" centered>
        <Modal.Header closeButton style={{ borderBottom: '1px solid #eaeaea' }}>
           <Modal.Title style={{ color: 'var(--text-main)', fontFamily: "'Playfair Display', serif" }}>Booking Information</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
           {detailBooking && (
              <div style={styles.detailGrid}>
                 <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Booking ID</span>
                    <span style={styles.detailValue}>{detailBooking._id}</span>
                 </div>
                 <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Applicant Name</span>
                    <span style={styles.detailValue}>{detailBooking.userName}</span>
                 </div>
                 <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Contact Phone</span>
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
                       color: getPaymentColor(detailBooking.paymentStatus).color,
                    }}>{detailBooking.paymentStatus || 'pending'}</span>
                 </div>
                 <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Property ID</span>
                    <span style={{...styles.detailValue, fontFamily: 'monospace'}}>{detailBooking.propertyId || detailBooking.propertId}</span>
                 </div>
                 <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Rent Amount</span>
                    <span style={{...styles.detailValue, fontWeight: 700}}>
                       {detailBooking.rentAmount ? `Br ${detailBooking.rentAmount.toLocaleString()}` : 'N/A'}
                    </span>
                 </div>
                 <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Transaction ID</span>
                    <span style={{...styles.detailValue, fontFamily: 'monospace', fontSize: 13}}>
                       {detailBooking.paymentTransactionId || 'N/A'}
                    </span>
                 </div>
              </div>
           )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid #eaeaea' }}>
           {detailBooking && detailBooking.bookingStatus === 'accepted' && detailBooking.paymentStatus !== 'paid' && (
              <BsButton 
                 variant="success" 
                 onClick={() => {
                    handlePayNow(detailBooking._id);
                    setDetailBooking(null);
                 }}
              >
                 Pay Now
              </BsButton>
           )}
           <BsButton variant="outline-secondary" onClick={() => setDetailBooking(null)}>Close</BsButton>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const styles = {
   grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
      gap: 20,
   },
   bookingCard: {
      background: 'var(--bg-secondary)',
      border: '1px solid #eaeaea',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      transition: 'all 0.2s',
   },
   cardHeader: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      marginBottom: 20,
      paddingBottom: 16,
      borderBottom: '1px solid #f0f0f0'
   },
   tenantName: { color: 'var(--text-main)', fontSize: 18, fontWeight: 600, margin: 0 },
   bookingId: { color: '#a0a0c0', fontSize: 12, margin: '0 0 6px', fontFamily: 'monospace', textTransform: 'uppercase' },
   cardMeta: {
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20,
   },
   metaItem: { display: 'flex', flexDirection: 'column', gap: 4 },
   metaLabel: { fontSize: 11, color: '#a0a0c0', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 },
   metaValue: { color: 'var(--text-main)', fontSize: 14, fontWeight: 500 },
   cardActions: {
      display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap'
   },
   actionBtn: {
      padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
      cursor: 'pointer', border: 'none', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
   },
   detailBtn: { background: 'rgba(52,152,219,0.1)', color: '#2980b9' },
   payBtn: { background: 'var(--text-main)', color: 'var(--accent-color)', flex: 1 },
   detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, padding: 10 },
   detailItem: { display: 'flex', flexDirection: 'column', gap: 6 },
   detailLabel: { fontSize: 11, color: '#a0a0c0', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 },
   detailValue: { color: 'var(--text-main)', fontSize: 15, fontWeight: 500 },
};

export default AllProperty;