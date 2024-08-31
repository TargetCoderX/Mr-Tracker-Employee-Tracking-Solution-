import Modal from '@/Compponents/modals/Modal';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react';
import DropZoneForm from './Forms/DropZoneForm';
import axios from 'axios';
import Pagination from '@/Compponents/Pagination/Pagination';
import ManuallyAddUsersForm from './Forms/ManuallyAddUsersForm';
import { useDispatch } from 'react-redux';

function UserList({ auth }) {
    const [formType, setformType] = useState("");
    const [userList, setuserList] = useState([]);
    const [roles, setroles] = useState([]);
    const [editUserData, seteditUserData] = useState(null);
    const [formTitle, setformTitle] = useState("");

    useEffect(() => {
        (async () => {
            const response = await axios.get(route("api.get-all-users"));
            setuserList(response.data)
        })();
        (async () => {
            const response = await axios.get(route('api.all-roles'));
            setroles(response.data);
        })()
    }, []);

    const paginationAccepter = async (url) => {
        if (url) {
            const response = await axios.get(url);
            setuserList(response.data)
        }
    }
    const renderForm = () => {
        switch (formType) {
            case 'manualAdder':
                return <ManuallyAddUsersForm userList={setuserList} roles={roles} />;
            case 'dropzone':
                return <DropZoneForm userList={setuserList} />;
            case 'manualAdderEdit':
                return <ManuallyAddUsersForm userList={setuserList} roles={roles} userData={retainKeys(editUserData)} />;
            default:
                return null;
        }
    };
    const retainKeys = (obj) => {
        const keysToKeep = ['id', 'first_name', 'last_name', 'email', 'phone', 'role', 'is_active'];
        let newObj = {};
        Object.entries(obj).filter(([key, value]) => keysToKeep.includes(key)).forEach(([key, value]) => newObj[key] = value);
        return newObj;
    }

    useEffect(() => {
        if (formType !== 'manualAdderEdit') {
            seteditUserData(null);
        }
    }, [formType]);

    const userstatusBadge = (userStatus) => {
        let nameAndColour = {
            name: "",
            class: "",
        }
        if (userStatus == 1) {
            nameAndColour.name = "Active";
            nameAndColour.class = "success";
        }
        if (userStatus == 2) {
            nameAndColour.name = "Resigned";
            nameAndColour.class = "secondary";
        }
        if (userStatus == 3) {
            nameAndColour.name = "Inactive";
            nameAndColour.class = "secondary";
        }
        if (userStatus == 4) {
            nameAndColour.name = "Probation";
            nameAndColour.class = "warning";
        }
        if (userStatus == 5) {
            nameAndColour.name = "Suspended";
            nameAndColour.class = "info";
        }
        if (userStatus == 6) {
            nameAndColour.name = "Terminated";
            nameAndColour.class = "danger";
        }
        if (userStatus == 7) {
            nameAndColour.name = "Retired";
            nameAndColour.class = "secondary";
        }
        if (userStatus == 8) {
            nameAndColour.name = "Contractor";
            nameAndColour.class = "primary";
        }
        return (
            <span className={`badge bg-${nameAndColour.class} rounded-pill w-100 `}>{nameAndColour.name}</span>
        )
    }

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
                                    <button className="btn btn-primary btn-sm me-1" style={{ width: "150px" }} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e) => { setformTitle("For Entering New Users Only"); setformType("manualAdder") }}>Manualy Add Users</button>
                                    <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{ width: "150px" }} onClick={(e) => { setformTitle("Upload CSV File"); setformType("dropzone") }}>Upload CSV</button>
                                </span>
                            </div>
                            <div className="table-responsive pt-3">
                                <table className="table table-striped overflow-y-auto">
                                    <thead>
                                        <tr className='text-center'>
                                            <th> # </th>
                                            <th> Account Id </th>
                                            <th> First name </th>
                                            <th> Last name </th>
                                            <th> Email </th>
                                            <th> Phone </th>
                                            <th> Status </th>
                                            <th> Role </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            userList.data && userList.data.map((user, index) => (
                                                <tr key={index}>
                                                    <td> {index + 1} </td>
                                                    <td className='ellipsis'> {user.account_id}</td>
                                                    <td> {user.first_name} </td>
                                                    <td> {user.last_name} </td>
                                                    <td className='ellipsis'> {user.email} </td>
                                                    <td className='ellipsis'> {user.phone || `_ _`} </td>
                                                    <td>{userstatusBadge(user.is_active)}</td>
                                                    <td><span className={`badge ${user.role_relation !== null && user.role !== 0 ? 'bg-danger' : 'bg-success'} rounded-pill w-100`}>{user.role_relation !== null && user.role !== 0 ? user.role_relation.role_name : 'Administrator'}</span></td>
                                                    <td className='text-center'>
                                                        {
                                                            user.role_relation !== null && (
                                                                <button data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-placement="top" title="Edit User" className="btn btn-icon btn-primary btn-sm m-1" onClick={(e) => { setformType("manualAdderEdit"), seteditUserData(user); setformTitle("Edit this user") }}><i className='fa fa-edit'></i></button>
                                                            )
                                                        }
                                                        <button data-bs-toggle="tooltip" data-bs-placement="top" title="Make Admin" className="btn btn-icon btn-primary btn-sm m-1"><i className='fa fa-user'></i></button>
                                                        <button data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" className="btn btn-icon btn-primary btn-sm m-1"><i className='fa fa-trash'></i></button>
                                                        <button data-bs-toggle="tooltip" data-bs-placement="top" title="Show user information" className="btn btn-icon btn-primary btn-sm m-1"><i className='fa fa-info-circle'></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <Pagination pagination={userList || []} callback={paginationAccepter} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal form={renderForm()} title={formTitle} />
        </Authenticated>
    );
}

export default UserList;
