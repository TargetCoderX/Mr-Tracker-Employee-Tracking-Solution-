import React from 'react';

function Task({ task,drag_start,board_id }) {
    return (
        <div className="card m-1" draggable onDragStart={(e) => drag_start(e, task.id, board_id)} style={{ backgroundColor: "#f5f5f5" }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className='mb-0'>{task.task_name}</h5>
                    <span className="badge bg-danger rounded-pill" style={{ width: '100px' }}>{task.task_type.task_type_name}</span>
                </div>
                <p>{task.task_description}</p>
                <div className="row">
                    <div className="col-md-4"><p>Start Date: <br />{task.start_time_stamp}</p></div>
                    <div className="col-md-4"><p>End Date: <br />{task.end_time_stamp}</p></div>
                    <div className="col-md-4"><p>Total Days: <br />{task.expected_total_time}</p></div>
                </div>
            </div>
        </div>
    );
}

export default Task;
