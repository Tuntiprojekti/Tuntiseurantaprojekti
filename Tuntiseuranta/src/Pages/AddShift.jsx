import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fi } from 'date-fns/locale';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from '../config/firebase';
import { Button, MenuItem, Select } from "@mui/material";
import { useAuth } from '../context/AuthContext';

const AddShift = () => {
    const [place, setPlace] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [date, setDate] = useState(null);
    const [workplaces, setWorkplaces] = useState([]); // State for workplaces
    const baseSalaryPerHour = 10; 
    const { currentUser } = useAuth();

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
        if (!startTime || !endTime) return 0;
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
                startTime: startTime.toLocaleTimeString('fi-FI'),
                endTime: endTime.toLocaleTimeString('fi-FI'),
                place: place,
                hoursWorked: hoursWorked,
                date: date,
                salary: calculateDailySalary(),
                userId: currentUser.uid
            });
            alert("Shift added successfully!");
            setPlace('');
            setStartTime(null);
            setEndTime(null);
            setDate(null);
        } catch (err) {
            console.error("Error adding document: ", err);
        }
    };

    return (
        <div>
            <p>Add Shift Page</p>
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
                <DatePicker
                    selected={startTime}
                    onChange={(time) => setStartTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Start Time"
                    dateFormat="HH:mm"
                    placeholderText="Select start time"
                    locale={fi}
                />
            </div>
            <div>
                <DatePicker
                    selected={endTime}
                    onChange={(time) => setEndTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="End Time"
                    dateFormat="HH:mm"
                    placeholderText="Select end time"
                    locale={fi}
                />
            </div>
            <div>
                <Button onClick={handleSubmit}>Submit Shift</Button>
            </div>
        </div>
    );
};

export default AddShift;
