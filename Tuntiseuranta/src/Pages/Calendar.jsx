import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const Calendar = () => {
    const localizer = momentLocalizer(moment);
    
    const [events, setEvents] = useState([
        {
            title: 'Team Meeting',
            start: new Date(2024, 8, 15, 10, 0),
            end: new Date(2024, 8, 15, 11, 0),
        },
        {
            title: 'Project Deadline',
            start: new Date(2024, 8, 20, 12, 0),
            end: new Date(2024, 8, 20, 14, 0),
        },
    ]);

    return (
        <div style={{ height: '500px', margin: '50px' }}>
            <h1>My Calendar</h1>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                defaultView="week"
            />
        </div>
    );
};

export default Calendar;
