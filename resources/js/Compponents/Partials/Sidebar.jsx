import { Link } from '@inertiajs/react';
import React from 'react';

function Sidebar() {
    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <li className="nav-item">
                    <a className="nav-link" href="../../index.html">
                        <i className="mdi mdi-grid-large menu-icon"></i>
                        <span className="menu-title">Dashboard</span>
                    </a>
                </li>
                <li className="nav-item nav-category">Main Menu</li>
                <li className="nav-item"> <Link className="nav-link" href={route('projects')}>
                    <i className="menu-icon mdi mdi-briefcase"></i>
                    <span className="menu-title">All Projects</span>
                </Link></li>
                {/* <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="collapse" href="#leave-request" aria-expanded="false" aria-controls="leave-request">
                        <i className="menu-icon mdi mdi-floor-plan"></i>
                        <span className="menu-title">Projects</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <div className="collapse" id="leave-request">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item"> <Link className="nav-link" href={route('projects')}>All Projects</Link></li>
                            <li className="nav-item"> <Link className="nav-link" href={route('kanban-board')}>Kanban Board</Link></li>
                        </ul>
                    </div>
                </li> */}
                <li className="nav-item">
                    <Link className="nav-link" href={route('user-list')}>
                        <i className="menu-icon mdi mdi-account-group"></i>
                        <span className="menu-title">User List</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" href={route('roles')}>
                        <i className="menu-icon mdi mdi-tag-check"></i>
                        <span className="menu-title">Roles</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="collapse" href="#leave-request" aria-expanded="false" aria-controls="leave-request">
                        <i className="menu-icon mdi mdi-calendar-range"></i>
                        <span className="menu-title">Leaves</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <div className="collapse" id="leave-request">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item"> <Link className="nav-link" href={route('member-leaves')}>Member Leaves</Link></li>
                            <li className="nav-item"> <Link className="nav-link" href={route('holiday')}>Holiday List</Link></li>
                            <li className="nav-item"> <Link className="nav-link" href={route('leave-requests')}>Requested Leaves</Link></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;
