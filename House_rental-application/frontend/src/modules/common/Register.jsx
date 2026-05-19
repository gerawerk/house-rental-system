import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import { message } from 'antd';

const Register = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    type: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!data?.name || !data?.email || !data?.password || !data?.type) return alert("Please fill all fields");
    else {
      axios.post('http://localhost:8000/api/user/register', data)
        .then((response) => {
          if (response.data.success) {
            message.success(response.data.message);
            navigate('/login')
          } else {
            message.error(response.data.message)
          }
        })
        .catch((error) => {
          console.log("Error", error);
        });
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-primary shadow-sm">
        <Container fluid>
          <Navbar.Brand><h2 className="text-white">RentEase</h2></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <Link className="nav-link text-white" to={'/'}>Home</Link>
              <Link className="nav-link text-white" to={'/login'}>Login</Link>
              <Link className="nav-link text-white" to={'/register'}>Register</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="Renter Full Name/Owner Name"
              name="name"
              value={data.name}
              onChange={handleChange}
              autoComplete="name"
              autoFocus
              sx={{ backgroundColor: 'white', borderRadius: '8px' }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
              sx={{ backgroundColor: 'white', borderRadius: '8px' }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              value={data.password}
              onChange={handleChange}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              sx={{ backgroundColor: 'white', borderRadius: '8px' }}
            />
            <InputLabel id="user-type-label" sx={{ marginTop: '16px' }}>User Type</InputLabel>
            <Select
              labelId="user-type-label"
              id="user-type-select"
              name='type'
              value={data.type}
              label="User Type"
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: '16px', backgroundColor: 'white', borderRadius: '8px' }}
            >
              <MenuItem value={'Select User'} disabled>Select User</MenuItem>
              <MenuItem value={'Renter'}>Renter</MenuItem>
              <MenuItem value={"Owner"}>Owner</MenuItem>
            </Select>
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: '100%', padding: '12px' }}
              >
                Sign Up
              </Button>
            </Box>
            <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
              <Grid item>
                <Typography variant="body2">
                  Already have an account? 
                  <Link to="/login" className="text-primary"> Sign In</Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Register;
