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
import axios from 'axios';
import { message } from 'antd';

const Login = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data?.email || !data?.password) {
      return alert("Please fill all fields");
    } else {
      axios.post('http://localhost:8000/api/user/login', data)
        .then((res) => {
          if (res.data.success) {
            message.success(res.data.message);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            const isLoggedIn = JSON.parse(localStorage.getItem("user"));

            switch (isLoggedIn.type) {
              case "Admin":
                navigate("/adminhome");
                break;
              case "Renter":
                navigate("/renterhome");
                break;
              case "Owner":
                if (isLoggedIn.granted === 'ungranted') {
                  message.error('Your account is not yet confirmed by the admin');
                } else {
                  navigate("/ownerhome");
                }
                break;
              default:
                navigate("/login");
                break;
            }
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            message.error(res.data.message);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            alert("User doesn't exist");
          }
          navigate("/login");
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
              {/* You can add additional navigation items here if needed */}
            </Nav>
            <Nav>
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
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
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
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: '100%', padding: '12px' }}
              >
                Sign In
              </Button>
            </Box>
            <Grid container justifyContent="center" sx={{ marginTop: '16px' }}>
              <Grid item>
                <Typography variant="body2">
                  Forgot your password? 
                  <Link to="/forgotpassword" className="text-primary"> Click here</Link>
                </Typography>
              </Grid>
            </Grid>
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

export default Login;
