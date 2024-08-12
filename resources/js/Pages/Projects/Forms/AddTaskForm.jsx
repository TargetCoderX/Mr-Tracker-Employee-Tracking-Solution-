import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import swal from 'sweetalert';

function AddTaskForm({ submitAction, project_id, task_types, board_id }) {
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
        settaskForm({
            "project_id": project_id,
            "board_id": board_id,
            "task_name": "",
            "task_description": "",
            "task_type": "",
            "task_start_date": "",
            "task_end_date": "",
            "total_day": 0,
        })
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
                        defaultValue={selectBoxSelected}
                        onChange={setselectBoxSelected}
                        labelledBy="Select"
                        required
                    />
                </div>
                <div className="form-group">
                    <input required type="date" value={taskForm.task_start_date} name='task_start_date' onChange={(e) => { handleChange(e) }} placeholder='Start Date' className="form-control" />
                </div>
                <div className="form-group">
                    <input required type="date" value={taskForm.task_end_date} name='task_end_date' onChange={(e) => { handleChange(e) }} placeholder='End Date' className="form-control" />
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
