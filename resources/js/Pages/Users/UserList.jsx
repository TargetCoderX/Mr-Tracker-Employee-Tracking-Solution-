import Modal from '@/Compponents/modals/Modal';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react';
import DropZoneForm from './Forms/DropZoneForm';
import axios from 'axios';

function UserList({ auth }) {
    const [formType, setformType] = useState(null);
    const [userList, setuserList] = useState([]);
    useEffect(() => {
        (async () => {
            const response = await axios.get(route("api.get-all-users"));
            setuserList(response.data)
        })();
    }, []);
    return (
        <Authenticated user={auth}>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <h4>Users</h4>
                                    <p className="card-description text-dark">Users registered to your account.</p>
                                </span>
                                <span>
                                    <button className="btn btn-primary btn-sm me-1" style={{ width: "150px" }}>Manualy Add Users</button>
                                    <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{ width: "150px" }} onClick={(e) => { setformType("dropzone") }}>Upload CSV</button>
                                </span>
                            </div>
                            <div className="table-responsive pt-3">
                                <table className="table table-striped">
                                    <thead>
                                        <tr className='text-center'>
                                            <th> # </th>
                                            <th> Account Id </th>
                                            <th> First name </th>
                                            <th> Last name </th>
                                            <th> Email </th>
                                            <th> Status </th>
                                            <th> Role </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            userList && userList.map((user, index) => (
                                                <tr>
                                                    <td> {index + 1} </td>
                                                    <td> {user.account_id}</td>
                                                    <td> {user.first_name} </td>
                                                    <td> {user.last_name} </td>
                                                    <td> {user.email} </td>
                                                    <td><span className="badge bg-success rounded-pill">Active</span></td>
                                                    <td><span className="badge bg-danger rounded-pill">Team Lead</span></td>
                                                    <td className='text-center'>
                                                        <button className="btn btn-icon btn-primary btn-sm m-1"><i className='fa fa-edit'></i></button>
                                                        <button className="btn btn-icon btn-primary btn-sm m-1"><i className='fa fa-user'></i></button>
                                                        <button className="btn btn-icon btn-primary btn-sm m-1"><i className='fa fa-trash'></i></button>
                                                        <button className="btn btn-icon btn-primary btn-sm m-1"><i className='fa fa-info-circle'></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal form={formType == "dropzone" ? <DropZoneForm userList={setuserList} /> : ""} title="For Entering New Users Only" />
        </Authenticated>
    );
}

export default UserList;
