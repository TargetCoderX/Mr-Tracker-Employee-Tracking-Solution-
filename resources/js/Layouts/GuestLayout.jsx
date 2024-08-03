import { ToastContainer } from 'react-toastify';
import logo from '../../../public/assets/images/logo.svg'
export default function Guest({ children, bigCard = false, detailsText = "" }) {
    return (
        <>
            <ToastContainer />
            <div className="container-fluid page-body-wrapper full-page-wrapper">
                <div className="content-wrapper d-flex align-items-center auth px-0">
                    <div className="row w-100 mx-0">
                        <div className={`${!bigCard ? 'col-lg-4' : "col-md-12"} mx-auto`}>
                            <div className="auth-form-light text-left py-5 px-4 px-sm-5 rounded-4">
                                <div className="brand-logo">
                                    <img src={logo} alt="logo" />
                                </div>
                                <h4>{detailsText || "Hello! let's get started"}</h4>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
