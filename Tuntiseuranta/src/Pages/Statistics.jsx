import React from "react";
import { useOutletContext } from "react-router-dom";

const Statistics = () => {
  const { shifts } = useOutletContext();

  if (!shifts) {
    return <p>No shifts data available.</p>;
  }

  const calculateTotalSalary = () => {
    const isCurrentMonth = (date) => {
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    };

    return shifts
      .filter((shift) => shift.date && isCurrentMonth(shift.date))
      .reduce((total, shift) => total + shift.dailySalary, 0);
  };

  return (
    <div>
      <h2>Saved Shifts</h2>
      <ul>
        {shifts.map((shift, index) => (
          <li key={index}>
            {shift.date ? shift.date.toLocaleDateString("fi-FI") : ""} -{" "}
            {shift.shift} shift at {shift.place}, Hours Worked:{" "}
            {shift.hoursWorked}, Daily Salary: €{shift.dailySalary}
          </li>
        ))}
      </ul>
      <div>
        <h2>Total Salary for Current Month</h2>
        <p>€{calculateTotalSalary()}</p>
      </div>
    </div>
  );
};

export default Statistics;
