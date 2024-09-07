import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fi } from 'date-fns/locale';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from '../config/firebase';
import { Button, MenuItem, Select, Typography } from "@mui/material"; // Lisää Typography
import { useAuth } from '../context/AuthContext';

const AddShift = () => {
    const [place, setPlace] = useState('');
    const [startHour, setStartHour] = useState(null);
    const [startMinute, setStartMinute] = useState(null);
    const [endHour, setEndHour] = useState(null);
    const [endMinute, setEndMinute] = useState(null);
    const [date, setDate] = useState(null);
    const [workplaces, setWorkplaces] = useState([]); // State for workplaces
    const baseSalaryPerHour = 10; 
    const { currentUser } = useAuth(); // Hakee käyttäjän tiedot

    useEffect(() => {
        // Fetch workplaces from Firestore
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
        if (startHour === null || startMinute === null || endHour === null || endMinute === null) return 0;
        const startTime = new Date(date);
        startTime.setHours(startHour, startMinute);

        const endTime = new Date(date);
        endTime.setHours(endHour, endMinute);

        const diff = endTime - startTime;
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

        const hoursWorked = calculateHoursWorked();

        try {
            await addDoc(collection(db, "Shifts"), {
                startTime: `${startHour}:${startMinute < 10 ? `0${startMinute}` : startMinute}`,
                endTime: `${endHour}:${endMinute < 10 ? `0${endMinute}` : endMinute}`,
                place: place,
                hoursWorked: hoursWorked,
                date: date,
                salary: calculateDailySalary(),
                userId: currentUser.uid, // Käyttäjän UID
                userEmail: currentUser.email // Käyttäjän sähköposti
            });
            alert("Shift added successfully!");
            setPlace('');
            setStartHour(null);
            setStartMinute(null);
            setEndHour(null);
            setEndMinute(null);
            setDate(null);
        } catch (err) {
            console.error("Error adding document: ", err);
        }
    };

    const hourOptions = [...Array(24).keys()]; // 0-23 tunnit
    const minuteOptions = [...Array(60).keys()]; // 0-59 minuutit


    return (
        <div>
            <Typography variant="h5">Add Shift Page</Typography>

            {/* Näytä käyttäjän tunnus tai sähköposti */}
            {currentUser && (
                <Typography variant="subtitle1" style={{ marginBottom: '20px' }}>
                    Logged in as: { currentUser.email}
                </Typography>
            )}

            <div>
                <Select
                    value={place}
                    onChange={handlePlaceChange}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="" disabled>Select place of shift</MenuItem>
                    {workplaces.map((workplace, index) => (
                        <MenuItem key={index} value={workplace}>
                            {workplace}
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <div>
                <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    locale={fi}
                />
            </div>
            <div>
                <Typography>Start Time</Typography>
                <Select
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select hour</MenuItem>
                    {hourOptions.map((hour) => (
                        <MenuItem key={hour} value={hour}>
                            {hour < 10 ? `0${hour}` : hour}
                        </MenuItem>
                    ))}
                </Select>

                <Select
                    value={startMinute}
                    onChange={(e) => setStartMinute(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select minute</MenuItem>
                    {minuteOptions.map((minute) => (
                        <MenuItem key={minute} value={minute}>
                            {minute < 10 ? `0${minute}` : minute}
                        </MenuItem>
                    ))}
                </Select>
            </div>

            <div>
                <Typography>End Time</Typography>
                <Select
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select hour</MenuItem>
                    {hourOptions.map((hour) => (
                        <MenuItem key={hour} value={hour}>
                            {hour < 10 ? `0${hour}` : hour}
                        </MenuItem>
                    ))}
                </Select>

                <Select
                    value={endMinute}
                    onChange={(e) => setEndMinute(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select minute</MenuItem>
                    {minuteOptions.map((minute) => (
                        <MenuItem key={minute} value={minute}>
                            {minute < 10 ? `0${minute}` : minute}
                        </MenuItem>
                    ))}
                </Select>
            </div>

            <div>
                <Button onClick={handleSubmit}>Submit Shift</Button>
            </div>
        </div>
    );
};

export default AddShift;
