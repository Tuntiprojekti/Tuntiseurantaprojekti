import { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Paper, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { addDoc, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageWorkplaces = () => {
    const { isAdmin } = useAuth();
    const [workplace, setWorkplace] = useState('');
    const [salary, setSalary] = useState('');
    const [workplaces, setWorkplaces] = useState([]);

    useEffect(() => {
        const fetchWorkplaces = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Workplaces"));
                const workplaceList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWorkplaces(workplaceList);
            } catch (err) {
                console.error("Error fetching workplaces: ", err);
            }
        };

        fetchWorkplaces();
    }, []);

    const handleAddWorkplace = async () => {
        if (!isAdmin) {
            alert("Only admins can add workplaces.");
            return;
        }

        if (!workplace || !salary) {
            alert("Please fill in both workplace name and salary.");
            return;
        }

        try {
            await addDoc(collection(db, "Workplaces"), {
                name: workplace,
                salary: parseFloat(salary) // Parse salary to a number
            });
            alert("Workplace added successfully!");
            setWorkplace('');
            setSalary('');
            const querySnapshot = await getDocs(collection(db, "Workplaces"));
            setWorkplaces(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error("Error adding workplace: ", err);
        }
    };

    const handleDeleteWorkplace = async (id) => {
        if (!isAdmin) {
            alert('Only admins can delete wrokplaces.')
        }

    try {
        await deleteDoc(doc(db, 'Workplaces', id))
        alert('Workplace deleted successfully!')
        const querySnapshot = await getDocs(collection(db, 'Workplaces'))
        setWorkplaces(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()})))
    } catch (err) {
        console.error('Error deleting workplace: ', err)
    }
}

return (
    <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        bgcolor="#f5f5f5"
    >
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, width: '100%' }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Manage Workplaces
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField 
                    label="Workplace Name" 
                    variant="outlined" 
                    fullWidth 
                    value={workplace}
                    onChange={(e) => setWorkplace(e.target.value)}
                />
                <TextField 
                    label="Salary per Hour (€)" 
                    variant="outlined" 
                    fullWidth 
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
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

            {/* List of current workplaces */}
            <Typography variant="h6" component="h2" sx={{ marginTop: 4 }}>
                Current Workplaces
            </Typography>
            <List>
    {workplaces.map((workplace) => (
        <ListItem key={workplace.id}>
            <ListItemText 
                primary={workplace.name} 
                secondary={`Salary: €${workplace.salary ? workplace.salary.toFixed(2) : 'N/A'} per hour`} 
            />
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteWorkplace(workplace.id)}>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    ))}
</List>
        </Paper>
    </Box>
);
};

export default ManageWorkplaces;