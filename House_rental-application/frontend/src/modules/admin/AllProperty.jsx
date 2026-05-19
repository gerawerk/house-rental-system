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

const AllProperty = () => {
   const [allProperties, setAllProperties] = useState([]);

   const getAllProperty = async () => {
      try {
         const response = await axios.get('http://localhost:8000/api/admin/getallproperties', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });

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

   return (
      <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
         <TableContainer component={Paper} style={{ backgroundColor: '#333' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
               <TableHead>
                  <TableRow>
                     <TableCell style={{ color: 'white' }}>Property ID</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Owner ID</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Property Type</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Property Ad Type</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Property Address</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Owner Contact</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Property Amt</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {allProperties.map((property) => (
                     <TableRow
                        key={property._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                     >
                        <TableCell component="th" scope="row" style={{ color: 'white' }}>
                           {property._id}
                        </TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{property.ownerId}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{property.propertyType}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{property.propertyAdType}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{property.propertyAddress}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{property.ownerContact}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{property.propertyAmt}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </div>
   );
};

export default AllProperty;