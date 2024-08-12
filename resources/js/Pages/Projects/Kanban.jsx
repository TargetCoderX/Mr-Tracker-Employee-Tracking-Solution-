import Modal from '@/Compponents/modals/Modal';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react';
import AddGroupForm from './Forms/AddGroupForm';
import Task from './Task';
import AddTaskForm from './Forms/AddTaskForm';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Kanban({ auth }) {
    const { project_boards, project_id, task_types } = usePage().props;
    const [boards, setboards] = useState([]);
    const [accountTaskTypes, setaccountTaskTypes] = useState([]);
    const [formType, setformType] = useState("");
    const [formTitle, setformTitle] = useState("");
    const [selectedBoard, setselectedBoard] = useState("");

    const addNewGroup = async (newBoards) => {
        try {
            newBoards.project_id = project_id;
            const response = await axios.post(route('api.save-board'), newBoards)
            if (response.data.status == 1) {
                setboards([...boards, newBoards]);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("something went wrong");
        }
    }

    const renderForms = () => {
        switch (formType) {
            case 'addGroupForm':
                return <AddGroupForm submitAction={addNewGroup} />
                break;
            case 'addTaskForm':
                return <AddTaskForm submitAction={taskSubmitAction} board_id={selectedBoard} task_types={accountTaskTypes} project_id={project_id} />
                break;

            default:
                break;
        }
    }
    useEffect(() => {
        switch (formType) {
            case 'addGroupForm':
                setformTitle("Add New Group");
                break;
            case 'addTaskForm':
                setformTitle("Add New Task");
                break;
            default:
                setformTitle("");
                break;
        }
    }, [formType]);


    const taskSubmitAction = async (data) => {
        try {
            const response = await axios.post(route('api.save-task'), data);
            if (response.data.status == 1) {
                toast.success(response.data.message);
                setboards(response.data.boards);
                setaccountTaskTypes(response.data.task_types);
            }
            else {
                toast.error(response.data.message);
                setboards(response.data.boards);
                setaccountTaskTypes(response.data.task_types);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    useEffect(() => {
        setboards(project_boards);
        setaccountTaskTypes(task_types);
    }, [project_boards, task_types]);
    return (
        <Authenticated user={auth}>
            <div className="row mb-2">
                <div className="col-md-12 text-end">
                    <button className="btn btn-primary btn-sm" onClick={(e) => setformType("addGroupForm")} data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i className="fa fa-plus me-2"></i> Add New Group
                    </button>
                </div>
            </div>
            <div className="d-flex overflow-x-auto">
                {
                    boards && boards.map((element, index) => {
                        return <div className="col-4 m-1" key={index}>
                            <div className="card" >
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h4 className='text-center mb-0'>{element.board_name}</h4>
                                        <div>
                                            {index === 0 && (
                                                <a onClick={(e) => (setformType("addTaskForm"), setselectedBoard(element.id))} data-bs-toggle="modal" data-bs-target="#exampleModal" href="#" className='m-1' style={{ textDecoration: "none", "color": "black" }}><i className='fa fa-plus'></i></a>
                                            )}
                                            {auth && auth.user.role === 0 && (
                                                <a href="#" className='m-1' style={{ textDecoration: "none", "color": "black" }}><i className='fa fa-trash'></i></a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="overflow-y-auto" style={{ height: "60vh" }}>
                                        {
                                            element.tasks && element.tasks.map((task, index) => {

                                                return <Task task={task} key={index} />
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                    })
                }
            </div>
            <Modal title={formTitle} form={renderForms()} />
        </Authenticated>
    );
}

export default Kanban;
