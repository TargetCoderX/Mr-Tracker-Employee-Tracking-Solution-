import Authenticated from '@/Layouts/AuthenticatedLayout';
import React from 'react';

function UserView({ auth }) {
    return (
        <Authenticated user={auth}>
            
        </Authenticated>
    );
}

export default UserView;
