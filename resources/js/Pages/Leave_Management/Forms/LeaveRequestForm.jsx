import React, { useState } from 'react';

function LeaveRequestForm({ accountLeaves, applyLeave }) {
    const [formData, setformData] = useState({ leave_type: "", start_date: "", end_date: "", leave_shift: "", reason_of_leave: "" });
    const [error, seterror] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({ ...formData, [name]: value });
    }

    const checkAndapply = () => {
        const selectedLeaveType = formData.leave_type;
        const leaveTypeSelected = accountLeaves.filter((leave) => leave.id == selectedLeaveType)?.[0];
        const availableAmount = leaveTypeSelected?.remaining_amount
        const leave_type_name = leaveTypeSelected?.leave_name
        let daydiff = 0.5;
        if (formData.leave_shift == 'full_day')
            daydiff = dayDiff(formData.start_date, formData.end_date);
        if (availableAmount >= daydiff) {
            applyLeave(formData)
        } else {
            seterror({ ...error, dayDifferror: `You have only ${availableAmount} leaves available of ${leave_type_name} ` })
        }

    }

    const dayDiff = (date1, date2) => {
        const startDate = new Date(date1);
        const endDate = new Date(date2);
        const diffInTime = endDate - startDate;
        const diffInDays = diffInTime / (1000 * 60 * 60 * 24);
        return diffInDays;
    }


    return (
        <form onSubmit={(e) => { e.preventDefault(); checkAndapply() }}>
            <div className="row">
                <div className="col-md-12 mb-2">
                    <label htmlFor="" className='form-label'>Leave Type</label>
                    <select value={formData.leave_type} required onChange={(e) => { handleChange(e) }} name="leave_type" id="leave_type" className="form-control text-dark">
                        <option value="" style={{ display: "none" }}>Select Leave Type</option>
                        {
                            accountLeaves && accountLeaves.map((leave, index) => (
                                <option value={leave.id} key={index}>{leave.leave_name} ({leave.remaining_amount})</option>
                            ))
                        }
                    </select>
                </div>
                <div className="col-md-6 mb-2">
                    <label htmlFor="" className='form-label'>Start Date</label>
                    <input value={formData.start_date} required onChange={(e) => { handleChange(e) }} type="date" name="start_date" id="start_date" className="form-control" />
                </div>
                <div className="col-md-6 mb-2">
                    <label htmlFor="" className='form-label'>End Date</label>
                    <input value={formData.end_date} required onChange={(e) => { handleChange(e) }} type="date" name="end_date" id="end_date" className="form-control" />
                </div>
                {error && error.dayDifferror && (<p className='text-danger'><strong>{error.dayDifferror}</strong></p>)}
                <div className="col-md-12 mb-2">
                    <label htmlFor="" className='form-label'>Leave Shift</label>
                    <select value={formData.leave_shift} required onChange={(e) => { handleChange(e) }} name="leave_shift" id="leave_shift" className='form-control text-dark'>
                        <option value="" style={{ display: "none" }}>Select Leave Shift</option>
                        <option value="first_half">First Half</option>
                        <option value="second_half">Second Half</option>
                        <option value="full_day">Full Day</option>
                    </select>
                </div>
                <div className="col-md-12 mb-2">
                    <label htmlFor="">Reason Of Leave</label>
                    <textarea value={formData.reason_of_leave} required onChange={(e) => { handleChange(e) }} name="reason_of_leave" id="reason_of_leave" style={{ resize: 'none', height: '100px' }} placeholder='Type the leave reason here...' className="form-control"></textarea>
                </div>
                <div className="col-md-12 text-center">
                    <button type="submit" className="btn btn-primary"><i className='fa fa-save me-1'></i>Save</button>
                </div>
            </div>
        </form>
    );
}

export default LeaveRequestForm;
