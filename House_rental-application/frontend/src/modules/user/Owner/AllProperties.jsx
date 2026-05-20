import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Col, Row, FloatingLabel, Card, Container, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaHome } from 'react-icons/fa';
import api from '../../../services/api';

const AllProperties = () => {
   const [image, setImage] = useState(null);
   const [editingPropertyId, setEditingPropertyId] = useState(null);
   const [editingPropertyData, setEditingPropertyData] = useState({
      propertyType: '',
      propertyAdType: '',
      propertyAddress: '',
      ownerContact: '',
      propertyAmt: 0,
      additionalInfo: ''
   });
   const [allProperties, setAllProperties] = useState([]);
   const [show, setShow] = useState(false);
   const [loading, setLoading] = useState(true);

   const handleClose = () => {
      setShow(false);
      setImage(null); // Clear image slot on modal exit
   };

   const handleShow = (propertyId) => {
      const propertyToEdit = allProperties.find(property => property._id === propertyId);
      if (propertyToEdit) {
         setEditingPropertyId(propertyId);
         setEditingPropertyData(propertyToEdit);
         setShow(true);
      }
   };

   const getAllProperty = async () => {
      try {
           const response = await api.get('/owner/getallproperties');
         if (response.data.success) {
            setAllProperties(response.data.data);
         } else {
            message.error('Something went wrong');
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      getAllProperty();
   }, []);

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      setImage(file);
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setEditingPropertyData({ ...editingPropertyData, [name]: value });
   };

   const saveChanges = async (propertyId) => {
      try {
         const formData = new FormData();
         formData.append('propertyType', editingPropertyData.propertyType);
         formData.append('propertyAdType', editingPropertyData.propertyAdType);
         formData.append('propertyAddress', editingPropertyData.propertyAddress);
         formData.append('ownerContact', editingPropertyData.ownerContact);
         formData.append('propertyAmt', editingPropertyData.propertyAmt);
         formData.append('additionalInfo', editingPropertyData.additionalInfo);
         if (image) formData.append('propertyImage', image);
         formData.append('isAvailable', editingPropertyData.isAvailable || 'Available');
         const res = await api.patch(`/owner/updateproperty/${propertyId}`, formData, {headers: { 'Content-Type': 'multipart/form-data' }
          });
         if (res.data.success) {
            message.success(res.data.message);
            handleClose();
            getAllProperty(); 
         }
      } catch (error) {
         console.log(error);
         message.error('Failed to save changes');
      }
   };

   const handleDelete = async (propertyId) => {
      let assure = window.confirm("Are you sure you want to delete?");
      if (assure) {
         try {
           const response = await api.delete(`/owner/deleteproperty/${propertyId}`);
            if (response.data.success) {
               message.success(response.data.message);
               getAllProperty();
            } else {
               message.error(response.data.message);
            }
         } catch (error) {
            console.log(error);
         }
      }
   };

   if (loading) {
      return (
         <div className="text-center mt-5">
            <Spinner animation="border" variant="light" />
            <p className="text-light mt-2">Loading your properties...</p>
         </div>
      );
   }

   return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '30px' }}>
         <Container fluid>
            <h2 className="text-light mb-4">My Properties</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
               {allProperties.map((property) => (
                  <Col key={property._id}>
                     <Card className="h-100 bg-dark text-white border-secondary">
                        {property.propertyImage && property.propertyImage.length > 0 ? (
                           <Card.Img
                              variant="top"
                             src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${property.propertyImage[0].path}`}
                              style={{ height: '200px', objectFit: 'cover' }}
                              alt={property.propertyAddress}
                           />
                        ) : (
                           <div style={{ height: '200px', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FaHome size={50} color="#aaa" />
                           </div>
                        )}
                        <Card.Body>
                           <Card.Title>{property.propertyType}</Card.Title>
                           <Card.Text>
                              <strong>Ad Type:</strong> {property.propertyAdType}<br />
                              <strong>Address:</strong> {property.propertyAddress}<br />
                              <strong>Owner Contact:</strong> {property.ownerContact}<br />
                              <strong>Amount:</strong> Br {property.propertyAmt.toLocaleString()}<br />
                              <strong>Availability:</strong> {property.isAvailable === 'Available' ? 'Available' : 'Not Available'}
                           </Card.Text>
                        </Card.Body>
                        
                        <Card.Footer className="bg-dark border-secondary d-flex align-items-center justify-content-between">
                           {property.hasPaidBooking ? (
                              <div className="text-warning small w-100 text-center border border-warning rounded p-2" style={{ backgroundColor: 'rgba(255, 193, 7, 0.05)' }}>
                                 <strong>Status:</strong> Rented already / Has Active Booking
                              </div>
                           ) : (
                              <>
                                 <Button
                                    variant="outline-info"
                                    size="sm"
                                    onClick={() => handleShow(property._id)}
                                 >
                                    <FaEdit /> Edit
                                 </Button>
                                 <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(property._id)}
                                 >
                                    <FaTrash /> Delete
                                 </Button>
                              </>
                           )}
                        </Card.Footer>
                     </Card>
                  </Col>
               ))}
               {allProperties.length === 0 && (
                  <Col>
                     <div className="alert alert-info">You haven't added any properties yet.</div>
                  </Col>
               )}
            </Row>
         </Container>

         {/* Edit Modal */}
         <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
               <Modal.Title>Edit Property</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form onSubmit={(e) => {
                  e.preventDefault();
                  saveChanges(editingPropertyId);
               }}>
                  <Row className="mb-3">
                     <Form.Group as={Col} md="6">
                        <Form.Label>Property Type</Form.Label>
                        <Form.Select name="propertyType" value={editingPropertyData.propertyType} onChange={handleChange} required>
                           <option disabled>Choose...</option>
                           <option value="residential">Residential</option>
                           <option value="commercial">Commercial</option>
                           <option value="land/plot">Land/Plot</option>
                        </Form.Select>
                     </Form.Group>
                     <Form.Group as={Col} md="6">
                        <Form.Label>Ad Type</Form.Label>
                        <Form.Select name="propertyAdType" value={editingPropertyData.propertyAdType} onChange={handleChange} required>
                           <option disabled>Choose...</option>
                           <option value="rent">Rent</option>
                           <option value="sale">Sale</option>
                        </Form.Select>
                     </Form.Group>
                  </Row>
                  <Row className="mb-3">
                     <Form.Group as={Col} md="12">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="Address" name="propertyAddress" value={editingPropertyData.propertyAddress} onChange={handleChange} required />
                     </Form.Group>
                  </Row>
                  <Row className="mb-3">
                     <Form.Group as={Col} md="6">
                        <Form.Label>Owner Contact</Form.Label>
                        <Form.Control type="text" placeholder="Contact Number" name="ownerContact" value={editingPropertyData.ownerContact} onChange={handleChange} required />
                     </Form.Group>
                     <Form.Group as={Col} md="6">
                        <Form.Label>Amount (Br)</Form.Label>
                        <Form.Control type="number" placeholder="Amount" name="propertyAmt" value={editingPropertyData.propertyAmt} onChange={handleChange} required />
                     </Form.Group>
                  </Row>
                  <FloatingLabel label="Additional Details" className="mb-3">
                     <Form.Control as="textarea" name="additionalInfo" value={editingPropertyData.additionalInfo} onChange={handleChange} placeholder="Additional Info" rows={3} />
                  </FloatingLabel>
                  <Form.Group className="mb-3">
                     <Form.Label>Change Image (optional)</Form.Label>
                     <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
                  </Form.Group>
                  <Button variant="primary" type="submit">Update Property</Button>
               </Form>
            </Modal.Body>
         </Modal>
      </div>
   );
};

export default AllProperties;