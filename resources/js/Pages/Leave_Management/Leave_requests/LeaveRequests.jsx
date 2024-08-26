import Authenticated from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import LeaveRequestApproval from '../Forms/LeaveRequestApproval';
import Modal from '@/Compponents/modals/Modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function LeaveRequests({ auth }) {
    const query = usePage();
    const uuid = new URLSearchParams(query.url.split('?')[1]).get('uuid');
    const [leaveDetails, setleaveDetails] = useState("");
    useEffect(() => {
        if (uuid !== null) {
            (async () => {
                try {
                    const response = await axios.get(route('api.get-leave-details', { uuid }));
                    if (response.data.status == 1) {
                        const a = document.createElement('a');
                        setleaveDetails(response.data.data);
                        a.setAttribute('data-bs-toggle', "modal")
                        a.setAttribute('data-bs-target', "#exampleModal")
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    } else {
                        toast.error(response.data.message);
                    }
                } catch (error) {
                    toast.error("Something went wrong");
                }

            })()
        }
    }, uuid);

    const actionTaken = async (data) => {
        try {
            const response = await axios.post(route('api.action-leave'), data)
            if (response.data.status == 1) {
                toast.success(response.data.message);
                document.getElementById("modalClose").click();
            } else
                toast.error(response.data.message);
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
    return (
        <Authenticated user={auth}>
            <Modal title={"Review Leave Request"} form={<LeaveRequestApproval leave_details={leaveDetails} action={actionTaken} />} />
        </Authenticated>
    );
}

export default LeaveRequests;
