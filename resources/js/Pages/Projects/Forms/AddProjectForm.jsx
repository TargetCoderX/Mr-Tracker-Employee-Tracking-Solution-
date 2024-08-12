import React, { useEffect, useState } from 'react';

function AddProjectForm({ submitAction, users }) {
    const [formData, setformData] = useState({
        project_name: "",
        assignee: "",
        start_date: "",
        end_date: "",
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({ ...formData, [name]: value });
    }
    const formSubmit = (e) => {
        e.preventDefault();
        submitAction(formData);
        document.getElementById("modalClose").click();
        setformData({
            project_name: "",
            assignee: "",
            start_date: "",
            end_date: "",
        });
    }
    useEffect(() => {
        console.log("modal called");
    }, []);

    return (
        <>
            <form onSubmit={(e) => { formSubmit(e) }}>
                <div className="form-group">
                    <input type="text" required name='project_name' onChange={(e) => { handleChange(e) }} placeholder='Project Name' value={formData.project_name} className="form-control" />
                </div>
                <div className="form-group">
                    <select name="assignee" required id="assignee" onChange={(e) => { handleChange(e) }} className="form-control" value={formData.assignee}>
                        <option value="" style={{ display: 'none' }}>Assigned To</option>
                        {
                            users && users.map((user) => (
                                <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="form-group">
                    <input type="date" required name='start_date' onChange={(e) => { handleChange(e) }} placeholder='Start Date' value={formData.start_date} className="form-control" />
                </div>
                <div className="form-group">
                    <input type="date" required name='end_date' onChange={(e) => { handleChange(e) }} placeholder='End Date' value={formData.end_date} className="form-control" />
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <button className="btn btn-primary">Save Changes</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default AddProjectForm;
