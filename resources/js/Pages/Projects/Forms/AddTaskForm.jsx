import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import swal from 'sweetalert';
import Select from 'react-select';

function AddTaskForm({ submitAction, project_id, task_types, board_id, users, is_edit, task_data }) {
    const [refinedUsers, setrefinedUsers] = useState([]);
    const [dependentRefinedUsers, setdependentRefinedUsers] = useState([]);
    const [assignedUser, setassignedUser] = useState([]);
    const [dependentUsers, setdependentUsers] = useState([]);

    useEffect(() => {
        (() => {
            const updatedUsers = users.map((user) => {
                return {
                    "label": `${user.first_name} ${user.last_name}`,
                    "value": user.id,
                }
            })
            setrefinedUsers(updatedUsers);
        })()
    }, [users])

    useEffect(() => {
        const dependentUserList = users
            .filter(user => user.id != assignedUser.value)
            .map(user => ({
                label: `${user.first_name} ${user.last_name}`,
                value: user.id,
            }));
        setdependentRefinedUsers(dependentUserList);
        const dependentSelectedUsers = dependentUsers.filter((element) => assignedUser.value !== element.value);
        setdependentUsers(dependentSelectedUsers);
        settaskForm({ ...taskForm, ['assigned_user']: assignedUser });

    }, [assignedUser]);

    useEffect(() => {
        (() => {
            settaskForm({ ...taskForm, ['dependent_users']: dependentUsers });
        })()
    }, [dependentUsers]);

    const [selectBoxSelected, setselectBoxSelected] = useState([]);
    const [taskForm, settaskForm] = useState({
        "project_id": project_id,
        "board_id": board_id,
        "task_name": "",
        "task_description": "",
        "task_type": "",
        "task_start_date": "",
        "task_end_date": "",
        "total_day": 0,
        "assigned_user": "",
        "dependent_users": ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        settaskForm({ ...taskForm, [name]: value });
    }
    useEffect(() => {
        settaskForm({ ...taskForm, ['task_type']: selectBoxSelected });
    }, [selectBoxSelected]);

    useEffect(() => {
        (() => {
            const d1 = parseDate(taskForm.task_start_date);
            const d2 = parseDate(taskForm.task_end_date);
            if (d1 > d2) {
                swal("Error", "Start Date cannot gretter from End Date", "error");
                settaskForm({ ...taskForm, ['task_start_date']: "", ['task_end_date']: "", ['total_days']: 0 })
            } else {
                if (taskForm.task_start_date !== '' && taskForm.task_end_date !== '')
                    settaskForm({ ...taskForm, ['total_day']: dateDifference(taskForm.task_start_date, taskForm.task_end_date) })
            }
        })();
    }, [taskForm.task_start_date, taskForm.task_end_date]);

    const handleSubmit = (e) => {
        e.preventDefault();
        submitAction(taskForm);
        document.getElementById("modalClose").click();
        if (!is_edit) {
            setassignedUser([]);
            setdependentRefinedUsers([]);
            setselectBoxSelected([]);
            settaskForm({
                "project_id": project_id,
                "board_id": board_id,
                "task_name": "",
                "task_description": "",
                "task_type": "",
                "task_start_date": "",
                "task_end_date": "",
                "total_day": 0,
                "assigned_user": "",
                "dependent_users": ""
            })
        }
    }

    const parseDate = (dateString) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    const dateDifference = (date1, date2) => {
        const d1 = parseDate(date1);
        const d2 = parseDate(date2);
        const differenceInTime = d2.getTime() - d1.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays;
    }

    useEffect(() => {
        setassignedUser([]);
        setdependentUsers([]);
        setselectBoxSelected([]);
        settaskForm({
            "project_id": project_id,
            "board_id": board_id,
            "task_name": "",
            "task_description": "",
            "task_type": "",
            "task_start_date": "",
            "task_end_date": "",
            "total_day": 0,
            "assigned_user": "",
            "dependent_users": ""
        })
        if (is_edit === true) {
            settaskForm({
                "project_id": project_id,
                "board_id": board_id,
                "task_name": task_data.task_name,
                "task_description": task_data.task_description,
                "task_type": { "label": task_data.task_type.task_type_name, "value": task_data.task_type.id },
                "task_start_date": task_data.start_time_stamp,
                "task_end_date": task_data.end_time_stamp,
                "total_day": task_data.expected_total_time,
                "assigned_user": {
                    'label': `${task_data?.assigned_user?.first_name} ${task_data?.assigned_user?.last_name}`,
                    'value': task_data?.assigned_user?.id,
                },
                "dependent_users": task_data.dependent_users ? JSON.parse(task_data.dependent_users) : [],
                "task_id": task_data.id,
            })
            setassignedUser({
                'label': `${task_data?.assigned_user?.first_name} ${task_data?.assigned_user?.last_name}`,
                'value': task_data?.assigned_user?.id,
            });
            setselectBoxSelected({ "label": task_data.task_type.task_type_name, "value": task_data.task_type.id });
            setdependentUsers(task_data.dependent_users ? JSON.parse(task_data.dependent_users) : []);
        }
    }, [task_data]);

    return (
        <>
            <form onSubmit={(e) => { handleSubmit(e) }}>
                <div className="form-group">
                    <input required type="text" value={taskForm.task_name} name='task_name' onChange={(e) => { handleChange(e) }} placeholder='Task Name' className="form-control" />
                </div>
                <div className="form-group">
                    <textarea required type="text" value={taskForm.task_description} name='task_description' onChange={(e) => { handleChange(e) }} placeholder='Task Description' className="form-control" ></textarea>
                </div>
                <div className="form-group">
                    <CreatableSelect
                        isClearable
                        options={task_types}
                        value={selectBoxSelected}
                        onChange={setselectBoxSelected}
                        placeholder="Select task type"
                        required
                    />
                </div>
                <div className="form-group">
                    <Select
                        isClearable
                        options={refinedUsers}
                        value={assignedUser}
                        onChange={setassignedUser}
                        placeholder="Select Assignee"
                        required
                    />
                </div>
                <div className="form-group">
                    <Select
                        isClearable
                        options={dependentRefinedUsers}
                        value={dependentUsers}
                        onChange={setdependentUsers}
                        placeholder="Select Dependent Assignees"
                        required
                        isMulti
                    />
                </div>
                <div className="form-group">
                    <input required type="date" value={taskForm.task_start_date} name='task_start_date' onChange={(e) => { handleChange(e) }} placeholder='Start Date' className="form-control" />
                    <label htmlFor="dateInput" className="date-placeholder">Select start date</label>
                </div>
                <div className="form-group">
                    <input required type="date" value={taskForm.task_end_date} name='task_end_date' onChange={(e) => { handleChange(e) }} placeholder='End Date' className="form-control" />
                    <label htmlFor="dateInput" className="date-placeholder">Select end date</label>
                </div>
                <div className="form-group">
                    <input required type="text" value={taskForm.total_day} name='total_day' onChange={(e) => { handleChange(e) }} readOnly placeholder='Expected Total Days' className="form-control" />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary"><i className='fa fa-plus me-1'></i>Add Task</button>
                </div>
            </form>
        </>
    );
}

export default AddTaskForm;
