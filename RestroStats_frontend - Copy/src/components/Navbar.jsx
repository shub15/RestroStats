import React, { useState } from 'react'
// import '../styles/home.css';
// import '../styles/default.css';
import logo from '../assets/LOGO 1 1024 light.jpg';
import darkLogo from '../assets/LOGO 1 1024 dark.jpg';
import menuLogo from '../assets/LOGO 1 1024 light.jpg'
import darkMenuLogo from '../assets/LOGO 1 1024 menu-dark.jpg'
import { Link } from 'react-router-dom';
// import '../utils/changetheme.js';
import { useTheme } from './ThemeProvider.jsx';

export default function Navbar() {
    // Function to toggle the menu
    const toggleMenu = () => {
        const menu = document.getElementById('main-menu');
        menu.classList.toggle('active');
    };

    const {darkTheme, toggleTheme} = useTheme()
    const [toggleAccountDropdown, setToggleAccountDropdown] = useState(false)

    return (
        <>
            <div className='container'>
                <Link to="/home">
                    <img id="logo" src={darkTheme? darkLogo : logo} alt="Restrostat Logo" />
                </Link>
                <div className="header-controls">
                    <button id="theme-btn" aria-label="Toggle theme" onClick={toggleTheme}>
                        <span className="material-symbols-outlined" id="mode-icon">
                            {darkTheme ? `dark_mode`:'light_mode'}
                        </span>
                    </button>
                    <div className="account">
                        <button
                            id="user-btn"
                            aria-label="User account"
                            onClick={() => setToggleAccountDropdown(!toggleAccountDropdown)}
                        >
                            <span className="material-symbols-outlined">account_circle</span>
                            <div className={toggleAccountDropdown ? `account-dropdown show` : `hidden`} id="accountDropdown">
                                <Link to="#account-info">
                                    <span className="material-symbols-outlined acc-info">info</span>
                                    Account Info
                                </Link>
                                <Link to="#logout">
                                    <span className="material-symbols-outlined logout">logout</span>
                                    Logout
                                </Link>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <button className="menu-toggle" id="menu-btn" aria-label="Open menu" onClick={toggleMenu}>
                <span className="material-symbols-outlined">menu</span>
            </button>
            <nav className="vertical-menu bg-inherit" id="main-menu">
                <img
                    id="menu-logo"
                    src={darkTheme ? darkMenuLogo : menuLogo}
                    alt="Menu Logo"
                />
                <ul>
                    <li className="has-submenu">
                        <a href="#bill-system">Bill System</a>
                        <ul className="submenu">
                            <li>
                                <Link to="/newbill">Generate New Bill</Link>
                            </li>
                            <li>
                                <Link to="/viewbill">View/Edit Bills</Link>
                            </li>
                            <li>
                                <Link to="/paymenthistory">Payment History</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="has-submenu">
                        <a href="#inventory">Menu</a>
                        <ul className="submenu">
                            <li>
                                <a href="/view_menu">View Menu</a>
                            </li>
                            <li>
                                <a href="/updatemenu">Update Menu</a>
                            </li>
                        </ul>
                    </li>
                    <li className="has-submenu">
                        <a href="#reports">Reports &amp; Analytics</a>
                    </li>
                    <li className="has-submenu">
                        <a href="#staff-manage">Staff Management</a>
                    </li>
                </ul>
            </nav>
        </>
    )
}
