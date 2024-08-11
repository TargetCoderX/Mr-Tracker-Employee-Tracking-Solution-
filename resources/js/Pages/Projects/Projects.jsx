import Authenticated from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Projects({ auth }) {
    const [getallProjects, setgetallProjects] = useState([]);
    const getAllroles = async () => {
        try {
            const response = await axios.get(route('api.get-all-projects'));
            if (response.data.status == 1) {
                setgetallProjects(response.data.projects);
            } else {
                setgetallProjects([]);
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Something Went Wrong");
        }
    }
    useEffect(() => {
        getAllroles();
    }, []);
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
                                            <th> Project Manager </th>
                                            <th> Project Start Date </th>
                                            <th> Project End Date </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getallProjects && getallProjects.length > 0 ? (
                                            getallProjects.map((element, index) => (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{element.project_name}</td>
                                                    <td>{element.project_creation_date}</td>
                                                    <td>{element.project_deadline}</td>
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
        </Authenticated>
    );
}

export default Projects;
