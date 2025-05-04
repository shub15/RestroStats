import React, { useEffect, useRef, useState } from 'react'
import '../styles/home.css';
import '../styles/default.css';
import menuLogo from '../assets/LOGO 1 1024 light.jpg'
import darkMenuLogo from '../assets/LOGO 1 1024 menu-dark.jpg'
import { Link } from 'react-router-dom';
// import '../utils/changetheme.js';
import { useTheme } from './ThemeProvider.jsx';
import DashboardNavbar from './HorizontalNavbar.jsx';

export default function VerticalNavbar() {
    // Function to toggle the menu
    const menuButtonRef = useRef(null);

    useEffect(() => {
       

        // Function to handle clicks outside
        const handleClickOutside = (event) => {
            const menu = document.getElementById('main-menu');
            const menuButton = menuButtonRef.current;

            // If menu is active and click is outside menu and button
            if (
                menu &&
                menu.classList.contains('active') &&
                !menu.contains(event.target) &&
                menuButton &&
                !menuButton.contains(event.target)
            ) {
                menu.classList.remove('active');
            }
        };

        // Add event listener to document
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const { darkTheme, toggleTheme } = useTheme()

    return (
        <>
        <DashboardNavbar />
            <button className="menu-toggle" id="menu-btn" ref={menuButtonRef} aria-label="Open menu" onClick={() => {
                const menu = document.getElementById('main-menu');
                menu.classList.toggle('active');
            }}>
                <span className="material-symbols-outlined">menu</span>
            </button>

            <nav className="vertical-menu" id="main-menu">
                <img
                    id="menu-logo"
                    src={darkTheme ? darkMenuLogo : menuLogo}
                    alt="Menu Logo"
                />
                <ul>
                    <Link to='/' className={`block py-1 px-3 rounded ${darkTheme ? `dark:hover:bg-zinc-800`: `hover:bg-zinc-200`}`}>Home</Link>
                    <li>
                        <Link to='/upload' className={`block py-1 px-3 rounded ${darkTheme ? `dark:hover:bg-zinc-800`: `hover:bg-zinc-200`}`}>Upload Data</Link>
                    </li>
                    <li className="has-submenu">
                        <a href="#bill-system" className={`block py-1 px-3 rounded ${darkTheme ? `dark:hover:bg-zinc-800`: `hover:bg-zinc-200`}`}>Bill System</a>
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
                        <a href="#inventory" className={`block py-1 px-3 rounded ${darkTheme ? `dark:hover:bg-zinc-800`: `hover:bg-zinc-200`}`}>Menu</a>
                        <ul className="submenu">
                            <li>
                                <Link to="/view_menu">View Menu</Link>
                            </li>
                            <li>
                                <Link to="/updatemenu">Update Menu</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="has-submenu">
                        <Link to="#reports" className={`block py-1 px-3 rounded ${darkTheme ? `dark:hover:bg-zinc-800`: `hover:bg-zinc-200`}`}>Reports &amp; Analytics</Link>
                    </li>
                    <li className="has-submenu">
                        <Link to="#staff-manage" className={`block py-1 px-3 rounded ${darkTheme ? `dark:hover:bg-zinc-800`: `hover:bg-zinc-200`}`}>Staff Management</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}
