import React, { useState } from 'react';

function AddGroupForm({ submitAction }) {
    const [newGroupForm, setnewGroupForm] = useState({ board_name: "", description: "", "tasks": [] });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setnewGroupForm({ ...newGroupForm, [name]: value });
    }
    const submitForm = (e) => {
        e.preventDefault();
        submitAction(newGroupForm)
        document.getElementById("modalClose").click();
        setnewGroupForm({ board_name: "", description: "", "tasks": [] });
    }
    return (
        <>
            <form onSubmit={(e) => { submitForm(e) }}>
                <div className="form-group">
                    <input required type="text" className='form-control' value={newGroupForm.board_name} name='board_name' onChange={(e) => { handleChange(e) }} placeholder='Group Name' />
                </div>
                <div className="form-group">
                    <textarea required className='form-control' style={{ resize: 'none' }} value={newGroupForm.description} name='description' onChange={(e) => { handleChange(e) }} rows={10} placeholder='Group Description' ></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-sm">Save changes</button>
                </div>
            </form>
        </>
    );
}

export default AddGroupForm;
