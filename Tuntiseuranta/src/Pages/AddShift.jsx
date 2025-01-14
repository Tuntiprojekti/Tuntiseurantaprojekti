import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fi } from 'date-fns/locale';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from '../config/firebase';
import { Button, MenuItem, Select, Typography, Box, Grid2, Paper, TextField } from "@mui/material";
import { useAuth } from '../context/AuthContext';

const AddShift = () => {
    const [place, setPlace] = useState('');
    const [startDateTime, setStartDateTime] = useState(null);
    const [endDateTime, setEndDateTime] = useState(null);
    const [workplaces, setWorkplaces] = useState([]);
    const baseSalaryPerHour = 10; 
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchWorkplaces = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Workplaces"));
                const workplaceList = querySnapshot.docs.map(doc => doc.data().name);
                setWorkplaces(workplaceList);
            } catch (err) {
                console.error("Error fetching workplaces: ", err);
            }
        };

        fetchWorkplaces();
    }, []);

    const handlePlaceChange = (event) => {
        setPlace(event.target.value);
    };

    const calculateHoursWorked = () => {
        if (!startDateTime || !endDateTime) return 0;
        const diff = endDateTime - startDateTime;
        return diff / (1000 * 60 * 60);
    };

    const calculateDailySalary = () => {
        const hoursWorked = calculateHoursWorked();
        return baseSalaryPerHour * hoursWorked;
    };

    const handleSubmit = async () => {
        if (!currentUser) {
            alert("You must be signed in to add a shift.");
            return;
        }

        if (!place || !startDateTime || !endDateTime || endDateTime <= startDateTime) {
            alert("Please fill all fields and ensure end time is after start time.");
            return;
        }

        const hoursWorked = calculateHoursWorked();

        try {
            await addDoc(collection(db, "Shifts"), {
                place: place,
                startDateTime: startDateTime.toISOString(),
                endDateTime: endDateTime.toISOString(),
                hoursWorked: hoursWorked,
                salary: calculateDailySalary(),
                userId: currentUser.uid,
                userEmail: currentUser.email
            });
            alert("Shift added successfully!");
            setPlace('');
            setStartDateTime(null);
            setEndDateTime(null);
        } catch (err) {
            console.error("Error adding document: ", err);
        }
    };

    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100vh" 
            bgcolor="#f5f5f5" 
            padding={2}
        >
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, width: '100%' }}>
                <Typography variant="h5" gutterBottom>
                    Add Shift
                </Typography>

                {currentUser && (
                    <Typography variant="subtitle1" gutterBottom>
                        Logged in as: {currentUser.email}
                    </Typography>
                )}

               <Grid2 container spacing={3}>
    {/* Workplace Selection */}
    <Grid2 item xs={12}>
        <Typography>Workplace</Typography>
        <Select
        value={place}
        onChange={handlePlaceChange}
        displayEmpty
        fullWidth
        variant="outlined"
        sx={{
            width: '100%',
            minWidth: '300px',
            maxWidth: '100%',
        }}
    >
            <MenuItem value="" disabled>Select place of shift</MenuItem>
            {workplaces.map((workplace, index) => (
                <MenuItem key={index} value={workplace}>
                    {workplace}
                </MenuItem>
            ))}
        </Select>
    </Grid2>

    {/* Start Date and Time */}
    <Grid2 item xs={12}>
        <Typography>Start Date and Time</Typography>
        <Grid2 container spacing={2}>
            <Grid2 item xs={6}>
                <DatePicker
                    selected={startDateTime}
                    onChange={(date) => setStartDateTime(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select start date"
                    locale={fi}
                    customInput={<TextField label="Start Date" fullWidth variant="outlined" />}
                />
            </Grid2>
            <Grid2 item xs={6}>
                <TextField
                    type="time"
                    label="Start Time"
                    fullWidth
                    variant="outlined"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                    onChange={(e) => {
                        const timeParts = e.target.value.split(':');
                        if (startDateTime) {
                            const updatedDate = new Date(startDateTime);
                            updatedDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
                            setStartDateTime(updatedDate);
                        }
                    }}
                />
            </Grid2>
        </Grid2>
    </Grid2>

                    {/* End Date and Time */}
                    <Grid2 item xs={12}>
                        <Typography>End Date and Time</Typography>
                        <Grid2 container spacing={2}>
                            <Grid2 item xs={6}>
                                <DatePicker
                                    selected={endDateTime}
                                    onChange={(date) => setEndDateTime(date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Select end date"
                                    locale={fi}
                                    customInput={<TextField label="End Date" fullWidth variant="outlined" />}
                                />
                            </Grid2>
                            <Grid2 item xs={6}>
                                <TextField
                                    type="time"
                                    label="End Time"
                                    fullWidth
                                    variant="outlined"
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true
                                        }
                                    }}
                                    onChange={(e) => {
                                        const timeParts = e.target.value.split(':');
                                        if (endDateTime) {
                                            const updatedDate = new Date(endDateTime);
                                            updatedDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
                                            setEndDateTime(updatedDate);
                                        }
                                    }}
                                />
                            </Grid2>
                        </Grid2>
                    </Grid2>

                    {/* Submit Button */}
                    <Grid2 item xs={12}>
                        <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
                            Submit Shift
                        </Button>
                    </Grid2>
                </Grid2>
            </Paper>
        </Box>
    );
};

export default AddShift;
