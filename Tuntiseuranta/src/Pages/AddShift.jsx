import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fi } from "date-fns/locale";
import { Link } from "react-router-dom";

const AddShift = () => {
  const [shift, setShift] = useState("");
  const [place, setPlace] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [date, setDate] = useState(null); //datepicker tilamuuttuja
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Jokaisen paikan palkkataso. esimerkit atm
  const baseSalaries = {
    Peijas: 10,
    Meilahti: 12,
    Jorvi: 11,
  };

  // Kovakoodattua testi dataa työvuoroille
  const [shifts, setShifts] = useState([
    {
      shift: "morning",
      place: "Peijas",
      hoursWorked: 8,
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      dailySalary: baseSalaries["Peijas"] * 8,
    },
    {
      shift: "day",
      place: "Meilahti",
      hoursWorked: 8,
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
      dailySalary: baseSalaries["Meilahti"] * 8,
    },
    {
      shift: "night",
      place: "Jorvi",
      hoursWorked: 8,
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 3),
      dailySalary: baseSalaries["Jorvi"] * 8 * 2,
    },
  ]);

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
    //pitaa selvittaa tarkasti miten palkkaus menee
    if (!hoursWorked || !place) {
      return 0;
    }
    let multiplier = 1;
    if (shift === "night") {
      multiplier = 2;
    }
    const baseSalary = baseSalaries[place];
    return baseSalary * hoursWorked * multiplier;
  };

  const isCurrentMonth = (date) => {
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const calculateTotalSalary = () => {
    return shifts
      .filter((shift) => shift.date && isCurrentMonth(shift.date))
      .reduce((total, shift) => total + shift.dailySalary, 0);
  };

  const handleSaveShift = () => {
    const newShift = {
      shift,
      place,
      hoursWorked,
      date,
      dailySalary: calculateDailySalary(),
    };
    setShifts([...shifts, newShift]);
    setShift("");
    setPlace("");
    setHoursWorked("");
    setDate(null);

    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 15000);
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
          checked={shift === "morning"}
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
          checked={shift === "day"}
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
          checked={shift === "night"}
          onChange={handleShiftChange}
        />
        <label htmlFor="night">Night Shift</label>
      </div>
      <div>
        <select value={place} onChange={handlePlaceChange}>
          <option value="">Select place of shift</option>
          <option value="Peijas">Peijas</option>
          <option value="Meilahti">Meilahti</option>
          <option value="Jorvi">Jorvi</option>
        </select>
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
        <button onClick={handleSaveShift}>Save Shift</button>
      </div>
      {showSuccessMessage && (
        <div style={{ color: "green" }}>
          Shift information saved successfully!
        </div>
      )}
      <div>
        <p>Selected Shift: {shift}</p>
        <p>Place of Shift: {place}</p>
        <p>Hours Worked: {hoursWorked}</p>
        <p>Selected Date: {date ? date.toLocaleDateString("fi-FI") : ""}</p>
        <p>Daily Salary: €{calculateDailySalary()}</p>
      </div>
      <div>
        <Link to="/statistics">View Statistics</Link>
      </div>
    </div>
  );
};

export default AddShift;
