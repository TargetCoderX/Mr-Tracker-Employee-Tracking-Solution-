import React from 'react';

function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="d-sm-flex justify-content-center justify-content-sm-between">
                <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
                    Developed & Designed in <strong>India</strong> with ❤️ by <strong>Mr. Tracker team</strong>
                </span>
                <span className="float-none float-sm-end d-block mt-1 mt-sm-0 text-center">Copyright © {year}. All rights reserved.</span>
            </div>
        </footer>
    );
}

export default Footer;
