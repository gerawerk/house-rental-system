import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Button as BsButton, Table } from 'react-bootstrap';
import api from '../../services/api';

const AllBookings = () => {
   const [allBookings, setAllBookings] = useState([]);
   const [search, setSearch] = useState('');
   const [detailBooking, setDetailBooking] = useState(null);
   const [statusBooking, setStatusBooking] = useState(null);
   const [newStatus, setNewStatus] = useState('');

   const getAllBooking = async () => {
      try {
         const response = await api.get('/admin/getallbookings');
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
      getAllBooking();
   }, []);

   const handleDelete = async (bookingId) => {
      if (!window.confirm('Are you sure you want to delete this booking?')) return;
      try {
         const res = await api.delete(`/admin/deletebooking/${bookingId}`);
         if (res.data.success) {
            message.success(res.data.message);
            getAllBooking();
            setDetailBooking(null);
         }
      } catch (error) {
         console.log(error);
         message.error('Failed to delete booking');
      }
   };

   const handleStatusUpdate = async () => {
      if (!newStatus || !statusBooking) return;
      try {
         const res = await api.post('/admin/updatebookingstatus', {
            bookingId: statusBooking._id,
            bookingStatus: newStatus,
         });
         if (res.data.success) {
            message.success(res.data.message);
            setStatusBooking(null);
            setNewStatus('');
            getAllBooking();
         }
      } catch (error) {
         console.log(error);
         message.error('Failed to update status');
      }
   };

   const filteredBookings = allBookings.filter(b =>
      b.userName?.toLowerCase().includes(search.toLowerCase()) ||
      b._id?.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingStatus?.toLowerCase().includes(search.toLowerCase())
   );

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

   return (
      <div>
         {/* Search */}
         <div style={styles.searchBar}>
            <span style={styles.searchIcon}>🔍</span>
            <input
               type="text"
               placeholder="Search bookings by name, ID, or status..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               style={styles.searchInput}
            />
            {search && <button onClick={() => setSearch('')} style={styles.clearBtn}>✕</button>}
         </div>

         {/* Stats */}
         <div style={styles.statsRow}>
            <div style={{ ...styles.statCard, borderLeft: '3px solid #c9a84c' }}>
               <div style={styles.statNumber}>{allBookings.length}</div>
               <div style={styles.statLabel}>Total Bookings</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '3px solid #f39c12' }}>
               <div style={styles.statNumber}>{allBookings.filter(b => b.bookingStatus === 'pending').length}</div>
               <div style={styles.statLabel}>Pending</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '3px solid #2ecc71' }}>
               <div style={styles.statNumber}>{allBookings.filter(b => b.bookingStatus === 'accepted').length}</div>
               <div style={styles.statLabel}>Accepted</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '3px solid #3498db' }}>
               <div style={styles.statNumber}>{allBookings.filter(b => b.paymentStatus === 'paid').length}</div>
               <div style={styles.statLabel}>Paid</div>
            </div>
         </div>

         {/* Booking Table */}
         <div style={styles.tableContainer}>
            <Table hover responsive style={styles.table}>
               <thead style={styles.tableHead}>
                  <tr>
                     <th>ID</th>
                     <th>Tenant</th>
                     <th>Property</th>
                     <th>Status</th>
                     <th>Payment</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredBookings.map((booking) => {
                     const statusStyle = getStatusColor(booking.bookingStatus);
                     const paymentStyle = getPaymentColor(booking.paymentStatus);
                     return (
                        <tr key={booking._id} style={{ verticalAlign: 'middle' }}>
                           <td><span style={{ fontFamily: 'monospace', color: 'var(--text-light)' }}>#{booking._id.slice(-8)}</span></td>
                           <td style={{ fontWeight: 600 }}>{booking.userName}</td>
                           <td style={{ color: 'var(--text-muted)' }}>
                              {booking.propertyId?.propertyAddress?.split(',')[0] || 'N/A'}
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
                              <span style={{
                                 padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                 background: paymentStyle.bg, color: paymentStyle.color,
                              }}>
                                 💳 {booking.paymentStatus || 'pending'}
                              </span>
                           </td>
                           <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                 <button onClick={() => setDetailBooking(booking)} style={{ ...styles.actionBtn, ...styles.detailBtn }}>
                                    👁
                                 </button>
                                 <button onClick={() => { setStatusBooking(booking); setNewStatus(booking.bookingStatus); }} style={{ ...styles.actionBtn, ...styles.statusBtn }}>
                                    🔄
                                 </button>
                                 <button onClick={() => handleDelete(booking._id)} style={{ ...styles.actionBtn, ...styles.deleteBtn }}>
                                    🗑
                                 </button>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </Table>
            {filteredBookings.length === 0 && (
               <div style={styles.emptyState}>
                  <span style={{ fontSize: 48 }}>📋</span>
                  <p style={{ color: 'var(--text-light)', marginTop: 12 }}>No bookings found.</p>
               </div>
            )}
         </div>

         {/* Detail Modal */}
         <Modal show={!!detailBooking} onHide={() => setDetailBooking(null)} size="lg" centered>
            <Modal.Header closeButton style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid #eaeaea' }}>
               <Modal.Title style={{ color: 'var(--text-main)', fontFamily: "'Playfair Display', serif" }}>Booking Details</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
               {detailBooking && (
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
                        <span style={styles.detailLabel}>Booking Status</span>
                        <span style={{
                           ...styles.detailValue,
                           color: getStatusColor(detailBooking.bookingStatus).color,
                        }}>{detailBooking.bookingStatus}</span>
                     </div>
                     <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Payment Status</span>
                        <span style={{
                           ...styles.detailValue,
                           color: getPaymentColor(detailBooking.paymentStatus).color,
                        }}>{detailBooking.paymentStatus || 'pending'}</span>
                     </div>
                     <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Transaction ID</span>
                        <span style={{ ...styles.detailValue, fontFamily: 'monospace', fontSize: 12 }}>
                           {detailBooking.paymentTransactionId || 'N/A'}
                        </span>
                     </div>
                     <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Property</span>
                        <span style={styles.detailValue}>
                           {detailBooking.propertyId?.propertyAddress || (typeof detailBooking.propertyId === 'string' ? detailBooking.propertyId : 'N/A')}
                        </span>
                     </div>
                     <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Property Type</span>
                        <span style={styles.detailValue}>
                           {detailBooking.propertyId?.propertyType || 'N/A'}
                        </span>
                     </div>
                     <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Property Amount</span>
                        <span style={styles.detailValue}>
                           {detailBooking.propertyId?.propertyAmt ? `Br ${detailBooking.propertyId.propertyAmt.toLocaleString()}` : 'N/A'}
                        </span>
                     </div>
                     <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Owner</span>
                        <span style={styles.detailValue}>
                           {detailBooking.ownerID?.name || (typeof detailBooking.ownerID === 'string' ? detailBooking.ownerID : 'N/A')}
                        </span>
                     </div>
                     <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Tenant (User ID)</span>
                        <span style={{ ...styles.detailValue, fontFamily: 'monospace', fontSize: 12 }}>
                           {typeof detailBooking.userID === 'object' ? detailBooking.userID?._id : detailBooking.userID}
                        </span>
                     </div>
                     <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Created At</span>
                        <span style={styles.detailValue}>
                           {detailBooking.createdAt ? new Date(detailBooking.createdAt).toLocaleString() : 'N/A'}
                        </span>
                     </div>
                  </div>
               )}
            </Modal.Body>
            <Modal.Footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid #eaeaea' }}>
               {detailBooking && (
                  <BsButton variant="outline-danger" size="sm" onClick={() => handleDelete(detailBooking._id)}>
                     🗑 Delete
                  </BsButton>
               )}
               <BsButton variant="secondary" onClick={() => setDetailBooking(null)}>Close</BsButton>
            </Modal.Footer>
         </Modal>

         {/* Status Update Modal */}
         <Modal show={!!statusBooking} onHide={() => setStatusBooking(null)} centered>
            <Modal.Header closeButton style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid #eaeaea' }}>
               <Modal.Title style={{ color: 'var(--text-main)', fontFamily: "'Playfair Display', serif" }}>Update Booking Status</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: 'var(--bg-primary)' }}>
               {statusBooking && (
                  <div>
                     <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
                        Booking: <strong style={{ color: 'var(--text-main)' }}>#{statusBooking._id.slice(-8)}</strong> — {statusBooking.userName}
                     </p>
                     <Form.Group>
                        <Form.Label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>New Status</Form.Label>
                        <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                           style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid #eaeaea' }}>
                           <option value="pending">Pending</option>
                           <option value="accepted">Accepted</option>
                           <option value="booked">Booked</option>
                           <option value="cancelled">Cancelled</option>
                        </Form.Select>
                     </Form.Group>
                  </div>
               )}
            </Modal.Body>
            <Modal.Footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid #eaeaea' }}>
               <BsButton variant="secondary" onClick={() => setStatusBooking(null)}>Cancel</BsButton>
               <BsButton variant="warning" onClick={handleStatusUpdate}>Update Status</BsButton>
            </Modal.Footer>
         </Modal>
      </div>
   );
};

