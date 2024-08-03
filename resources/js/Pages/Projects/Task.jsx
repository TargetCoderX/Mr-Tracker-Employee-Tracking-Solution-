import React from 'react';

function Task({ task }) {
    return (
        <div className="card m-1" draggable style={{ backgroundColor: "#f5f5f5" }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className='mb-0'>{task.task_name}</h5>
                    <span class="badge bg-danger rounded-pill w-25">Activity</span>
                </div>
                <p>{task.task_description}</p>
                <div className="row">
                    <div className="col-md-4"><p>Start Date: <br />{task.start_date}</p></div>
                    <div className="col-md-4"><p>End Date: <br />{task.expected_end_date}</p></div>
                    <div className="col-md-4"><p>Total Days: <br />{task.expected_total_days}</p></div>
                </div>
            </div>
        </div>
    );
}

export default Task;
