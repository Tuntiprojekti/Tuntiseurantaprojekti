import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fi } from 'date-fns/locale';

const AddShift = () => {
    const [shift, setShift] = useState('');
    const [place, setPlace] = useState('');
    const [hoursWorked, setHoursWorked] = useState('');
    const [date, setDate] = useState(null); //datepicker tilamuuttuja
    const baseSalaryPerHour = 10; // 

    const handleShiftChange = (event) => {
        setShift(event.target.value);
    };

    const handlePlaceChange = (event) => {
        setPlace(event.target.value);
    };

    const handleHoursWorkedChange = (event) => {
        setHoursWorked(event.target.value);
    };

    const calculateDailySalary = () => { //pitaa selvittaa tarkasti miten palkkaus menee
        if (!hoursWorked) {
            return 0;
        }
        let multiplier = 1;
        if (shift === 'night') {
            multiplier = 2;
        }
        return baseSalaryPerHour * hoursWorked * multiplier;
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
                    selected={date} // sunnuntai tuplapalkka ? 
                    onChange={(date) => setDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    locale={fi}
                />
            </div>
            <div>
                <p>Selected Shift: {shift}</p>
                <p>Place of Shift: {place}</p>
                <p>Hours Worked: {hoursWorked}</p>
                <p>Selected Date: {date ? date.toLocaleDateString('fi-FI') : ''}</p>
                <p>Daily Salary: €{calculateDailySalary()}</p>
            </div>
        </div>
    );
};

export default AddShift;
