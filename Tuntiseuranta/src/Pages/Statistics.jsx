import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const Statistics = () => {
    const [shifts, setShifts] = useState([]);
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
                setShifts(shiftsData);
            } catch (err) {
                console.error("Error fetching shifts: ", err);
            }
        };

        fetchShifts();
    }, [currentUser]);

    return (
        <div>
            <p>Stats Page</p>
            {shifts.length > 0 ? (
                <div>
                    {shifts.map((shift) => (
                        <div key={shift.id}>
                            <p>Shift: {shift.shift}</p>
                            <p>Place: {shift.place}</p>
                            <p>Hours Worked: {shift.hoursWorked}</p>
                            <p>Date: {shift.date ? new Date(shift.date.seconds * 1000).toLocaleDateString('fi-FI') : ''}</p>
                            <p>Daily Salary: €{shift.salary}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No shifts found.</p>
            )}
        </div>
    );
};

export default Statistics;
