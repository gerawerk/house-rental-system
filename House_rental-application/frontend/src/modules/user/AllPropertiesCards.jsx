import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Carousel, Col, Form, InputGroup, Row, Container, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { FaHome } from 'react-icons/fa';
import api from '../../services/api';

const AllPropertiesCards = ({ loggedIn }) => {
   const [index, setIndex] = useState(0);
   const [show, setShow] = useState(false);
   const [allProperties, setAllProperties] = useState([]);
   const [filterPropertyType, setPropertyType] = useState('');
   const [filterPropertyAdType, setPropertyAdType] = useState('');
   const [filterPropertyAddress, setPropertyAddress] = useState('');
   const [propertyOpen, setPropertyOpen] = useState(null);
   const [loading, setLoading] = useState(true);
   const [userDetails, setUserDetails] = useState({
      fullName: '',
      phone: 0,
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setUserDetails({ ...userDetails, [name]: value });
   };

   const handleClose = () => setShow(false);

   const handleShow = (propertyId) => {
      setPropertyOpen(propertyId);
      setShow(true);
   };

   const getAllProperties = async () => {
      try {
         const res = await api.get('/user/getAllProperties');
         setAllProperties(res.data.data);
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   };

   const handleBooking = async (status, propertyId, ownerId) => {
      try {
      await api.post(`/user/bookinghandle/${propertyId}`, { userDetails, status, ownerId })
       .then((res) => {
               if (res.data.success) {
                  message.success(res.data.message);
                  handleClose();
               } else {
                  message.error(res.data.message);
               }
            });
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      getAllProperties();
   }, []);

   const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
   };

   // 🔥 FILTER: show ALL properties (Available or Taken), apply user filters
   const filteredProperties = allProperties
      .filter((property) => filterPropertyAddress === '' || property.propertyAddress.toLowerCase().includes(filterPropertyAddress.toLowerCase()))
      .filter(
         (property) =>
            filterPropertyAdType === '' ||
            property.propertyAdType.toLowerCase().includes(filterPropertyAdType.toLowerCase())
      )
      .filter(
         (property) =>
            filterPropertyType === '' ||
            property.propertyType.toLowerCase().includes(filterPropertyType.toLowerCase())
      );

   if (loading) {
      return (
         <div className="text-center mt-5">
            <Spinner animation="border" variant="secondary" />
            <p className="mt-2 text-muted">Loading properties...</p>
         </div>
      );
   }

   return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', padding: '20px 0' }}>
         <Container fluid>
            {/* FILTER SECTION – raised card, white background */}
            <div
               className="mb-5 p-4"
               style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #eaeaea',
               }}
            >
               <h5 className="mb-3" style={{ color: '#1e2a3a', fontWeight: 600 }}>
                  🔍 Find your perfect place
               </h5>
               <Row className="g-3 align-items-end">
                  <Col md={4}>
                     <Form.Label className="text-secondary small fw-semibold">📍 Location</Form.Label>
                     <InputGroup>
                        <InputGroup.Text style={{ background: 'var(--bg-secondary)', borderRight: 'none' }}>
                           <i className="ti ti-map-pin" />
                        </InputGroup.Text>
                        <Form.Control
                           type="text"
                           placeholder="e.g., Addis Ababa, Debre Tabor"
                           value={filterPropertyAddress}
                           onChange={(e) => setPropertyAddress(e.target.value)}
                           style={{ borderLeft: 'none' }}
                        />
                     </InputGroup>
                  </Col>
                  <Col md={3}>
                     <Form.Label className="text-secondary small fw-semibold">🏷️ Ad type</Form.Label>
                     <Form.Select value={filterPropertyAdType} onChange={(e) => setPropertyAdType(e.target.value)}>
                        <option value="">All (Rent / Sale)</option>
                        <option value="sale">Sale</option>
                        <option value="rent">Rent</option>
                     </Form.Select>
                  </Col>
                  <Col md={3}>
                     <Form.Label className="text-secondary small fw-semibold">🏠 Property type</Form.Label>
                     <Form.Select value={filterPropertyType} onChange={(e) => setPropertyType(e.target.value)}>
                        <option value="">All types</option>
                        <option value="commercial">Commercial</option>
                        <option value="land/plot">Land/Plot</option>
                        <option value="residential">Residential</option>
                     </Form.Select>
                  </Col>
                  <Col md={2}>
                     <Button
                        variant="outline-secondary"
                        onClick={() => {
                           setPropertyAddress('');
                           setPropertyAdType('');
                           setPropertyType('');
                        }}
                        style={{ width: '100%' }}
                     >
                        Clear filters
                     </Button>
                  </Col>
               </Row>
            </div>

            {/* Results summary */}
            <div className="d-flex justify-content-between align-items-center mb-3">
               <h5 style={{ color: '#1e2a3a', fontWeight: 500 }}>All properties</h5>
               <span className="text-muted small">
                  {filteredProperties.length} listing{filteredProperties.length !== 1 ? 's' : ''} found
               </span>
            </div>

            {/* PROPERTY GRID – 3 columns */}
            <Row xs={1} md={2} lg={3} className="g-4">
               {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => {
                     const isTaken = property.isAvailable !== 'Available';
                     return (
                        <Col key={property._id}>
                           <Card
                              className="h-100 border-0 rounded-4 overflow-hidden"
                              style={{
                                 transition: 'transform 0.2s, box-shadow 0.2s',
                                 boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                 opacity: isTaken ? 0.75 : 1, // slightly dim taken properties
                              }}
                              onMouseEnter={(e) => {
                                 if (!isTaken) {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.1)';
                                 }
                              }}
                              onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                              }}
                           >
                              {property.propertyImage && property.propertyImage.length > 0 ? (
                                 <div style={{ position: 'relative' }}>
                                    <Card.Img
                                       variant="top"
                                       src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${property.propertyImage[0].path}`}
                                       style={{ height: '200px', objectFit: 'cover' }}
                                       alt={property.propertyAddress}
                                    />
                                    {isTaken && (
                                       <div style={{
                                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                       }}>
                                          <span style={{
                                             background: '#e74c3c', color: 'var(--bg-secondary)', padding: '8px 24px',
                                             borderRadius: 4, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
                                             transform: 'rotate(-15deg)', border: '2px solid #fff'
                                          }}>TAKEN</span>
                                       </div>
                                    )}
                                 </div>
                              ) : (
                                 <div style={{ height: '200px', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                    <FaHome size={40} color="#adb5bd" />
                                    {isTaken && (
                                       <div style={{
                                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                       }}>
                                          <span style={{
                                             background: '#e74c3c', color: 'var(--bg-secondary)', padding: '8px 24px',
                                             borderRadius: 4, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
                                             transform: 'rotate(-15deg)', border: '2px solid #fff'
                                          }}>TAKEN</span>
                                       </div>
                                    )}
                                 </div>
                              )}
                              <Card.Body>
                                 <div className="d-flex justify-content-between align-items-start mb-2">
                                    <Card.Title className="mb-0" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                       {property.propertyAddress.split(',')[0]}
                                    </Card.Title>
                                    {!isTaken ? (
                                       <Badge bg="success" pill>Available</Badge>
                                    ) : (
                                       <Badge bg="danger" pill>Taken</Badge>
                                    )}
                                 </div>
                                 <div className="mb-2">
                                    <span className="badge bg-light text-dark me-1">{property.propertyType}</span>
                                    <span className="badge bg-light text-dark">
                                       {property.propertyAdType === 'rent' ? 'For rent' : 'For sale'}
                                    </span>
                                 </div>
                                 <Card.Text className="text-muted small">
                                    <i className="ti ti-map-pin me-1" /> {property.propertyAddress}
                                    <br />
                                    <strong>Price:</strong> Br {property.propertyAmt?.toLocaleString()}
                                    {loggedIn && (
                                       <>
                                          <br />
                                          <strong>Contact:</strong> {property.ownerContact}
                                       </>
                                    )}
                                 </Card.Text>
                              </Card.Body>
                              <Card.Footer className="bg-white border-top-0 pb-3 pt-0">
                                 {!loggedIn ? (
                                    <Link to="/login">
                                       <Button variant="outline-dark" size="sm" className="w-100">
                                          Get info
                                       </Button>
                                    </Link>
                                 ) : (
                                    <Button
                                       onClick={() => handleShow(property._id)}
                                       variant="dark"
                                       size="sm"
                                       className="w-100"
                                       disabled={isTaken}
                                    >
                                       {isTaken ? 'Currently Unavailable' : 'Request booking'}
                                    </Button>
                                 )}
                              </Card.Footer>
                           </Card>
                        </Col>
                     );
                  })
               ) : (
                  <Col>
                     <div className="alert alert-light text-center p-5" role="alert">
                        🏡 No properties match your filters. Try different criteria.
                     </div>
                  </Col>
               )}
            </Row>
         </Container>

        {/* MODAL – full details + booking form */}
        <Modal show={show} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
             <Modal.Title>Property details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             {propertyOpen && allProperties.find((p) => p._id === propertyOpen) && (
                <>
                   {(() => {
                      const property = allProperties.find((p) => p._id === propertyOpen);
                      return (
                         <>
                            {property.propertyImage && property.propertyImage.length > 0 && (
                               <Carousel activeIndex={index} onSelect={handleSelect}>
                                  {property.propertyImage.map((image, idx) => (
                                     <Carousel.Item key={idx}>
                                     <img
                        src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${image.path}`} alt={`Property view ${idx + 1}`}
                        className="d-block w-100"
                        style={{ maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                                     </Carousel.Item>
                                  ))}
                               </Carousel>
                            )}
                            <div className="mt-3">
                               <h5>{property.propertyAdType === 'rent' ? '🏠 For rent' : '💰 For sale'} – {property.propertyType}</h5>
                               <p><strong>📍 Location:</strong> {property.propertyAddress}</p>
                               <p><strong>💰 Price:</strong> Br {property.propertyAmt?.toLocaleString()}</p>
                               <p><strong>📞 Owner contact:</strong> {property.ownerContact}</p>
                               <p><strong>✅ Availability:</strong> {property.isAvailable}</p>
                               <p><strong>ℹ️ Additional info:</strong> {property.additionalInfo}</p>
                            </div>
                            <Form onSubmit={(e) => {
                               e.preventDefault();
                               handleBooking('pending', property._id, property.ownerId);
                            }}>
                               <Row className="mb-3">
                                  <Form.Group as={Col} md="6">
                                     <Form.Label>Full name</Form.Label>
                                     <Form.Control
                                        type="text"
                                        placeholder="Full name"
                                        required
                                        name="fullName"
                                        value={userDetails.fullName}
                                        onChange={handleChange}
                                     />
                                  </Form.Group>
                                  <Form.Group as={Col} md="6">
                                     <Form.Label>Phone number</Form.Label>
                                     <Form.Control
                                        type="number"
                                        placeholder="Phone number"
                                        required
                                        name="phone"
                                        value={userDetails.phone}
                                        onChange={handleChange}
                                     />
                                  </Form.Group>
                               </Row>
                               <Button type="submit" variant="primary">Book property</Button>
                            </Form>
                         </>
                      );
                   })()}
                </>
             )}
          </Modal.Body>
        </Modal>
      </div>
   );
};

export default AllPropertiesCards;