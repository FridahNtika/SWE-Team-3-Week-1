import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
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
