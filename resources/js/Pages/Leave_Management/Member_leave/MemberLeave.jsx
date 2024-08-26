import Modal from '@/Compponents/modals/Modal';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import LeaveRequestForm from '../Forms/LeaveRequestForm';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function MemberLeave({ auth }) {
    const { accountLeaves, requestedLeaves } = usePage().props;
    const [leaves, setleaves] = useState("");
    const [formTitle, setformTitle] = useState("");
    const [actionType, setactionType] = useState("");
    useEffect(() => {
        setleaves(accountLeaves);
    }, [accountLeaves]);

    const submitLeaveApply = async (data) => {
        try {
            data.action = actionType;
            const response = await axios.post(route('api.save-member-leave'), data);
            if (response.data.status == 1) {
                toast.success(response.data.message);
                document.getElementById("modalClose").click();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {

        }
    }

    /* convert date to special format */
    const changeDateFormat = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    return (
        <Authenticated user={auth}>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <span className='w-50'>
                                    <h4>Applied Leaves</h4>
                                    <p className="card-description text-dark">Request time off by selecting the leave type, dates, and reason. Your manager will review and approve your request.</p>
                                </span>
                                <span>
                                    <button className="btn btn-primary btn-sm me-1" style={{ width: "150px" }} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e) => { setformTitle("Apply Leave"), setactionType('add') }}> <i className="fa fa-calendar me-1"></i> Request Leave</button>
                                </span>
                            </div>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Start Date</th>
                                        <th scope="col">End Date</th>
                                        <th scope="col">Leave Type</th>
                                        <th scope="col">Leave Shift</th>
                                        <th scope="col">Reason Of Leave</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requestedLeaves && requestedLeaves.map((leave, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{changeDateFormat(leave.start_date)}</td>
                                            <td>{changeDateFormat(leave.end_date)}</td>
                                            <td>{leave.leave_type.leave_type}</td>
                                            <td>{leave.leave_shift}</td>
                                            <td>{leave.reason_of_leave}</td>
                                            <td>
                                                <span className={`badge ${leave.request_approval.length === 0 ? 'bg-warning' : leave.request_approval.status === 0 ? 'bg-danger' : 'bg-success'} rounded-pill w-100`}>{leave.request_approval.length === 0 ? 'Waiting for Approval' : leave.request_approval.status === 0 ? 'Rejected' : 'Approved'}</span>
                                            </td>
                                            <td>
                                                <a href="" className='me-2 text-dark'><i className='fa fa-edit me-2'></i>Edit</a>
                                                <a href="" className=' text-dark'><i className='fa fa-trash me-2'></i>Delete</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal title={formTitle} form={<LeaveRequestForm accountLeaves={leaves} applyLeave={submitLeaveApply} />} />
        </Authenticated>
    );
}

export default MemberLeave;
