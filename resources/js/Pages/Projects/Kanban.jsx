import Modal from '@/Compponents/modals/Modal';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react';
import AddGroupForm from './Forms/AddGroupForm';
import Task from './Task';
import AddTaskForm from './Forms/AddTaskForm';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import ProjectUsersList from './Forms/ProjectUsersList';

function Kanban({ auth }) {
    const { project_boards, project_id, task_types, assigned_users, all_users } = usePage().props;
    const [boards, setboards] = useState([]);
    const [accountTaskTypes, setaccountTaskTypes] = useState([]);
    const [formType, setformType] = useState("");
    const [formTitle, setformTitle] = useState("");
    const [selectedBoard, setselectedBoard] = useState("");
    const [assignedUsers, setassignedUsers] = useState("");
    const [allUsers, setallUsers] = useState([]);
    const [taskData, settaskData] = useState(null);

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
                return <AddTaskForm
                    users={assignedUsers}
                    submitAction={taskSubmitAction}
                    board_id={selectedBoard}
                    task_types={accountTaskTypes}
                    project_id={project_id}
                    is_edit={false}
                    task_data={null}
                />
                break;
            case 'editTaskForm':
                return <AddTaskForm
                    users={assignedUsers}
                    submitAction={taskSubmitAction}
                    board_id={selectedBoard}
                    task_types={accountTaskTypes}
                    project_id={project_id}
                    is_edit={true}
                    task_data={taskData}
                />
                break;
            case 'showUserList':
                return <ProjectUsersList action_handler={userActionHandler} users={assignedUsers} all_users={all_users} />
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
            case 'showUserList':
                setformTitle("User List");
                break;
            case 'editTaskForm':
                setformTitle("Edit Task");
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
                setassignedUsers(response.data.assigned_users)
                setallUsers(response.data.allUsers);
            }
            else {
                toast.error(response.data.message);
                setboards(response.data.boards);
                setaccountTaskTypes(response.data.task_types);
                setassignedUsers(response.data.assigned_users)
                setallUsers(response.data.allUsers);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    useEffect(() => {
        setboards(project_boards);
        setaccountTaskTypes(task_types);
        setassignedUsers(assigned_users);
        setallUsers(all_users);
    }, [project_boards, task_types, assigned_users]);

    /* kanban coading */
    const onDragStart = (e, taskId, sourceColumnId) => {
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.setData('sourceColumnId', sourceColumnId);
    };

    const onDrop = (e, targetColumnId) => {
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
        if (sourceColumnId == targetColumnId) { return; }

        const sourceColumn = boards.find(column => column.id == sourceColumnId);
        const targetColumn = boards.find(column => column.id == targetColumnId);
        const task = sourceColumn.tasks.find(task => task.id == taskId);
        const updatedSourceTasks = sourceColumn.tasks.filter(task => task.id != taskId);
        const updatedTargetTasks = [...targetColumn.tasks, task];
        const updatedColumns = boards.map(column => {
            if (column.id == sourceColumnId) {
                return { ...column, tasks: updatedSourceTasks };
            } else if (column.id == targetColumnId) {
                return { ...column, tasks: updatedTargetTasks };
            }
            return column;
        });
        setboards(updatedColumns);
        updateTaskBoard(taskId, targetColumnId)
    };

    const updateTaskBoard = async (task_id, board_id) => {
        try {
            const response = await axios.put(route('api.update-task-board'), { task_id, board_id });
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const deleteBoard = (e, board_id) => {
        swal({
            title: "Are you sure?",
            text: "If you delete this board all the task in this board ill be deleted, You cannot recover those tasks any more, Take caution before proceeding",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const response = await axios.put(route('api.delete-board'), { board_id });
                        if (response.data.status == 1) {
                            setboards(response.data.project_boards);
                            setaccountTaskTypes(response.data.task_types);
                            setassignedUsers(response.data.assigned_users);
                            setallUsers(response.data.all_users);
                        }
                    } catch (error) {
                        toast.error('something went wrong');
                    }

                }
            });
    }

    const deleteTask = async (task_id) => {
        try {
            swal({
                title: "Are you sure?",
                text: "Once deleted, tou cannot recover this task, Take caution before deleting",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    if (willDelete) {
                        const response = await axios.post(route('api.delete-task'), { task_id, project_id })
                        if (response.data.status == 1) {
                            toast.success(response.data.message);
                            setboards(response.data.project_boards);
                            setaccountTaskTypes(response.data.task_types);
                            setassignedUsers(response.data.assigned_users);
                            setallUsers(response.data.all_users);
                        } else {
                            toast.error(response.data.message);
                        }
                    }
                });
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    /* user action handler of project */
    const userActionHandler = async (user_id, action) => {
        try {
            let response = "";
            if (action === 'add')
                response = await axios.post(route('api.add-users-project'), { project_id, user_id });
            if (action === 'remove')
                response = await axios.post(route('api.remove-users-project'), { project_id, user_id });
            if (response.data.status == 1)
                toast.success(response.data.message);
            else
                toast.error(response.data.message);
            setassignedUsers(response.data.assigned_users);
            setallUsers(response.data.all_users);
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    const edit_task = (taskData) => {
        setformType("editTaskForm");
        settaskData(taskData);
    }

    /* update task timer */
    const updateTaskTimer = async (data) => {
        try {
            data.project_id = project_id;
            const response = await axios.post(route('api.update-task-timer'), data);
            if (response.data.status == 1)
                toast.success(response.data.message);
            else
                toast.error(response.data.message);
            setboards(response.data.project_boards);
            setaccountTaskTypes(response.data.task_types);
            setassignedUsers(response.data.assigned_users);
            setallUsers(response.data.all_users);
            return response.data.status;
        } catch (error) {
            return 0;
        }
    }
    return (
        <Authenticated user={auth}>
            <div className="row mb-2">
                <div className="col-md-12 text-end">
                    <button className="btn btn-primary btn-sm me-2" style={{ width: "170px" }} onClick={(e) => setformType("showUserList")} data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i className="fa fa-users me-2"></i> User List
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ width: "170px" }} onClick={(e) => setformType("addGroupForm")} data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i className="fa fa-plus me-2"></i> Add New Group
                    </button>
                </div>
            </div>
            <div className="d-flex overflow-x-auto">
                {
                    boards && boards.map((element, index) => {
                        return <div className="col-4 m-1" key={index} onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, element.id)}>
                            <div className="card" >
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h4 className='text-center mb-0'>{element.board_name}</h4>
                                        <div>
                                            {index === 0 && (
                                                <a onClick={(e) => (setformType("addTaskForm"), setselectedBoard(element.id))} data-bs-toggle="modal" data-bs-target="#exampleModal" href="#" className='m-1' style={{ textDecoration: "none", "color": "black" }}><i className='fa fa-plus'></i></a>
                                            )}
                                            {auth && auth.user.role === 0 && (
                                                <a href="#" onClick={(e) => { deleteBoard(e, element.id) }} className='m-1' style={{ textDecoration: "none", "color": "black" }}><i className='fa fa-trash'></i></a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="overflow-y-auto" style={{ height: "60vh" }}>
                                        {
                                            element.tasks && element.tasks.map((task, index) => {

                                                return <Task
                                                    task={task}
                                                    board_id={element.id}
                                                    drag_start={onDragStart}
                                                    key={index}
                                                    delete_task={deleteTask}
                                                    edit_task={edit_task}
                                                    update_board_id={setselectedBoard}
                                                    update_task_timer={updateTaskTimer}
                                                />
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
