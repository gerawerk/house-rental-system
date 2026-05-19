import React, { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const ForgotPassword = () => {
   const navigate = useNavigate();
   const [data, setData] = useState({
      email: '',
      password: '',
      confirmPassword: ''
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (data.email === "" || data.password === "" || data.confirmPassword === "") {
         alert("Please fill all fields");
      } else if (data.password !== data.confirmPassword) {
         alert("Passwords do not match");
      } else {
         try {
            const res = await axios.post("http://localhost:8000/api/user/forgotpassword", data);
            if (res.data.success) {
               alert('Your password has been changed!');
               navigate('/login');
            } else {
               alert(res.data.message);
            }
         } catch (err) {
            if (err.response && err.response.status === 401) {
               alert("User doesn't exist");
            }
            navigate("/register");
         }
      }
   };

   return (
      <>
         {/* Navbar Section */}
         <Navbar expand="lg" className="bg-primary shadow-sm">
            <Container fluid>
               <Navbar.Brand><h2 className="text-white">RentEase</h2></Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll></Nav>
                  <Nav>
                     <Link className="nav-link text-white" to={'/'}>Home</Link>
                     <Link className="nav-link text-white" to={'/login'}>Login</Link>
                     <Link className="nav-link text-white" to={'/register'}>Register</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>

         {/* Main Content Section */}
         <Container component="main" maxWidth="xs">
            <Box
               sx={{
                  marginTop: 8,
                  marginBottom: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '30px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '10px',
                  boxShadow: 3,
               }}
            >
               {/* Avatar with Lock Icon */}
               <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
               </Avatar>

               {/* Title */}
               <Typography component="h1" variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                  Forgot Password?
               </Typography>

               {/* Form for Resetting Password */}
               <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                  {/* Email Input */}
                  <TextField
                     margin="normal"
                     fullWidth
                     id="email"
                     label="Email Address"
                     name="email"
                     value={data.email}
                     onChange={handleChange}
                     autoComplete="email"
                     autoFocus
                     sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                  />

                  {/* New Password Input */}
                  <TextField
                     margin="normal"
                     fullWidth
                     name="password"
                     value={data.password}
                     onChange={handleChange}
                     label="New Password"
                     type="password"
                     id="password"
                     autoComplete="current-password"
                     sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                  />

                  {/* Confirm Password Input */}
                  <TextField
                     margin="normal"
                     fullWidth
                     name="confirmPassword"
                     value={data.confirmPassword}
                     onChange={handleChange}
                     label="Confirm Password"
                     type="password"
                     id="confirmPassword"
                     autoComplete="current-password"
                     sx={{ backgroundColor: 'white', borderRadius: '8px' }}
                  />

                  {/* Submit Button */}
                  <Box mt={2}>
                     <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ width: '100%', padding: '12px' }}
                     >
                        Change Password
                     </Button>
                  </Box>

                  {/* Links */}
                  <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
                     <Grid item>
                        <Typography variant="body2">
                           Don't have an account? 
                           <Link to="/register" className="text-primary"> Sign Up</Link>
                        </Typography>
                     </Grid>
                  </Grid>
               </Box>
            </Box>
         </Container>
      </>
   );
}

export default ForgotPassword;
