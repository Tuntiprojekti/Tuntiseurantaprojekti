import { Button } from "@mui/material";
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const register = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.alert('Registration successful.');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                window.alert('This email is already registered.');
            } else {
                console.error(err);
                window.alert('An error occurred during registration. Please try again.');
            }
        }
    };

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.alert('Login successful.');
        } catch (err) {
            console.error(err);
            window.alert('An error occurred during login. Please try again.');
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            window.alert('Sign in with Google successful.');
        } catch (err) {
            console.error(err);
            window.alert('An error occurred during Google sign in. Please try again.');
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            window.alert('You have been logged out.');
        } catch (err) {
            console.error(err);
            window.alert('An error occurred during logout. Please try again.');
        }
    };

    if (currentUser) {
        navigate('/');
    }

    return (
        <div>
            <input 
                placeholder="Email..." 
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                placeholder="Password..."
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={register}>Register</Button>
            <Button onClick={login}>Login</Button>
            <Button onClick={signInWithGoogle}>Sign in With Google</Button>
            <Button onClick={logout}>Logout</Button>
        </div>
    );
};
