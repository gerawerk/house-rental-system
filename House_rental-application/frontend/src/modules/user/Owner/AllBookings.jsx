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

const AllProperty = () => {
   const [allBookings, setAllBookings] = useState([]);

   const getAllProperty = async () => {
      try {
         const response = await axios.get('http://localhost:8000/api/owner/getallbookings', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });
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

   const handleStatus = async (bookingId, propertyId, status) => {
      try {
         const res = await axios.post('http://localhost:8000/api/owner/handlebookingstatus', { bookingId, propertyId, status }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         })
         if (res.data.success) {
            message.success(res.data.message);
            getAllProperty();
         }
         else {
            message.error('Something went wrong');
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
         <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
            <Typography variant="h4" component="h1" align="center" sx={{ marginBottom: 4, color: '#f5f5f5' }}>
               All Property Bookings
            </Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: '#333', color: 'white', borderRadius: '8px' }}>
               <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                     <TableRow>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }}>Booking ID</TableCell>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }} align="center">Property ID</TableCell>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }} align="center">Tenant Name</TableCell>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }} align="center">Tenant Phone</TableCell>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }} align="center">Booking Status</TableCell>
                        <TableCell sx={{ color: '#f5f5f5', fontWeight: 'bold' }} align="center">Actions</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {allBookings.map((booking) => (
                        <TableRow
                           key={booking._id}
                           sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                              backgroundColor: '#444',
                              '&:hover': { backgroundColor: '#555' },
                           }}
                        >
                           <TableCell component="th" scope="row" sx={{ color: '#e0e0e0' }}>
                              {booking._id}
                           </TableCell>
                           <TableCell align="center" sx={{ color: '#e0e0e0' }}>
                              {booking.propertyId}
                           </TableCell>
                           <TableCell align="center" sx={{ color: '#e0e0e0' }}>
                              {booking.userName}
                           </TableCell>
                           <TableCell align="center" sx={{ color: '#e0e0e0' }}>
                              {booking.phone}
                           </TableCell>
                           <TableCell align="center" sx={{ color: '#e0e0e0' }}>
                              {booking.bookingStatus}
                           </TableCell>
                           <TableCell align="center">
                              {
                                 booking?.bookingStatus === "pending" ? 
                                 <Button 
                                    onClick={() => handleStatus(booking._id, booking.propertyId, 'booked')} 
                                    variant='outline-success' 
                                    style={{ borderColor: '#28a745', color: '#28a745', padding: '5px 10px' }}
                                 >
                                    Change
                                 </Button> : 
                                 <Button 
                                    onClick={() => handleStatus(booking._id, booking.propertyId, 'pending')} 
                                    variant='outline-danger' 
                                    style={{ borderColor: '#dc3545', color: '#dc3545', padding: '5px 10px' }}
                                 >
                                    Change
                                 </Button>
                              }
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>
         </Container>
      </div>
   );
};

export default AllProperty;