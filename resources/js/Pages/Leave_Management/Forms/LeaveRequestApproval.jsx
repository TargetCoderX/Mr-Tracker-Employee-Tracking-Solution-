import React from 'react';

function LeaveRequestApproval({ leave_details, action }) {
    /* convert date to special format */
    const changeDateFormat = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    /* word case */
    const wordCase = (string) => {
        const sentenceArr = string.split('_');
        return sentenceArr.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const actionTaken=(actionGet)=>{
        const data={
            action:actionGet,
            leave_id:leave_details.leave_UUID,
        }
        action(data);
    }

    return (
        <>
            <div className="row">
                <div className="mb-2 col-md-12">
                    <p>Employee Name</p>
                    <input className="form-control" disabled value={leave_details && (`${leave_details.user_data.first_name} ${leave_details.user_data.last_name}`)} />
                </div>
                <div className="mb-2 col-md-6">
                    <p>Leave Type</p>
                    <input className="form-control" disabled value={leave_details && leave_details.leave_type.leave_type} />
                </div>
                <div className="mb-2 col-md-6">
                    <p>Shift Type</p>
                    <input className="form-control" disabled value={leave_details && wordCase(leave_details.leave_shift)} />
                </div>
                <div className="mb-2 col-md-6">
                    <p>From</p>
                    <input className="form-control" disabled value={leave_details && changeDateFormat(leave_details.start_date)} />
                </div>
                <div className="mb-2 col-md-6">
                    <p>To</p>
                    <input className="form-control" disabled value={leave_details && changeDateFormat(leave_details.end_date)} />
                </div>
                <div className="mb-2 col-md-12">
                    <p>Reason</p>
                    <textarea className="form-control" disabled style={{ "height": "150px" }} value={leave_details && leave_details.reason_of_leave} />
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <button className="btn btn-danger" onClick={(e) => { actionTaken('reject') }}><i className='fa fa-trash me-2'></i>Reject</button>
                        <button className="btn btn-success" onClick={(e) => { actionTaken('approve') }}><i className='fa fa-check me-2'></i>Approve</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LeaveRequestApproval;
