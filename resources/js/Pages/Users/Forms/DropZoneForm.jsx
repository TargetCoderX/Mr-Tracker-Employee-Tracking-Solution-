import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '@/redux/actionTypes/actionTypes';

function DropZoneForm({ userList }) {
    const [dragOver, setDragOver] = useState(false);
    const [dropZoneText, setdropZoneText] = useState("Drag and drop files here or click to upload");
    const [files, setfiles] = useState(null);
    const dispatch = useDispatch();

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragOver(false);
        const files = event.dataTransfer.files;
        if (files.length > 0) { setdropZoneText("File Added, Click submit to upload") }
        setfiles(files);
    };

    const handleClick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files.length > 0) { setdropZoneText("File Added, Click submit to upload") }
            setfiles(files);
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };

    const uploadFile = async (e) => {
        e.preventDefault();
        dispatch(showLoader())
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files[]", files[i]);  // Append each file
        }
        const response = await axios.post(route('api.upload-user-csv'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.data.status == 1) {
            toast.success(response.data.message);
            document.getElementById("modalClose").click();
            setfiles(null);
            userList(response.data.users)
        }
        else
            toast.error(response.data.message);
        dispatch(hideLoader())
    }

    return (
        <>
            <div
                className={`dropzone ${dragOver ? 'dragover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <p>{dropZoneText}</p>
            </div>
            <div className="row mt-2">
                <div className="col-md-12 text-center">
                    <button className="btn btn-primary btn-sm" onClick={(e) => { uploadFile(e) }}>Upload</button>
                </div>
            </div>
        </>
    );
}

export default DropZoneForm;
