import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Typography, Box, Divider, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField 
} from '@mui/material';

const Statistics = () => {
    const [shiftsByMonth, setShiftsByMonth] = useState({});
    const [selectedMonth, setSelectedMonth] = useState('');
    const [editShift, setEditShift] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchShifts = async () => {
            if (!currentUser) {
                console.error("User not logged in.");
                return;
            }

            try {
                const shiftsCollectionRef = collection(db, "Shifts");
                const q = query(shiftsCollectionRef, where("userId", "==", currentUser.uid));
                const querySnapshot = await getDocs(q);

                const shiftsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    startDateTime: new Date(doc.data().startDateTime),
                    endDateTime: new Date(doc.data().endDateTime),
                }));

                const groupedByMonth = shiftsData.reduce((acc, shift) => {
                    const monthKey = `${shift.startDateTime.getFullYear()}-${String(
                        shift.startDateTime.getMonth() + 1
                    ).padStart(2, '0')}`;
                    if (!acc[monthKey]) {
                        acc[monthKey] = {
                            shifts: [],
                            totalHours: 0,
                            totalIncome: 0,
                        };
                    }

                    const hoursWorked = (shift.endDateTime - shift.startDateTime) / (1000 * 60 * 60);
                    const salary = hoursWorked * (shift.hourlyRate || 10);

                    acc[monthKey].shifts.push(shift);
                    acc[monthKey].totalHours += hoursWorked;
                    acc[monthKey].totalIncome += salary;

                    return acc;
                }, {});

                setShiftsByMonth(groupedByMonth);

                // Automatically set the first available month as selected
                if (Object.keys(groupedByMonth).length > 0) {
                    setSelectedMonth(Object.keys(groupedByMonth)[0]);
                }
            } catch (err) {
                console.error("Error fetching shifts: ", err);
            }
        };

        fetchShifts();
    }, [currentUser]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "Shifts", id));
            setShiftsByMonth((prev) => {
                const updated = { ...prev };
                updated[selectedMonth].shifts = updated[selectedMonth].shifts.filter((shift) => shift.id !== id);
                return updated;
            });
            alert("Shift deleted successfully.");
        } catch (err) {
            console.error("Error deleting shift: ", err);
        }
    };

    const openEditDialog = (shift) => {
        setEditShift(shift);
    };

    const closeEditDialog = () => {
        setEditShift(null);
    };

    const handleEditSubmit = async () => {
        try {
            const updatedShift = {
                ...editShift,
                startDateTime: new Date(editShift.startDateTime),
                endDateTime: new Date(editShift.endDateTime),
            };

            await updateDoc(doc(db, "Shifts", editShift.id), updatedShift);

            setShiftsByMonth((prev) => {
                const updated = { ...prev };
                const shiftIndex = updated[selectedMonth].shifts.findIndex((shift) => shift.id === editShift.id);
                updated[selectedMonth].shifts[shiftIndex] = updatedShift;
                return updated;
            });

            closeEditDialog();
            alert("Shift updated successfully.");
        } catch (err) {
            console.error("Error updating shift: ", err);
        }
    };

    return (
        <Box sx={{ p: 3, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Shift Statistics
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Month Dropdown */}
            {Object.keys(shiftsByMonth).length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Select Month</Typography>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        fullWidth
                        variant="outlined"
                    >
                        {Object.keys(shiftsByMonth).map((month) => (
                            <MenuItem key={month} value={month}>
                                {new Date(month.split('-')[0], month.split('-')[1] - 1).toLocaleString('default', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            )}

            {/* Monthly Data */}
            {selectedMonth && shiftsByMonth[selectedMonth] ? (
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h5" gutterBottom>
                        {new Date(selectedMonth.split('-')[0], selectedMonth.split('-')[1] - 1).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#f1f1f1" }}>
                                <TableRow>
                                    <TableCell>Place</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>Start Time</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>End Time</TableCell>
                                    <TableCell>Hours Worked</TableCell>
                                    <TableCell>Daily Salary (€)</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shiftsByMonth[selectedMonth].shifts.map((shift) => (
                                    <TableRow key={shift.id}>
                                        <TableCell>{shift.place}</TableCell>
                                        <TableCell>{shift.startDateTime.toLocaleDateString('fi-FI')}</TableCell>
                                        <TableCell>{shift.startDateTime.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                        <TableCell>{shift.endDateTime.toLocaleDateString('fi-FI')}</TableCell>
                                        <TableCell>{shift.endDateTime.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                        <TableCell>{((shift.endDateTime - shift.startDateTime) / (1000 * 60 * 60)).toFixed(2)}</TableCell>
                                        <TableCell>€{((shift.endDateTime - shift.startDateTime) / (1000 * 60 * 60) * (shift.hourlyRate || 10)).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => openEditDialog(shift)} variant="outlined" size="small" color="primary">
                                                Edit
                                            </Button>
                                            <Button onClick={() => handleDelete(shift.id)} variant="outlined" size="small" color="secondary" sx={{ ml: 1 }}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={6} align="right" sx={{ fontWeight: 'bold' }}>
                                        Total
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        {shiftsByMonth[selectedMonth].totalHours.toFixed(2)}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        €{shiftsByMonth[selectedMonth].totalIncome.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ) : (
                <Typography>No data available for the selected month.</Typography>
            )}

            {/* Edit Dialog */}
            {editShift && (
                <Dialog open={!!editShift} onClose={closeEditDialog}>
                    <DialogTitle>Edit Shift</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Place"
                            fullWidth
                            value={editShift.place}
                            onChange={(e) => setEditShift({ ...editShift, place: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            fullWidth
                            value={editShift.startDateTime.toISOString().slice(0, 16)}
                            onChange={(e) =>
                                setEditShift({ ...editShift, startDateTime: new Date(e.target.value) })
                            }
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="End Date"
                            type="datetime-local"
                            fullWidth
                            value={editShift.endDateTime.toISOString().slice(0, 16)}
                            onChange={(e) =>
                                setEditShift({ ...editShift, endDateTime: new Date(e.target.value) })
                            }
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeEditDialog} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleEditSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default Statistics;
