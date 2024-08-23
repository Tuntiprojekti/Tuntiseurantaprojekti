// src/components/Register.jsx
import { useState } from "react";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Lisää tämä rivi

export const Register = () => {
    const { isAdmin } = useAuth(); // Lisää tämä rivi
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const register = async () => {
        if (!isAdmin) { // Lisää tämä tarkistus
            window.alert('Only admins can register new users.');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.alert('Registration successful.');
            navigate('/');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                window.alert('This email is already registered.');
            } else {
                console.error(err);
                window.alert('An error occurred during registration. Please try again.');
            }
        }
    };

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
                    Create an Account
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
                        onClick={register}
                        fullWidth
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};
