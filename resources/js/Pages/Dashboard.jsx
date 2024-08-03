// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <Authenticated user={auth}>
            <h4>Hi</h4>
        </Authenticated>
    );
}
