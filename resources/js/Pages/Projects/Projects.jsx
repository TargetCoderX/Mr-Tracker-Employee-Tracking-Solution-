import Modal from '@/Compponents/modals/Modal';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AddProjectForm from './Forms/AddProjectForm';
import { Link } from '@inertiajs/react';
import swal from 'sweetalert';

function Projects({ auth }) {
    const [getallProjects, setgetallProjects] = useState([]);
    const [users, setusers] = useState([]);

    const getAllProjectsFun = async () => {
        try {
            const response = await axios.get(route('api.get-all-projects'));
            if (response.data.status == 1) {
                setgetallProjects(response.data.projects);
                refineUsers(response.data.users)
            } else {
                setgetallProjects([]);
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Something Went Wrong");
        }
    }
    useEffect(() => {
        getAllProjectsFun();
    }, []);

    const formSubmitCallback = async (data) => {
        try {
            const response = await axios.post(route('api.save-project'), data);
            if (response.data.status == 1) {
                setgetallProjects(response.data.projects.original.projects);
                refineUsers(response.data.projects.original.users)
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    const refineUsers = (users) => {
        const refinedUsers = users.map((user) => {
            return {
                "label": user.first_name + ' ' + user.last_name,
                "value": user.id,
            }
        })
        setusers(refinedUsers);
    }

    const deleteProject = (e, project_id) => {
        e.preventDefault();
        swal({
            title: "Are you sure?",
            text: "Once deletedproject, all the task assigned with this project will be deleted",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const response = await axios.post(route('api.delete-project'), { project_id });
                        if (response.data.status == 1)
                            toast.success(response.data.message);
                        else
                            toast.error(response.data.message);
                        getAllProjectsFun();
                    } catch (error) {
                        console.log(error);
                        toast.error("Something went wrong");
                    }
                }
            });
    }
    return (
        <Authenticated user={auth}>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>
                                    <h4>Projects</h4>
                                    <p className="card-description text-dark">List of projects assigned to you</p>
                                </span>
                                <span>
                                    <button className="btn btn-primary btn-sm me-1" style={{ width: "150px" }} data-bs-toggle="modal" data-bs-target="#exampleModal">Add New Projects</button>
                                </span>
                            </div>
                            <div className="table-responsive pt-3">
                                <table className="table table-striped overflow-y-auto">
                                    <thead>
                                        <tr className='text-center'>
                                            <th> # </th>
                                            <th> Project Name </th>
                                            <th> Project Start Date </th>
                                            <th> Project End Date </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getallProjects && getallProjects.length > 0 ? (
                                            getallProjects.map((element, index) => (
                                                <tr key={index} className='text-center'>
                                                    <td>{index + 1}</td>
                                                    <td>{element.project_name}</td>
                                                    <td>{element.project_creation_date}</td>
                                                    <td>{element.project_deadline}</td>
                                                    <td>
                                                        <Link className="btn btn-primary btn-sm me-1" href={route('kanban-board', { project_id: element.project_id })} style={{ width: '150px' }}> <i className='fa fa-eye me-1'></i> View Tasks</Link>
                                                        <button onClick={(e) => { deleteProject(e, element.project_id) }} className="btn btn-danger btn-sm" style={{ width: '150px' }}> <i className='fa fa-trash me-1'></i>Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className='text-center'>No Project Assigned to you</td>
                                            </tr>
                                        )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal form={<AddProjectForm submitAction={formSubmitCallback} users={users} />} title={"Add Project"} />
        </Authenticated >
    );
}

export default Projects;
