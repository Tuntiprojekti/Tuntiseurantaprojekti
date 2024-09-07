// src/components/Register.jsx
import { useState } from "react";
import { Button, TextField, Typography, Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
    const { isAdmin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleAdminPasswordSubmit = async () => {
        handleClose();

        const currentEmail = auth.currentUser.email;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.alert('Registration successful.');

            await signInWithEmailAndPassword(auth, currentEmail, adminPassword); // Käytetään tallennettua adminin salasanaa
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                window.alert('This email is already registered.');
            } else {
                console.error(err);
                window.alert('An error occurred during registration. Please try again.');
            }
        }
    };

    const register = () => {
        if (!isAdmin) {
            window.alert('Only admins can register new users.');
            return;
        }

        if (password !== confirmPassword) {
            window.alert('Passwords do not match.');
            return;
        }

        handleClickOpen(); // Avaa dialogin admin-salasanan syöttöä varten
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
                     <TextField 
                        label="Confirm Password" 
                        variant="outlined" 
                        type="password" 
                        fullWidth 
                        value={confirmPassword} // Käytä uutta tilaa salasanan varmistamiseksi
                        onChange={(e) => setConfirmPassword(e.target.value)} // Lisää käsittelijä
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

            {/* Admin Password Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter Admin Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Admin Password"
                        type="password" // Piilottaa syötön kirjaimet
                        fullWidth
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAdminPasswordSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};