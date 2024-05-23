import React from "react";
import { NavLink } from "react-router-dom";
import logo from './assets/tj.jpg';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            {/* Add the logo */}
            <div className="navbar-logo">
                <img src={logo} alt="Logo" />
            </div>

            <ul className="navbar-list">
                <li className="navbar-item">
                    <NavLink to="/" exact activeClassName="active">
                        Home
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/teacherdirectory" activeClassName="active">
                        Teachers
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/studentDirectory" activeClassName="active">
                        Students
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/grades" activeClassName="active">
                        Grades
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/courseDashboard" activeClassName="active">
                        Course Dashboard
                    </NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/calendar" activeClassName="active">
                        Calendar
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
