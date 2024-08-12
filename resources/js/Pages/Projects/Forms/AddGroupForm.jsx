import React, { useState } from 'react';

function AddGroupForm({ submitAction }) {
    const [newGroupForm, setnewGroupForm] = useState({ board_name: "", description: "", "tasks": [] });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setnewGroupForm({ ...newGroupForm, [name]: value });
    }
    const submitForm = (e) => {
        submitAction(newGroupForm)
        document.getElementById("modalClose").click();
        setnewGroupForm({ board_name: "", description: "", "tasks": [] });
    }
    return (
        <>
            <div className="form-group">
                <input type="text" className='form-control' value={newGroupForm.board_name} name='board_name' onChange={(e) => { handleChange(e) }} placeholder='Group Name' />
            </div>
            <div className="form-group">
                <textarea className='form-control' style={{ resize: 'none' }} value={newGroupForm.description} name='description' onChange={(e) => { handleChange(e) }} rows={10} placeholder='Group Description' ></textarea>
            </div>
            <div className="text-center">
                <button type="button" onClick={(e) => { submitForm(e) }} className="btn btn-primary btn-sm">Save changes</button>
            </div>
        </>
    );
}

export default AddGroupForm;
