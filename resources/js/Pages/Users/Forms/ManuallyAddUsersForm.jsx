import React, { useState } from 'react';

function ManuallyAddUsersForm({ userList, roles }) {
    const [formData, setformData] = useState({ first_name: "", last_name: "", email: "", phone: "" });
    return (
        <div>
            <div className="form-group">
                <label htmlFor="">First Name</label>
                <input type="text" placeholder='First Name' className="form-control rounded mb-2" />
                <label htmlFor="">Last Name</label>
                <input type="text" placeholder='Last Name' className="form-control rounded mb-2" />
                <label htmlFor="">Email</label>
                <input type="text" placeholder='Email' className="form-control rounded mb-2" />
                <label htmlFor="">Phone</label>
                <input type="text" placeholder='Phone' className="form-control rounded mb-2" />
                <label htmlFor="">Role</label>
                <select className="form-control rounded mb-2">
                    <option value="" style={{ display: 'none' }}>Select Role</option>
                    {
                        roles && roles.map((role, index) => (
                            <option key={index} value={role.role_name}>{role.role_name}</option>
                        ))
                    }
                </select>
                <div className="text-center mt-2">
                    <button className="btn btn-primary btn-sm w-50"><i className='fa fa-plus me-1'></i>Add user</button>
                </div>
            </div>
        </div>
    );
}

export default ManuallyAddUsersForm;
