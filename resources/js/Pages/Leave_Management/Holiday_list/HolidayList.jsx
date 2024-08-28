import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Authenticated from '@/Layouts/AuthenticatedLayout';

function HolidayList({ auth }) {
    const localizer = momentLocalizer(moment)

    return (
        <Authenticated user={auth}>
            <Calendar
                localizer={localizer}
                events={[
                    {
                        id: 1,
                        title: "Republic Day",
                        start: '2024-08-15',
                        end: '2024-08-15',
                        color: '#ff0000'
                    }
                ]}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </Authenticated>
    );
}

export default HolidayList;
