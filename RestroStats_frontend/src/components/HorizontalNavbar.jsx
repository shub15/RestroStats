import React, { useEffect, useState } from 'react'
import logo from '../assets/LOGO 1 1024 light.jpg';
import darkLogo from '../assets/LOGO 1 1024 dark.jpg';
import { useTheme } from './ThemeProvider';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function HorizontalNavbar() {
    useEffect(() => {
        const toggleMenu = () => {
            const menu = document.getElementById('main-menu');
            menu.classList.toggle('active');
        };
    }, [])

    const { darkTheme, toggleTheme } = useTheme()
    const [toggleAccountDropdown, setToggleAccountDropdown] = useState(false)
    const [restaurantName, setRestaurantName] = useState("Restaurant");

    useEffect(() => {
        const fetchRestaurantProfile = async () => {
            const token = localStorage.getItem("restaurantToken");
            if (!token) {
                console.warn("No restaurant token found.");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/restaurant/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRestaurantName(response.data.name || "My Restaurant");
            } catch (error) {
                console.error("Failed to fetch restaurant profile:", error);
                setRestaurantName("My Restaurant");
            }
        };

        fetchRestaurantProfile();
    }, []);

    return (
        <div>
            <div className='container h-24'>
                <Link to="/dashboard">
                    <img id="logo" src={darkTheme ? darkLogo : logo} alt="Restrostat Logo" />
                </Link>
                <div className="header-controls">
                    <div className="text-center font-semibold py-3">
                        Welcome, {restaurantName}
                    </div>
                    <button id="theme-btn" aria-label="Toggle theme" onClick={toggleTheme}>
                        <span className="material-symbols-outlined" id="mode-icon">
                            {darkTheme ? `dark_mode` : 'light_mode'}
                        </span>
                    </button>
                    <div className="account">
                        <button
                            id="user-btn"
                            aria-label="User account"
                            onClick={() => setToggleAccountDropdown(!toggleAccountDropdown)}
                            className='text-white'
                        >
                            <span className="material-symbols-outlined">account_circle</span>
                            <div className={toggleAccountDropdown ? `account-dropdown show` : `hidden`} id="accountDropdown">
                                <Link to="/accountinfo" className={``}>
                                    <div className={`${darkTheme ? `text-white` : `text-black`} flex gap-2`}>
                                        <span className={`material-symbols-outlined acc-info`}>info</span>
                                        Account Info
                                    </div>
                                </Link>
                                <Link to="#logout">
                                    <div className={`${darkTheme ? `text-white` : `text-black`} flex gap-2`}>
                                        <span className="material-symbols-outlined logout">logout</span>
                                        Logout
                                    </div>
                                </Link>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
