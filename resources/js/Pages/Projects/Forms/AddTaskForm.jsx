import React from 'react';

function AddTaskForm() {
    return (
        <>
            <div className="form-group">
                <input type="text" placeholder='Task Name' className="form-control" />
            </div>
            <div className="form-group">
                <textarea type="text" placeholder='Task Description' className="form-control" ></textarea>
            </div>
            <div className="form-group">
                <select name="task_type" id="task_type" className="form-control">
                    <option value="" style={{ display: 'none' }}>Select Task Type</option>
                </select>
            </div>
            <div className="form-group">
                <input type="text" placeholder='Start Date' className="form-control" />
            </div>
            <div className="form-group">
                <input type="text" placeholder='End Date' className="form-control" />
            </div>
            <div className="form-group">
                <input type="text" placeholder='Expected Total Days' className="form-control" />
            </div>
            <div className="text-center">
                <button className="btn btn-primary"><i className='fa fa-plus me-1'></i>Add Task</button>
            </div>
        </>
    );
}

export default AddTaskForm;
