import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fi } from 'date-fns/locale';
import { addDoc, collection } from "firebase/firestore";
import { db } from '../config/firebase';
import { Button } from "@mui/material";
import { useAuth } from '../context/AuthContext';

const AddShift = () => {
    const [shift, setShift] = useState('');
    const [place, setPlace] = useState('');
    const [hoursWorked, setHoursWorked] = useState('');
    const [date, setDate] = useState(null); // Datepicker state variable
    const baseSalaryPerHour = 10; // Base salary per hour
    const { currentUser } = useAuth();

    const handleShiftChange = (event) => {
        setShift(event.target.value);
    };

    const handlePlaceChange = (event) => {
        setPlace(event.target.value);
    };

    const handleHoursWorkedChange = (event) => {
        setHoursWorked(event.target.value);
    };

    const calculateDailySalary = () => {
        if (!hoursWorked) {
            return 0;
        }
        let multiplier = 1;
        if (shift === 'night') {
            multiplier = 2;
        }
        return baseSalaryPerHour * hoursWorked * multiplier;
    };

    const handleSubmit = async () => {
        if (!currentUser) {
            alert("You must be signed in to add a shift.");
            return;
        }

        try {
            await addDoc(collection(db, "Shifts"), {
                shift: shift,
                place: place,
                hoursWorked: Number(hoursWorked),
                date: date,
                salary: calculateDailySalary(),
                userId: currentUser.uid // Store the user ID
            });
            alert("Shift added successfully!");
            // Reset the form
            setShift('');
            setPlace('');
            setHoursWorked('');
            setDate(null);
        } catch (err) {
            console.error("Error adding document: ", err);
        }
    };

    return (
        <div>
            <p>Add Shift Page</p>
            <div>
                <input
                    type="radio"
                    id="morning"
                    name="shift"
                    value="morning"
                    checked={shift === 'morning'}
                    onChange={handleShiftChange}
                />
                <label htmlFor="morning">Morning Shift</label>
            </div>
            <div>
                <input
                    type="radio"
                    id="day"
                    name="shift"
                    value="day"
                    checked={shift === 'day'}
                    onChange={handleShiftChange}
                />
                <label htmlFor="day">Day Shift</label>
            </div>
            <div>
                <input
                    type="radio"
                    id="night"
                    name="shift"
                    value="night"
                    checked={shift === 'night'}
                    onChange={handleShiftChange}
                />
                <label htmlFor="night">Night Shift</label>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Enter place of shift"
                    value={place}
                    onChange={handlePlaceChange}
                />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Enter hours worked"
                    value={hoursWorked}
                    onChange={handleHoursWorkedChange}
                />
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
                <Button onClick={handleSubmit}>Submit Shift</Button>
            </div>
            
        </div>
    );
};

export default AddShift;
