import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import swal from 'sweetalert';

function HolidayList({ auth }) {
    const localizer = momentLocalizer(moment)
    const [events, setEvents] = useState([])
    const CustomToolbar = (toolbar) => {
        const goToBack = () => {
            toolbar.onNavigate('PREV');
        };

        const goToNext = () => {
            toolbar.onNavigate('NEXT');
        };

        const goToToday = () => {
            toolbar.onNavigate('TODAY');
        };

        return (
            <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                    <button type="button" onClick={goToBack}>
                        Back
                    </button>
                    <button type="button" onClick={goToToday}>
                        Today
                    </button>
                    <button type="button" onClick={goToNext}>
                        Next
                    </button>
                </span>
                <span className="rbc-toolbar-label">{toolbar.label}</span>
            </div>
        );
    };

    const handleSelectSlot = ({ start, end }) => {
        swal({
            title: "Create a new event",
            content: {
                element: "div",
                attributes: {
                    innerHTML: `
          <form id="event-form">
            <label class="form-label">Event Title:</label>
            <input type="text" id="event-title" placeholder="Enter event title" class="form-control mb-2" />
            <label class="form-label">Start Date:</label>
            <input type="date" id="start-date" class="form-control mb-2" value="${formatDateForInput(start)}" />
            <label class="form-label">End Date:</label>
            <input type="date" id="end-date" class="form-control mb-2" value="${formatDateForInput(start)}" />
          </form>
        `,
                },
            },
            buttons: true,
        }).then((value) => {
            if (value) {
                const title = document.getElementById('event-title').value;
                const startDate = document.getElementById('start-date').value;
                const endDate = document.getElementById('end-date').value;

                if (title && startDate && endDate) {
                    setEvents([
                        ...events,
                        {
                            title,
                            start: new Date(startDate),
                            end: new Date(endDate),
                        },
                    ]);
                } else {
                    swal("Error", "Please fill in all fields!", "error");
                }
            }
        });
    };

    // Helper function to format the date for the input field
    const formatDateForInput = (date) => {
        return date.toISOString().slice(0, 10);
    };

    return (
        <Authenticated user={auth}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable={true}
                onSelectSlot={handleSelectSlot}
                // toolbar={false}
                components={{
                    toolbar: CustomToolbar, // Use the custom toolbar
                }}
            // style={{ height: 500 }}
            />
        </Authenticated>
    );
}

export default HolidayList;
