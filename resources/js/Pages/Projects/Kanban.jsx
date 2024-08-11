import Modal from '@/Compponents/modals/Modal';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react';
import AddGroupForm from './Forms/AddGroupForm';
import Task from './Task';
import AddTaskForm from './Forms/AddTaskForm';

function Kanban({ auth }) {
    const [boards, setboards] = useState([{
        board_name: "Not Started", description: "", "tasks": [
            {
                task_name: "Example Task",
                task_description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi culpa a illum cumque reiciendis! Debitis inventore labore nesciunt enim odio!",
                task_type: 2,
                start_date: "29-07-2024",
                expected_end_date: "30-07-2024",
                expected_total_days: "2 Days"
            }
        ]
    }]);
    const [formType, setformType] = useState("");
    const [formTitle, setformTitle] = useState("");
    const addNewGroup = (newBoards) => {
        setboards([...boards, newBoards]);
    }

    const renderForms = () => {
        switch (formType) {
            case 'addGroupForm':
                return <AddGroupForm submitAction={addNewGroup} />
                break;
            case 'addTaskForm':
                return <AddTaskForm />
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
    return (
        <Authenticated user={auth}>
            <div className="row">
                <div className="col-md-12 text-end">
                    <button className="btn btn-primary btn-sm" onClick={(e) => setformType("addGroupForm")} data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i className="fa fa-plus me-2"></i> Add New Group
                    </button>
                </div>
            </div>
            <div className="d-flex overflow-x-auto">
                {
                    boards && boards.map((element, index) => {
                        return <div className="col-3 m-1">
                            <div className="card" >
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h4 className='text-center mb-0'>{element.board_name}</h4>
                                        <div>
                                            <a onClick={(e) => setformType("addTaskForm")} data-bs-toggle="modal" data-bs-target="#exampleModal" href="#" className='m-1' style={{ textDecoration: "none", "color": "black" }}><i className='fa fa-plus'></i></a>
                                            <a href="#" className='m-1' style={{ textDecoration: "none", "color": "black" }}><i className='fa fa-trash'></i></a>
                                        </div>
                                    </div>

                                    <div className="overflow-y-auto" style={{ height: "60vh" }}>
                                        {
                                            element.tasks && element.tasks.map((task, index) => {

                                                return <Task task={task} />
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
