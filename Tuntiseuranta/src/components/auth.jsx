import { Button } from "@mui/material"
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    if (currentUser) {
        navigate('/');
    }

    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);

        } catch (err) {
            console.error(err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);

        } catch (err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <input placeholder="Email..." onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password..." type="password" onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={signIn}>Sign in</Button>
            <Button onClick={signInWithGoogle}>Sign in With Google</Button>
            <Button onClick={logout}>Logout</Button>
        </div>
    )
}
