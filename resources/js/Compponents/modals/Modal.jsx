import React from 'react';

function Modal({ form, title }) {
    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="d-flex justify-content-between mb-2">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" id='modalClose' data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {form}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
