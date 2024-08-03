import Modal from '@/Compponents/modals/Modal';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import AddGroupForm from './Forms/AddGroupForm';
import Task from './Task';

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
    const addNewGroup = (newBoards) => {
        setboards([...boards, newBoards]);
    }
    return (
        <Authenticated user={auth}>
            <div className="row">
                <div className="col-md-12 text-end">
                    <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i className="fa fa-plus me-2"></i> Add New Group
                    </button>
                </div>
            </div>
            <div className="d-flex overflow-x-auto">
                {
                    boards && boards.map((element, index) => {
                        return <div className="col-4 m-1">
                            <div className="card" >
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h4 className='text-center mb-0'>{element.board_name}</h4>
                                        <div>
                                            <a href="#" className='m-1' style={{ textDecoration: "none", "color": "black" }}><i className='fa fa-plus'></i></a>
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
            <Modal title="Add New Group" form={<AddGroupForm submitAction={addNewGroup} />} />
        </Authenticated>
    );
}

export default Kanban;
