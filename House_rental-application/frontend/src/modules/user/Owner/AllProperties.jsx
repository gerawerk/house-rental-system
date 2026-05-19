import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Col, InputGroup, Row, FloatingLabel, Card, Container } from 'react-bootstrap';

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

   const handleClose = () => setShow(false);

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
         const response = await axios.get('http://localhost:8000/api/owner/getallproperties', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });
         if (response.data.success) {
            setAllProperties(response.data.data);
         } else {
            message.error('Something went wrong');
         }
      } catch (error) {
         console.log(error);
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

   useEffect(() => {
      setEditingPropertyData((prevDetails) => ({
         ...prevDetails,
         propertyImage: image,
      }));
   }, [image]);

   const saveChanges = async (propertyId, status) => {
      try {
         const formData = new FormData();
         formData.append('propertyType', editingPropertyData.propertyType);
         formData.append('propertyAdType', editingPropertyData.propertyAdType);
         formData.append('propertyAddress', editingPropertyData.propertyAddress);
         formData.append('ownerContact', editingPropertyData.ownerContact);
         formData.append('propertyAmt', editingPropertyData.propertyAmt);
         formData.append('additionalInfo', editingPropertyData.additionalInfo);
         formData.append('propertyImage', image);
         formData.append('isAvailable', status);
         const res = await axios.patch(`http://localhost:8000/api/owner/updateproperty/${propertyId}`, formData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });
         if (res.data.success) {
            message.success(res.data.message);
            handleClose();
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
            const response = await axios.delete(`http://localhost:8000/api/owner/deleteproperty/${propertyId}`, {
               headers: { 'Authorization':`Bearer ${localStorage.getItem("token")}` }
            });
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

   return (
      <Container style={{ backgroundColor: 'black', minHeight: '100vh', padding: '20px' }}>
         {allProperties.map((property) => (
            <Card
               key={property._id}
               style={{
                  backgroundColor: '#333',
                  color: 'white',
                  marginBottom: '20px',
                  padding: '20px',
                  borderRadius: '10px'
               }}
            >
               <Card.Body>
                  <Card.Title>{property.propertyType}</Card.Title>
                  <Card.Text><strong>Ad Type:</strong> {property.propertyAdType}</Card.Text>
                  <Card.Text><strong>Address:</strong> {property.propertyAddress}</Card.Text>
                  <Card.Text><strong>Owner Contact:</strong> {property.ownerContact}</Card.Text>
                  <Card.Text><strong>Amount:</strong> {property.propertyAmt}</Card.Text>
                  <Card.Text><strong>Availability:</strong> {property.isAvailable ? 'Available' : 'Not Available'}</Card.Text>
                  <Button variant="outline-info" onClick={() => handleShow(property._id)}>Edit</Button>
                  <Button variant="outline-danger" className="mx-2" onClick={() => handleDelete(property._id)}>Delete</Button>
               </Card.Body>
            </Card>
         ))}

         {/* Modal for editing property */}
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
               <Modal.Title>Edit Property</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Form onSubmit={() => saveChanges(editingPropertyId)}>
                  <Row className="mb-3">
                     <Form.Group as={Col} md="6">
                        <Form.Label>Property Type</Form.Label>
                        <Form.Select name="propertyType" value={editingPropertyData.propertyType} onChange={handleChange}>
                           <option disabled>Choose...</option>
                           <option value="residential">Residential</option>
                           <option value="commercial">Commercial</option>
                           <option value="land/plot">Land/Plot</option>
                        </Form.Select>
                     </Form.Group>
                     <Form.Group as={Col} md="6">
                        <Form.Label>Ad Type</Form.Label>
                        <Form.Select name="propertyAdType" value={editingPropertyData.propertyAdType} onChange={handleChange}>
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
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="number" placeholder="Amount" name="propertyAmt" value={editingPropertyData.propertyAmt} onChange={handleChange} required />
                     </Form.Group>
                  </Row>
                  <FloatingLabel label="Additional Details" className="mb-3">
                     <Form.Control as="textarea" name="additionalInfo" value={editingPropertyData.additionalInfo} onChange={handleChange} placeholder="Additional Info" />
                  </FloatingLabel>
                  <Button variant="outline-info" type="submit">Update</Button>
               </Form>
            </Modal.Body>
         </Modal>
      </Container>
   );
};

export default AllProperties;