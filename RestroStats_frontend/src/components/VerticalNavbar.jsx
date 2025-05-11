import React, { useEffect, useState } from 'react';
import logo from '../assets/LOGO 1 1024 light.jpg';
import darkLogo from '../assets/LOGO 1 1024 dark.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider.jsx';
import axios from 'axios';

export default function VerticalNavbar() {
    const [menu, setMenu] = useState(false);
    const { darkTheme, toggleTheme } = useTheme();
    const [restaurantName, setRestaurantName] = useState("Restaurant");
    const [toggleAccountDropdown, setToggleAccountDropdown] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurantProfile = async () => {
            const token = localStorage.getItem("restaurantToken");
            if (!token) return;
            try {
                const response = await axios.get("http://localhost:5000/restaurant/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRestaurantName(response.data.name || "My Restaurant");
            } catch {
                setRestaurantName("My Restaurant");
            }
        };
        fetchRestaurantProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('restaurantToken');
        navigate('/login');
    };

    const toggleSubMenu = (menuKey) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }));
    };

    return (
        <div>
            {/* Header */}
            <div className={`w-full flex justify-between items-center px-4 h-20 shadow-md ${darkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                {/* Menu Toggle */}
                <div className='flex items-center gap-4'>

                    <button
                        onClick={() => setMenu(!menu)}
                        className={`menu-toggle p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition flex items-center justify-center`}
                        aria-label="Toggle menu"
                    >
                        <span className="material-symbols-outlined text-3xl">{menu ? 'close' : 'menu'}</span>
                    </button>

                    {/* Logo */}
                    <Link to="/dashboard" className='text-blue-900 dark:text-blue-500 text-2xl font-bold'>
                        <span>RestroStats</span>
                    </Link>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <span className="font-semibold hidden md:inline">Welcome, {restaurantName}</span>
                    <button
                        aria-label="Toggle theme"
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {darkTheme ? 'dark_mode' : 'light_mode'}
                        </span>
                    </button>
                    {/* Account */}
                    <div className="relative">
                        <button
                            aria-label="User account"
                            onClick={() => setToggleAccountDropdown((v) => !v)}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined text-2xl">account_circle</span>
                        </button>
                        {/* Dropdown */}
                        {toggleAccountDropdown && (
                            <div className={`absolute right-0 mt-2 w-44 rounded-lg shadow-lg z-50 ${darkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                                <Link to="/accountinfo" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                    <span className="material-symbols-outlined mr-2">info</span>
                                    Account Info
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    <span className="material-symbols-outlined mr-2">logout</span>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Side Nav */}
            {menu && (
                <nav className={`fixed top-0 left-0 h-full w-64 z-40 shadow-lg ${darkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-all`}>
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <span className='text-blue-900 dark:text-blue-500 text-2xl font-bold'>RestroStats</span>
                        <button
                            onClick={() => setMenu(false)}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>
                    </div>
                    <ul className="mt-6 space-y-2 px-4">
                        <li>
                            <Link
                                to="/"
                                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                onClick={() => setMenu(false)}
                            >
                                <span className="material-symbols-outlined">home</span>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/upload"
                                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                onClick={() => setMenu(false)}
                            >
                                <span className="material-symbols-outlined">upload</span>
                                Upload Data
                            </Link>
                        </li>
                        {/* Bill System Submenu */}
                        <li>
                            <button
                                onClick={() => toggleSubMenu('billSystem')}
                                className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">receipt_long</span>
                                    Bill System
                                </div>
                                <span
                                    className={`material-symbols-outlined transition-transform duration-300 ${expandedMenus['billSystem'] ? 'rotate-90' : ''}`}
                                >
                                    arrow_right
                                </span>
                            </button>
                            {/* Submenu */}
                            {expandedMenus['billSystem'] && (
                                <ul className="pl-8 mt-1 space-y-1">
                                    <li>
                                        <Link
                                            to="/newbill"
                                            className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                            onClick={() => setMenu(false)}
                                        >
                                            <span className="material-symbols-outlined">add</span>
                                            Generate New Bill
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/viewbill"
                                            className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                            onClick={() => setMenu(false)}
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                            View/Edit Bills
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/paymenthistory"
                                            className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                            onClick={() => setMenu(false)}
                                        >
                                            <span className="material-symbols-outlined">history</span>
                                            Payment History
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        {/* Menu Submenu */}
                        <li>
                            <button
                                onClick={() => toggleSubMenu('menu')}
                                className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">restaurant_menu</span>
                                    Menu
                                </div>
                                <span
                                    className={`material-symbols-outlined transition-transform duration-300 ${expandedMenus['menu'] ? 'rotate-90' : ''}`}
                                >
                                    arrow_right
                                </span>
                            </button>
                            {expandedMenus['menu'] && (
                                <ul className="pl-8 mt-1 space-y-1">
                                    <li>
                                        <Link
                                            to="/view_menu"
                                            className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                            onClick={() => setMenu(false)}
                                        >
                                            <span className="material-symbols-outlined">visibility</span>
                                            View Menu
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/updatemenu"
                                            className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                            onClick={() => setMenu(false)}
                                        >
                                            <span className="material-symbols-outlined">edit_square</span>
                                            Update Menu
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        {/* Add more menu items or submenus as needed */}
                    </ul>
                </nav>
            )}
        </div>
    );
}
