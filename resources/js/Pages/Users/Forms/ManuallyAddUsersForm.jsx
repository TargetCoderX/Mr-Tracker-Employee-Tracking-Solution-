import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '@/redux/actionTypes/actionTypes';

function ManuallyAddUsersForm({ userList, roles, userData = null }) {
    const [formData, setformData] = useState("");
    const dispatch = useDispatch();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({ ...formData, [name]: value });
    }
    const submitForm = async (e) => {
        e.preventDefault();
        dispatch(showLoader())
        let response;
        if (userData === null)
            response = await axios.post(route('api.manually-save-users'), formData);
        else
            response = await axios.patch(route('api.update-user'), formData);
        if (response.data.status == 1) {
            document.getElementById("modalClose").click();
            toast.success(response.data.message)
            userList(response.data.users);
        }
        else {
            toast.error(response.data.message)
        }
        dispatch(hideLoader())
    }
    useEffect(() => {
        if (userData !== null)
            setformData(userData);
        else
            setformData({ first_name: "", last_name: "", email: "", phone: "", role: "" });
    }, [userData]);
    return (
        <form onSubmit={(e) => { submitForm(e) }}>
            <div className="form-group">
                <label htmlFor="">First Name</label>
                <input required value={formData && formData.first_name} name='first_name' onChange={(e) => { handleChange(e) }} type="text" placeholder='First Name' className="form-control rounded mb-2" />
                <label htmlFor="">Last Name</label>
                <input required value={formData && formData.last_name} name='last_name' onChange={(e) => { handleChange(e) }} type="text" placeholder='Last Name' className="form-control rounded mb-2" />
                <label htmlFor="">Email</label>
                <input required value={formData && formData.email} name='email' onChange={(e) => { handleChange(e) }} type="email" placeholder='Email' className="form-control rounded mb-2" />
                <label htmlFor="">Phone</label>
                <input required value={formData && formData.phone} name='phone' onChange={(e) => { handleChange(e) }} type="text" placeholder='Phone' className="form-control rounded mb-2" />
                <label htmlFor="">Role</label>
                <select required className="form-control text-dark rounded mb-2" value={formData && formData.role} name='role' onChange={(e) => { handleChange(e) }}>
                    <option value="" style={{ display: 'none' }}>Select Role</option>
                    {
                        roles && roles.map((role, index) => (
                            <option key={index} value={role.id}>{role.role_name}</option>
                        ))
                    }
                </select>
                {
                    userData !== null && (
                        <>
                            <label htmlFor="">Status</label>
                            <select name="is_active" id="is_active" className="form-control text-dark" value={formData && formData.is_active} onChange={(e) => { handleChange(e) }}>
                                <option value="" style={{ display: 'none' }}>Select Status</option>
                                <option value="1">Active</option>
                                <option value="2">Resigned</option>
                                <option value="3">Inactive</option>
                                <option value="4">Probation</option>
                                <option value="5">Suspended</option>
                                <option value="6">Terminated</option>
                                <option value="7">Retired</option>
                                <option value="8">Contractor</option>
                            </select>
                        </>
                    )
                }
                <div className="text-center mt-2">
                    <button type='submit' className="btn btn-primary btn-sm w-50">
                        {
                            userData !== null ? (
                                <>
                                    <i className='fa fa-edit me-1'></i>Edit user
                                </>
                            ) : (
                                <>
                                    <i className='fa fa-plus me-1'></i>Add user
                                </>
                            )
                        }
                    </button>
                </div>
            </div>
        </form >
    );
}

export default ManuallyAddUsersForm;
