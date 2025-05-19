import React, { useEffect, useState } from 'react';
import logo from '../assets/LOGO 1 1024 light.jpg';
import darkLogo from '../assets/LOGO 1 1024 dark.jpg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider.jsx';
import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

export default function VerticalNavbar() {
    const { darkTheme, toggleTheme } = useTheme();
    const [restaurantName, setRestaurantName] = useState('Restaurant');
    const [restaurantEmail, setRestaurantEmail] = useState('restaurant@gmail.com');
    const [toggleAccountDropdown, setToggleAccountDropdown] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchRestaurantProfile = async () => {
            const token = localStorage.getItem('restaurantToken');
            if (!token) return;
            try {
                const response = await axios.get(`${baseURL}/restaurant/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRestaurantName(response.data.name || 'My Restaurant');
                setRestaurantEmail(response.data.email || 'My email');
            } catch {
                setRestaurantName('My Restaurant');
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
            [menuKey]: !prev[menuKey],
        }));
    };

    // For avatar, just use first letter of restaurant name
    const avatarLetter = restaurantName?.charAt(0)?.toUpperCase() || 'R';

    return (
        <aside
            className={`h-screen w-72 flex flex-col justify-between fixed left-0 top-0 z-40 shadow-2xl border-r
        ${darkTheme ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}
      `}
        >
            {/* Top: Logo and Profile */}
            <div>
                <div className="flex items-center gap-3 px-8 py-8 border-b border-gray-200 dark:border-gray-800">
                    <div className="w-15 h-15 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center text-white text-4xl font-extrabold select-none">
                        {restaurantName ? restaurantName.charAt(0).toUpperCase() : 'R'}
                    </div>
                    <div>
                        <div className="font-bold text-lg tracking-tight">{restaurantName}</div>
                        <div className="text-xs text-gray-400 mt-1">{restaurantEmail}</div>
                    </div>
                </div>
                {/* Navigation */}
                <nav className="mt-8 px-4 flex flex-col gap-2">
                    <Link
                        to="/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
              ${location.pathname === '/dashboard'
                                ? 'bg-indigo-600 text-white shadow'
                                : darkTheme
                                    ? 'hover:bg-gray-800'
                                    : 'hover:bg-gray-100'}
            `}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        Dashboard
                    </Link>
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
              ${location.pathname === '/'
                                ? 'bg-indigo-600 text-white shadow'
                                : darkTheme
                                    ? 'hover:bg-gray-800'
                                    : 'hover:bg-gray-100'}
            `}
                    >
                        <span className="material-symbols-outlined">home</span>
                        Home
                    </Link>
                    <Link
                        to="/upload"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
              ${location.pathname === '/upload'
                                ? 'bg-indigo-600 text-white shadow'
                                : darkTheme
                                    ? 'hover:bg-gray-800'
                                    : 'hover:bg-gray-100'}
            `}
                    >
                        <span className="material-symbols-outlined">upload</span>
                        Upload Data
                    </Link>
                    {/* Bill System Submenu */}
                    <div>
                        <button
                            onClick={() => toggleSubMenu('billSystem')}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium transition
                ${expandedMenus['billSystem']
                                    ? 'bg-indigo-600 text-white shadow'
                                    : darkTheme
                                        ? 'hover:bg-gray-800'
                                        : 'hover:bg-gray-100'}
              `}
                        >
                            <span className="flex items-center gap-3">
                                <span className="material-symbols-outlined">receipt_long</span>
                                Bill System
                            </span>
                            <span
                                className={`material-symbols-outlined transition-transform duration-300 ${expandedMenus['billSystem'] ? 'rotate-90' : ''
                                    }`}
                            >
                                arrow_right
                            </span>
                        </button>
                        {expandedMenus['billSystem'] && (
                            <ul className="pl-12 mt-1 flex flex-col gap-1">
                                <Link
                                    to="/newbill"
                                    className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
                                >
                                    <span className="material-symbols-outlined text-base">add</span>
                                    Generate New Bill
                                </Link>
                                <Link
                                    to="/viewbill"
                                    className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
                                >
                                    <span className="material-symbols-outlined text-base">edit</span>
                                    View/Edit Bills
                                </Link>
                                <Link
                                    to="/paymenthistory"
                                    className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
                                >
                                    <span className="material-symbols-outlined text-base">history</span>
                                    Payment History
                                </Link>
                            </ul>
                        )}
                    </div>
                    {/* Menu Submenu */}
                    <div>
                        <button
                            onClick={() => toggleSubMenu('menu')}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium transition
                ${expandedMenus['menu']
                                    ? 'bg-indigo-600 text-white shadow'
                                    : darkTheme
                                        ? 'hover:bg-gray-800'
                                        : 'hover:bg-gray-100'}
              `}
                        >
                            <span className="flex items-center gap-3">
                                <span className="material-symbols-outlined">restaurant_menu</span>
                                Menu
                            </span>
                            <span
                                className={`material-symbols-outlined transition-transform duration-300 ${expandedMenus['menu'] ? 'rotate-90' : ''
                                    }`}
                            >
                                arrow_right
                            </span>
                        </button>
                        {expandedMenus['menu'] && (
                            <ul className="pl-12 mt-1 flex flex-col gap-1">
                                <Link
                                    to="/view_menu"
                                    className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
                                >
                                    <span className="material-symbols-outlined text-base">visibility</span>
                                    View Menu
                                </Link>
                                <Link
                                    to="/updatemenu"
                                    className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
                                >
                                    <span className="material-symbols-outlined text-base">edit_square</span>
                                    Update Menu
                                </Link>
                            </ul>
                        )}
                    </div>
                </nav>
            </div>
            {/* Bottom: Theme & Account */}
            <div className="px-8 py-8 mb-20 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-6">
                <button
                    aria-label="Toggle theme"
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                    <span className="material-symbols-outlined">{darkTheme ? 'dark_mode' : 'light_mode'}</span>
                    {darkTheme ? 'Dark Mode' : 'Light Mode'}
                </button>
                <div className="relative">
                    <button
                        aria-label="User account"
                        onClick={() => setToggleAccountDropdown((v) => !v)}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition hover:bg-indigo-50 dark:hover:bg-gray-800"
                    >
                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white font-bold text-lg shadow">
                            {avatarLetter}
                        </span>
                        <span>Account</span>
                        <span className="material-symbols-outlined">expand_more</span>
                    </button>
                    {toggleAccountDropdown && (
                        <div className={`absolute left-0 mt-2 w-48 rounded-xl shadow-xl z-50 ${darkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                            <Link
                                to="/accountinfo"
                                className="flex items-center px-5 py-3 gap-2 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-t-xl"
                            >
                                <span className="material-symbols-outlined">info</span>
                                Account Info
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-5 py-3 gap-2 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-b-xl"
                            >
                                <span className="material-symbols-outlined">logout</span>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Google Material Symbols */}
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        </aside>
    );
}
