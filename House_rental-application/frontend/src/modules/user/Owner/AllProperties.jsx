import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Button as BsButton, Table } from 'react-bootstrap';
import api from '../../../services/api';

const AllProperties = () => {
   const [allProperties, setAllProperties] = useState([]);
   const [search, setSearch] = useState('');
   const [detailProperty, setDetailProperty] = useState(null);
   const [editProperty, setEditProperty] = useState(null);
   const [editData, setEditData] = useState({});
   const [image, setImage] = useState(null);

   const getAllProperty = async () => {
      try {
         const response = await api.get('/owner/getallproperties');
         if (response.data.success) {
            setAllProperties(response.data.data);
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

   const handleDelete = async (propertyid) => {
      if (!window.confirm('Are you sure you want to delete this property?')) return;
      try {
         const res = await api.delete(`/owner/deleteproperty/${propertyid}`);
         if (res.data.success) {
            message.success(res.data.message);
            getAllProperty();
            setDetailProperty(null);
         }
      } catch (error) {
         console.log(error);
         message.error('Failed to delete property');
      }
   };

   const openEdit = (property) => {
      setEditData({
         propertyType: property.propertyType,
         propertyAdType: property.propertyAdType,
         propertyAddress: property.propertyAddress,
         ownerContact: property.ownerContact,
         propertyAmt: property.propertyAmt,
         additionalInfo: property.additionalInfo || '',
      });
      setEditProperty(property);
      setImage(null);
   };

   const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditData({ ...editData, [name]: value });
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      setImage(file);
   };

   const handleEditSave = async () => {
      try {
         const formData = new FormData();
         formData.append('propertyType', editData.propertyType);
         formData.append('propertyAdType', editData.propertyAdType);
         formData.append('propertyAddress', editData.propertyAddress);
         formData.append('ownerContact', editData.ownerContact);
         formData.append('propertyAmt', editData.propertyAmt);
         formData.append('additionalInfo', editData.additionalInfo);
         if (image) formData.append('propertyImage', image);
         
         const res = await api.patch(`/owner/updateproperty/${editProperty._id}`, formData, {
             headers: { 'Content-Type': 'multipart/form-data' }
         });
         
         if (res.data.success) {
            message.success(res.data.message);
            setEditProperty(null);
            getAllProperty();
         }
      } catch (error) {
         console.log(error);
         message.error('Failed to update property');
      }
   };

   const filteredProperties = allProperties.filter(p =>
      p.propertyAddress?.toLowerCase().includes(search.toLowerCase()) ||
      p.propertyType?.toLowerCase().includes(search.toLowerCase())
   );

   return (
      <div>
         {/* Search */}
         <div style={styles.searchBar}>
            <span style={styles.searchIcon}>🔍</span>
            <input
               type="text"
               placeholder="Search properties by address or type..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               style={styles.searchInput}
            />
            {search && <button onClick={() => setSearch('')} style={styles.clearBtn}>✕</button>}
         </div>

         {/* Stats */}
         <div style={styles.statsRow}>
            <div style={{ ...styles.statCard, borderLeft: '3px solid #c9a84c' }}>
               <div style={styles.statNumber}>{allProperties.length}</div>
               <div style={styles.statLabel}>Total Properties</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '3px solid #2ecc71' }}>
               <div style={styles.statNumber}>{allProperties.filter(p => p.isAvailable === 'Available').length}</div>
               <div style={styles.statLabel}>Available</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '3px solid #e74c3c' }}>
               <div style={styles.statNumber}>{allProperties.filter(p => p.isAvailable !== 'Available').length}</div>
               <div style={styles.statLabel}>Unavailable</div>
            </div>
         </div>

         {/* Property Table */}
         <div style={styles.tableContainer}>
            <Table hover responsive style={styles.table}>
               <thead style={styles.tableHead}>
                  <tr>
                     <th>Type</th>
                     <th>Ad Type</th>
                     <th>Address</th>
                     <th>Amount</th>
                     <th>Availability</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredProperties.map((property) => (
                     <tr key={property._id} style={{ verticalAlign: 'middle' }}>
                        <td><span style={styles.typeBadge}>{property.propertyType}</span></td>
                        <td>{property.propertyAdType === 'rent' ? 'For Rent' : 'For Sale'}</td>
                        <td style={{ color: 'var(--text-light)' }}>{property.propertyAddress}</td>
                        <td style={{ fontWeight: 600 }}>Br {property.propertyAmt?.toLocaleString()}</td>
                        <td>
                           <span style={{
                              ...styles.statusBadge,
                              background: property.isAvailable === 'Available' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                              color: property.isAvailable === 'Available' ? '#2ecc71' : '#e74c3c'
                           }}>
                              {property.isAvailable}
                           </span>
                        </td>
                        <td>
                           <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <button onClick={() => setDetailProperty(property)} style={{ ...styles.actionBtn, ...styles.detailBtn }}>
                                 👁
                              </button>
                              {property.hasPaidBooking ? (
                                 <span style={{ fontSize: 11, color: '#e74c3c', fontWeight: 600, marginLeft: 4 }}>
                                    Rented
                                 </span>
                              ) : (
                                 <>
                                    <button onClick={() => openEdit(property)} style={{ ...styles.actionBtn, ...styles.editBtn }}>
                                       ✏️
                                    </button>
                                    <button onClick={() => handleDelete(property._id)} style={{ ...styles.actionBtn, ...styles.deleteBtn }}>
                                       🗑
                                    </button>
                                 </>
                              )}
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </Table>
            {filteredProperties.length === 0 && (
               <div style={styles.emptyState}>
                  <span style={{ fontSize: 48 }}>🏠</span>
                  <p style={{ color: 'var(--text-light)', marginTop: 12 }}>No properties found.</p>
               </div>
            )}
         </div>

         {/* Detail Modal */}
         <Modal show={!!detailProperty} onHide={() => setDetailProperty(null)} size="lg" centered>
            <Modal.Header closeButton style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid #eaeaea' }}>
               <Modal.Title style={{ color: 'var(--text-main)', fontFamily: "'Playfair Display', serif" }}>Property Details</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
               {detailProperty && (
                  <div>
                     {detailProperty.propertyImage && detailProperty.propertyImage.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 8 }}>
                           {detailProperty.propertyImage.map((img, i) => (
                              <img
                                 key={i}
                                 src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${img.path}`}
                                 alt={`View ${i + 1}`}
                                 style={{ height: 200, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                              />
                           ))}
                        </div>
                     )}
                     <div style={styles.detailGrid}>
                        <div style={styles.detailItem}>
                           <span style={styles.detailLabel}>Property ID</span>
                           <span style={styles.detailValue}>{detailProperty._id}</span>
                        </div>
                        <div style={styles.detailItem}>
                           <span style={styles.detailLabel}>Type</span>
                           <span style={styles.detailValue}>{detailProperty.propertyType}</span>
                        </div>
                        <div style={styles.detailItem}>
                           <span style={styles.detailLabel}>Listing Type</span>
                           <span style={styles.detailValue}>{detailProperty.propertyAdType}</span>
                        </div>
                        <div style={styles.detailItem}>
                           <span style={styles.detailLabel}>Address</span>
                           <span style={styles.detailValue}>{detailProperty.propertyAddress}</span>
                        </div>
                        <div style={styles.detailItem}>
                           <span style={styles.detailLabel}>Amount</span>
                           <span style={styles.detailValue}>Br {detailProperty.propertyAmt?.toLocaleString()}</span>
                        </div>
                        <div style={styles.detailItem}>
                           <span style={styles.detailLabel}>Owner Contact</span>
                           <span style={styles.detailValue}>{detailProperty.ownerContact}</span>
                        </div>
                        <div style={styles.detailItem}>
                           <span style={styles.detailLabel}>Availability</span>
                           <span style={{
                              ...styles.detailValue,
                              color: detailProperty.isAvailable === 'Available' ? '#2ecc71' : '#e74c3c',
                           }}>{detailProperty.isAvailable}</span>
                        </div>
                     </div>
                     {detailProperty.additionalInfo && (
                        <div style={{ marginTop: 20 }}>
                           <span style={styles.detailLabel}>Additional Info</span>
                           <p style={{ color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.6 }}>{detailProperty.additionalInfo}</p>
                        </div>
                     )}
                  </div>
               )}
            </Modal.Body>
            <Modal.Footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid #eaeaea' }}>
               {detailProperty && !detailProperty.hasPaidBooking && (
                  <>
                     <BsButton variant="outline-warning" size="sm" onClick={() => { openEdit(detailProperty); setDetailProperty(null); }}>
                        ✏️ Edit
                     </BsButton>
                     <BsButton variant="outline-danger" size="sm" onClick={() => handleDelete(detailProperty._id)}>
                        🗑 Delete
                     </BsButton>
                  </>
               )}
               <BsButton variant="secondary" onClick={() => setDetailProperty(null)}>Close</BsButton>
            </Modal.Footer>
         </Modal>

         {/* Edit Modal */}
         <Modal show={!!editProperty} onHide={() => setEditProperty(null)} size="lg" centered>
            <Modal.Header closeButton style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid #eaeaea' }}>
               <Modal.Title style={{ color: 'var(--text-main)', fontFamily: "'Playfair Display', serif" }}>Edit Property</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: 'var(--bg-primary)' }}>
               <Form>
                  <Row className="mb-3">
                     <Form.Group as={Col} md="6">
                        <Form.Label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Property Type</Form.Label>
                        <Form.Select name="propertyType" value={editData.propertyType} onChange={handleEditChange}
                           style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid #eaeaea' }}>
                           <option value="residential">Residential</option>
                           <option value="commercial">Commercial</option>
                           <option value="land/plot">Land/Plot</option>
                        </Form.Select>
                     </Form.Group>
                     <Form.Group as={Col} md="6">
                        <Form.Label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Ad Type</Form.Label>
                        <Form.Select name="propertyAdType" value={editData.propertyAdType} onChange={handleEditChange}
                           style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid #eaeaea' }}>
                           <option value="rent">Rent</option>
                           <option value="sale">Sale</option>
                        </Form.Select>
                     </Form.Group>
                  </Row>
                  <Row className="mb-3">
                     <Form.Group as={Col} md="12">
                        <Form.Label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Address</Form.Label>
                        <Form.Control type="text" name="propertyAddress" value={editData.propertyAddress} onChange={handleEditChange}
                           style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid #eaeaea' }} />
                     </Form.Group>
                  </Row>
                  <Row className="mb-3">
                     <Form.Group as={Col} md="6">
                        <Form.Label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Owner Contact</Form.Label>
                        <Form.Control type="text" name="ownerContact" value={editData.ownerContact} onChange={handleEditChange}
                           style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid #eaeaea' }} />
                     </Form.Group>
                     <Form.Group as={Col} md="6">
                        <Form.Label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Amount (Br)</Form.Label>
                        <Form.Control type="number" name="propertyAmt" value={editData.propertyAmt} onChange={handleEditChange}
                           style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid #eaeaea' }} />
                     </Form.Group>
                  </Row>
                  <Form.Group className="mb-3">
                     <Form.Label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Additional Info</Form.Label>
                     <Form.Control as="textarea" rows={3} name="additionalInfo" value={editData.additionalInfo} onChange={handleEditChange}
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid #eaeaea' }} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Change Image (optional)</Form.Label>
                     <Form.Control type="file" onChange={handleImageChange} accept="image/*" 
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid #eaeaea' }} />
                  </Form.Group>
               </Form>
            </Modal.Body>
            <Modal.Footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid #eaeaea' }}>
               <BsButton variant="secondary" onClick={() => setEditProperty(null)}>Cancel</BsButton>
               <BsButton variant="primary" onClick={handleEditSave} style={{ background: 'var(--accent-color)', border: 'none' }}>Save Changes</BsButton>
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
   statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 },
   statCard: {
      background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid #eaeaea',
      padding: '20px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
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
   typeBadge: {
      background: 'rgba(201,168,76,0.15)', color: 'var(--accent-color)',
      padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
   },
   statusBadge: {
      padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
   },
   actionBtn: {
      padding: '6px 10px', borderRadius: 6, fontSize: 12,
      fontWeight: 600, cursor: 'pointer', border: 'none',
      transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
   },
   detailBtn: { background: 'rgba(52,152,219,0.15)', color: '#3498db' },
   editBtn: { background: 'rgba(201,168,76,0.15)', color: 'var(--accent-color)' },
   deleteBtn: { background: 'rgba(231,76,60,0.15)', color: '#e74c3c', marginLeft: 'auto' },
   emptyState: { textAlign: 'center', padding: '60px 0' },
   detailGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
   },
   detailItem: {
      display: 'flex', flexDirection: 'column', gap: 4,
   },
   detailLabel: {
      fontSize: 10, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600
   },
   detailValue: { color: 'var(--text-main)', fontSize: 14, fontWeight: 500 },
};

export default AllProperties;