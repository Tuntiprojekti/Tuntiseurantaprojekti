import { useState } from 'react';
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const ManageWorkplaces = () => {
    const { isAdmin } = useAuth();
    const [workplace, setWorkplace] = useState('');

    const handleAddWorkplace = async () => {
        if (!isAdmin) {
            alert("Only admins can add workplaces.");
            return;
        }

        try {
            await addDoc(collection(db, "Workplaces"), {
                name: workplace
            });
            alert("Workplace added successfully!");
            setWorkplace('');
        } catch (err) {
            console.error("Error adding workplace: ", err);
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
                    Add New Workplace
                </Typography>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField 
                        label="Workplace Name" 
                        variant="outlined" 
                        fullWidth 
                        value={workplace}
                        onChange={(e) => setWorkplace(e.target.value)}
                    />
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleAddWorkplace}
                        fullWidth
                    >
                        Add Workplace
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ManageWorkplaces;
