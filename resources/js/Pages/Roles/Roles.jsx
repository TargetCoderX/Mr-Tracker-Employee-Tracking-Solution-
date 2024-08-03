import Authenticated from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import swal from 'sweetalert';

function Roles({ auth }) {
    const [roles, setroles] = useState([]);
    const [roleText, setroleText] = useState("");
    const [editedId, seteditedId] = useState("");
    const handleChange = (e) => {
        e.preventDefault();
        setroleText(e.target.value);
    }
    const handleSave = async (e, action) => {
        try {
            const response = await axios.post(route('api.save-roles'), { roleText, action, editedId })
            if (response.data.status === 1) {
                setroles(response.data.roles);
                setroleText("");
                seteditedId(false);
                toast.success(`Role ${action == "new" ? "Added" : "Updated"} Successfully`);
            } else {
                setroleText("");
                seteditedId(false);
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.data.message);
        }
    }

    useEffect(() => {
        (
            async () => {
                const response = await axios.get(route('api.all-roles'))
                setroles(response.data);
            }
        )()
    }, []);

    const deleteRole = (e, role_id) => {
        e.preventDefault();
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const response = await axios.post(route("api.delete-roles"), { role_id })
                        if (response.data.status == 1) {
                            setroles(response.data.roles);
                            toast.success("Deleted Successfully");
                        }
                        else
                            toast.error(response.data.message);
                    } catch (error) {
                        toast.error("Something went wrong");
                    }
                }
            });
    }

    const editRole = (e, role_id, role_name) => {
        e.preventDefault();
        setroleText(role_name)
        seteditedId(role_id)
    }
    return (
        <Authenticated user={auth}>
            <div className="card">
                <div className="card-body">
                    <h4>Roles</h4>
                    <p>Roles Management for your account</p>
                    <div className="row mt-2 mb-2">
                        <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <input type="text" value={roleText} /* onKeyUp={(e) => { e.code == "Enter" ? handleSave(e) : "" }} */ onChange={e => handleChange(e)} placeholder='Enter New Role' className="form-control w-100 me-2" />
                            <button className="btn btn-primary btn-sm btn-md me-1" style={{ width: "100px" }} onClick={(e) => { handleSave(e, "new") }}><i className='fa fa-plus'></i></button>
                            <button disabled={!editedId} className="btn btn-warning btn-sm btn-md" style={{ width: "100px" }} onClick={(e) => { handleSave(e, "edit") }}><i className='fa fa-edit'></i></button>
                        </div>
                    </div>
                    <div>
                        <ul className="list-group">
                            {roles && roles.map((role, index) => (
                                <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                                    <span>{role.role_name}</span>
                                    <span>
                                        <button className="btn btn-primary btn-sm me-1" onClick={(e) => { editRole(e, role.id, role.role_name) }}><i className='fa fa-edit'></i></button>
                                        <button className="btn btn-danger btn-sm" onClick={(e) => { deleteRole(e, role.id) }}><i className='fa fa-trash'></i></button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

export default Roles
