import Footer from '@/Compponents/Partials/Footer';
import NavBar from '@/Compponents/Partials/NavBar';
import Sidebar from '@/Compponents/Partials/Sidebar';
import { ToastContainer } from 'react-toastify';

export default function Authenticated({ user, header, children }) {
    return (
        <>
            <ToastContainer />
            <NavBar user={user.user} />
            <div className="container-fluid page-body-wrapper">
                <Sidebar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        {children}
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
}
