import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import { toast } from 'react-toastify';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

function HolidayList({ auth }) {
    const { getEvents } = usePage().props;
    const localizer = momentLocalizer(moment)
    const [events, setEvents] = useState([])

    useEffect(() => { setEvents(getEvents) }, [getEvents]);

    /* custom toolbar component for calender */
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

    /* slot selection function */
    const handleSelectSlot = ({ start, end }) => {
        console.log(start,end);
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
                    let newLeaves = [
                        ...events,
                        {
                            title,
                            start: new Date(startDate),
                            end: new Date(endDate),
                        },
                    ]
                    setEvents(newLeaves);
                    createHolidayList(newLeaves);
                } else {
                    swal("Error", "Please fill in all fields!", "error");
                }
            }
        });
    };

    /* create holiday list */
    const createHolidayList = async (listArray) => {
        try {
            const response = await axios.post(route('api.create-holiday-list'), { listArray, year: new Date().getFullYear() });
            if (response.data.status == 1) {
                setEvents(response.data.events);
            } else {
                setEvents(response.data.events);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    // Helper function to format the date for the input field
    const formatDateForInput = (date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 10);
    };

    /* delete button with custom style of event */
    const CustomEvent = ({ event, onDelete }) => {
        return (
            <div className='d-flex justify-content-between'>
                <strong>{event.title}</strong>
                <a onClick={() => onDelete(event)} className='text-danger'> <i className='fa fa-trash'></i> </a>
            </div>
        );
    };

    /* delete event function */
    const handleDeleteEvent = (event) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this event!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const refinedEvents = events.filter(e => e !== event);
                setEvents(refinedEvents);
                createHolidayList(refinedEvents);
                toast.success("Deleted! Your event has been deleted.");
            }
        });
    };

    return (
        <Authenticated user={auth}>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <span className='w-50'>
                                    <h4>Holidays</h4>
                                    <p className="card-description text-dark">Click on a date to manually add a holiday, or import holidays using a CSV file.</p>
                                </span>
                                <span>
                                    {/*   <button className="btn btn-primary btn-sm me-1" style={{ width: "150px" }} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e) => { setformTitle("Apply Leave"), setactionType('add') }}> <i className="fa fa-calendar me-1"></i> Upload CSV</button> */}
                                </span>
                            </div>
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
                                    event: (props) => <CustomEvent {...props} onDelete={handleDeleteEvent} />
                                }}
                                style={{ height: 500 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

export default HolidayList;
