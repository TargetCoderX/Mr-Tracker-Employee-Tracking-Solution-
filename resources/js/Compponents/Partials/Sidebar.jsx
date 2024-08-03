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
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                        <i className="menu-icon mdi mdi-floor-plan"></i>
                        <span className="menu-title">Projects</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <div className="collapse" id="ui-basic">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item"> <a className="nav-link" href="../../pages/ui-features/buttons.html">All Projects</a></li>
                            <li className="nav-item"> <Link className="nav-link" href={route('kanban-board')}>Kanban Board</Link></li>
                        </ul>
                    </div>
                </li>
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
            </ul>
        </nav>
    );
}

export default Sidebar;
