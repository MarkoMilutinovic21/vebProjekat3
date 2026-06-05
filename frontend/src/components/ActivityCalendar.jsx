import { useState } from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

function ActivityCalendar({ activities }) {
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');

    const events = activities?.map(a => ({
        title: `${a.name} (${a.status})`,
        start: new Date(a.date),
        end: new Date(a.date),
        resource: a
    })) || [];

    return (
        <div style={{ height: 500, marginBottom: "20px" }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                defaultView="month"
                views={['month', 'week', 'agenda']}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                view={view}
                onView={(newView) => setView(newView)}
            />
        </div>
    );
}

export default ActivityCalendar;