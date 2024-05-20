import React from 'react';
import { NavLink } from 'react-router-dom';

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
              <NavLink to="/teachers" activeClassName="active">
                Teachers
              </NavLink>
            </li>
          </ul>
        </nav>
      );
    };

export default Navbar;