const styles = {
   searchBar: {
      display: 'flex', alignItems: 'center',
      background: 'var(--bg-secondary)',
      border: '1px solid #eaeaea',
      borderRadius: 12, padding: '0 16px', marginBottom: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
   },
   searchIcon: { fontSize: 16, marginRight: 10, color: '#a0a0c0' },
   searchInput: {
      flex: 1, border: 'none', outline: 'none',
      background: 'transparent', color: 'var(--text-main)',
      padding: '14px 0', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
   },
   clearBtn: { background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: 14 },
   statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 },
   statCard: {
      background: 'var(--bg-secondary)', borderRadius: 12,
      padding: '20px 16px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
   },
   statNumber: { fontSize: 28, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 },
   statLabel: { fontSize: 12, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 },
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
      padding: '6px 10px', borderRadius: 6, fontSize: 12,
      fontWeight: 600, cursor: 'pointer', border: 'none',
      transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
   },
   detailBtn: { background: 'rgba(52,152,219,0.15)', color: '#3498db' },
   statusBtn: { background: 'rgba(201,168,76,0.15)', color: 'var(--accent-color)' },
   deleteBtn: { background: 'rgba(231,76,60,0.15)', color: '#e74c3c', marginLeft: 'auto' },
   emptyState: { textAlign: 'center', padding: '60px 0' },
   detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
   detailItem: { display: 'flex', flexDirection: 'column', gap: 4 },
   detailLabel: { fontSize: 10, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 },
   detailValue: { color: 'var(--text-main)', fontSize: 14, fontWeight: 500 },
};

export default AllBookings;