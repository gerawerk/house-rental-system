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
import Button from '@mui/material/Button';

const AllUsers = () => {
   const [allUser, setAllUser] = useState([]);

   useEffect(() => {
      getAllUser();
   }, []);

   const getAllUser = async () => {
      try {
         const response = await axios.get('http://localhost:8000/api/admin/getallusers', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });

         if (response.data.success) {
            setAllUser(response.data.data);
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleStatus = async (userid, status) => {
      try {
         await axios.post('http://localhost:8000/api/admin/handlestatus', { userid, status }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         }).then((res) => {
            if (res.data.success) {
               getAllUser();
            }
         });
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
         <TableContainer component={Paper} style={{ backgroundColor: '#333' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
               <TableHead>
                  <TableRow>
                     <TableCell style={{ color: 'white' }}>User ID</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Name</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Email</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Type</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Granted (for Owners users only)</TableCell>
                     <TableCell align="center" style={{ color: 'white' }}>Actions</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {allUser.map((user) => (
                     <TableRow
                        key={user._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                     >
                        <TableCell component="th" scope="row" style={{ color: 'white' }}>
                           {user._id}
                        </TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{user.name}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{user.email}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{user.type}</TableCell>
                        <TableCell align="center" style={{ color: 'white' }}>{user.granted}</TableCell>
                        <TableCell align="center">
                           {user.type === 'Owner' && user.granted === 'ungranted' ? (
                              <Button onClick={() => handleStatus(user._id, 'granted')} size='small' variant="contained" color="success">
                                 Grant
                              </Button>
                           ) : user.type === 'Owner' && user.granted === 'granted' ? (
                              <Button onClick={() => handleStatus(user._id, 'ungranted')} size='small' variant="outlined" color="error">
                                 Ungrant
                              </Button>
                           ) : null}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </div>
   );
};

export default AllUsers;