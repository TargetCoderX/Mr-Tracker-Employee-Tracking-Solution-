import Authenticated from '@/Layouts/AuthenticatedLayout';
import React from 'react';

function MemberLeave({ auth }) {
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
                                    <button className="btn btn-primary btn-sm me-1" style={{ width: "150px" }} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e) => { /* setformType("manualAdder") */ }}> <i className="fa fa-calendar me-1"></i> Request Leave</button>
                                </span>
                            </div>
                            <table class="table table-striped">
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
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                        <td>@mdo</td>
                                        <td>@mdo</td>
                                        <td>
                                        <span class="badge bg-danger rounded-pill">Danger</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </Authenticated>
    );
}

export default MemberLeave;
