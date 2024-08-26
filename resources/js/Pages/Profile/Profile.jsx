import Authenticated from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Profile({ auth }) {
    const { leavesAccount } = usePage().props;
    const [Leaves, setLeaves] = useState([{ "id": "", "leave_name": "", "amount": 0 }]);

    useEffect(() => {
        setLeaves(leavesAccount);
    }, [leavesAccount]);

    const addNewLeave = (e) => {
        e.preventDefault();
        setLeaves([...Leaves, { "id": "", "leave_name": "", "amount": 0 }])
    }

    const changeHandlerLeave = (e, index) => {
        e.preventDefault();
        const updatedLeaveTypes = [...Leaves];
        updatedLeaveTypes[index][e.target.name] = event.target.value;
        setLeaves(updatedLeaveTypes);
    }
    const submitAccountProfileForm = async (e) => {
        e.preventDefault();
        try {
            const data = {
                leaves: Leaves,
            }
            const response = await axios.post(route('api.save-account-profile'), data);
            if (response.data.status == 1) {
                toast.success(response.data.message);
                setLeaves(response.data.leaves);
            }
            else
                toast.error(response.data.message);
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    const deleteLeave = (e, index) => {
        const updatedLeaveTypes = [...Leaves];
        updatedLeaveTypes.splice(index, 1);
        setLeaves(updatedLeaveTypes);
    }

    return (
        <Authenticated user={auth}>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <span className='w-50'>
                                    <h4>Account Profile</h4>
                                    <p className="card-description text-dark">Configure and manage organizational settings and employee leave types.</p>
                                </span>
                            </div>
                            <form id='account_profile' name='account_profile' onSubmit={(e) => { submitAccountProfileForm(e) }}>
                                <div className="row">
                                    <div className="col-md-6 border-right">
                                        <div className="p-3 py-2">
                                            <div className="mb-2">
                                                <label htmlFor="" className="labels">Account Name</label>
                                                <input type="text" placeholder='Account Name' className="form-control" />
                                            </div>
                                            <div className="mb-2">
                                                <label htmlFor="" className="labels">Account Number</label>
                                                <input type="text" placeholder='Account Number' className="form-control" />
                                            </div>
                                            <div className="mb-2">
                                                <label htmlFor="" className="labels">Company Name</label>
                                                <input type="text" placeholder='Company Name' className="form-control" />
                                            </div>
                                            <div className="mb-2">
                                                <label htmlFor="" className="labels">Country</label>
                                                <select className="form-control" name="" id="">
                                                    <option value="">Select Country</option>
                                                </select>
                                            </div>
                                            <div className="mb-2">
                                                <label htmlFor="" className="labels">State</label>
                                                <select className="form-control" name="" id="">
                                                    <option value="">Select State</option>
                                                </select>
                                            </div>
                                            <div className="mb-2">
                                                <label htmlFor="" className="labels">City</label>
                                                <select className="form-control" name="" id="">
                                                    <option value="">Select City</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 border-right">
                                        <div className="mb-2">
                                            <label htmlFor="" className="labels">Address</label>
                                            <input type="text" placeholder='Address' className="form-control" />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="" className="labels">Pin Code</label>
                                            <input type="text" placeholder='Pin Code' className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-md-12 border-right">
                                        <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                                            <span>
                                                <h5 className="mb-0">Leave Management</h5>
                                                <p>Add Leave types and amount accroading to your account.</p>
                                            </span>
                                            <button className="btn btn-primary btn-sm" onClick={(e) => { addNewLeave(e) }}>
                                                <i className='fa fa-plus me-1'></i>
                                            </button>
                                        </div>

                                        {
                                            Leaves && Leaves.map((leave, index) => (
                                                <div key={index}>
                                                    <div className="row align-items-center mb-2">
                                                        <div className="col-md-6">
                                                            <div className="mb-2">
                                                                <label htmlFor="" className="labels">Leave Type Name</label>
                                                                <input type="text" name='leave_name' value={leave.leave_name} onChange={(e) => { changeHandlerLeave(e, index) }} placeholder='Leave Type Name' className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="mb-2">
                                                                <label htmlFor="" className="labels">Leave Type Amount</label>
                                                                <input type="number" name='amount' value={leave.amount} onChange={(e) => { changeHandlerLeave(e, index) }} placeholder='Leave Type Amount' className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2 d-flex align-items-end justify-content-center">
                                                            <button onClick={(e) => { deleteLeave(e, index) }} className="btn btn-danger btn-sm mt-4 mt-md-0"><i className='fa fa-trash'></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </form>
                            <div className="row mt-2">
                                <div className="col-md-12 text-center">
                                    <button form='account_profile' type='submit' className="btn btn-primary">Update Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated >
    );
}

export default Profile;
