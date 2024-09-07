import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const Statistics = () => {
    const [upcomingShifts, setUpcomingShifts] = useState([]);
    const [pastShifts, setPastShifts] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchShifts = async () => {
            if (!currentUser) {
                return;
            }

            const shiftsCollectionRef = collection(db, "Shifts");
            const q = query(shiftsCollectionRef, where("userId", "==", currentUser.uid));

            try {
                const querySnapshot = await getDocs(q);
                const shiftsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Erota tulevat ja menneet vuorot
                const now = new Date();
                const upcoming = [];
                const past = [];

                shiftsData.forEach(shift => {
                    const shiftDate = new Date(shift.date.seconds * 1000); // Firebase Timestamp -> Date
                    if (shiftDate >= now) {
                        upcoming.push(shift);
                    } else {
                        past.push(shift);
                    }
                });

                setUpcomingShifts(upcoming);
                setPastShifts(past);
            } catch (err) {
                console.error("Error fetching shifts: ", err);
            }
        };

        fetchShifts();
    }, [currentUser]);

    return (
        <div>
            <Typography variant="h4" gutterBottom>Shift Statistics</Typography>

            {/* Upcoming Shifts */}
            <Typography variant="h5" gutterBottom>Upcoming Shifts</Typography>
            {upcomingShifts.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Place</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell>Hours Worked</TableCell>
                                <TableCell>Daily Salary</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {upcomingShifts.map((shift) => (
                                <TableRow key={shift.id}>
                                    <TableCell>{shift.place}</TableCell>
                                    <TableCell>{shift.date ? new Date(shift.date.seconds * 1000).toLocaleDateString('fi-FI') : ''}</TableCell>
                                    <TableCell>{shift.startTime}</TableCell>
                                    <TableCell>{shift.endTime}</TableCell>
                                    <TableCell>{shift.hoursWorked.toFixed(2)}</TableCell>
                                    <TableCell>€{shift.salary.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>No upcoming shifts found.</Typography>
            )}

            {/* Past Shifts */}
            <Typography variant="h5" gutterBottom style={{ marginTop: '40px' }}>Past Shifts</Typography>
            {pastShifts.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Place</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell>Hours Worked</TableCell>
                                <TableCell>Daily Salary</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pastShifts.map((shift) => (
                                <TableRow key={shift.id}>
                                    <TableCell>{shift.place}</TableCell>
                                    <TableCell>{shift.date ? new Date(shift.date.seconds * 1000).toLocaleDateString('fi-FI') : ''}</TableCell>
                                    <TableCell>{shift.startTime}</TableCell>
                                    <TableCell>{shift.endTime}</TableCell>
                                    <TableCell>{shift.hoursWorked.toFixed(2)}</TableCell>
                                    <TableCell>€{shift.salary.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>No past shifts found.</Typography>
            )}
        </div>
    );
};

export default Statistics;
