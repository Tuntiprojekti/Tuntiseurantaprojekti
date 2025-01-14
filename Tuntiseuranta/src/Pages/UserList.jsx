import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { 
    Box, Paper, Typography, List, ListItem, ListItemText, Button 
} from '@mui/material';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const auth = getAuth();
                const currentUser = auth.currentUser;

                if (currentUser) {
                    // Mock example of fetching users if your backend or Firebase has user management
                    const fetchedUsers = [
                        { uid: "1", email: "john.doe@example.com", name: "John Doe" },
                        { uid: "2", email: "jane.doe@example.com", name: "Jane Doe" }
                    ];

                    setUsers(fetchedUsers);
                } else {
                    console.error("No authenticated user detected.");
                }
            } catch (err) {
                console.error("Error fetching users: ", err);
            }
        };

        fetchUsers();
    }, []);

    const handleViewStatistics = (userId) => {
        navigate(`/admin/statistics/${userId}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
                <Typography variant="h4" gutterBottom>
                    Registered Users
                </Typography>
                {users.length > 0 ? (
                    <List>
                        {users.map((user) => (
                            <ListItem key={user.uid} sx={{ mb: 2 }}>
                                <ListItemText 
                                    primary={user.name || "No Name Available"} 
                                    secondary={user.email || "No Email Available"} 
                                />
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => handleViewStatistics(user.uid)}
                                >
                                    View Statistics
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No users found.</Typography>
                )}
            </Paper>
        </Box>
    );
};

export default UserList;
