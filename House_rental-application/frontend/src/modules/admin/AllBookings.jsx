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

const AllBookings = () => {
   const [allBookings, setAllBookings] = useState([]);

   const getAllBooking = async () => {
      try {
         const response = await axios.get('http://localhost:8000/api/admin/getallbookings', {
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
      getAllBooking();
   }, []);

   return (
      <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
         <TableContainer component={Paper} style={{ backgroundColor: '#333' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
               <TableHead>
                  <TableRow>
                     <TableCell style={{ color: 'white' }}>Booking ID</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Owner ID</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Property ID</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Tenant ID</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Tenant Name</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Tenant Contact</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Booking Status</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {allBookings.map((booking) => (
                     <TableRow
                        key={booking._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                     >
                        <TableCell component="th" scope="row" style={{ color: 'white' }}>
                           {booking._id}
                        </TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{booking.ownerID}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{booking.propertyId}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{booking.userID}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{booking.userName}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{booking.phone}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{booking.bookingStatus}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </div>
   );
};

export default AllBookings;