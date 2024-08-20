// src/components/Auth.jsx
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import { auth, googleProvider } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.alert('Login successful.');
        } catch (err) {
            console.error(err);
            window.alert('An error occurred during login. Please try again.');
        }
    };

 

    if (currentUser) {
        navigate('/');
    }

    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100vh"
            bgcolor="#f5f5f5"
        >
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Login to Your Account
                </Typography>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField 
                        label="Email" 
                        variant="outlined" 
                        fullWidth 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField 
                        label="Password" 
                        variant="outlined" 
                        type="password" 
                        fullWidth 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={login}
                        fullWidth
                    >
                        Login
                    </Button>
                    
                    <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
                        Don't have an account? 
                        <Link to="/register" style={{ textDecoration: 'none', color: '#3f51b5', marginLeft: '5px' }}>
                            Register here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};
