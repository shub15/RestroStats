import React from 'react'
import '../styles/styles.css'
// import '../utils/changetheme'
import ThemeToggle from '../utils/ThemeToggle'
import '../utils/chart'
import '../utils/hovermenu'
import { useTheme } from './ThemeProvider'

export default function Dashboard() {
    const { toggleTheme } = useTheme();
    return (
        <>
            <div className="container">
                <img id="logo" src="../assets/LOGO 1 1024 dark.jpg" alt="Restrostat Logo" />
                <div className="header-controls">
                    <button id="theme-btn" aria-label="Toggle theme">
                        <span className="material-symbols-outlined">light_mode</span>
                    </button>
                    <button id="user-btn" aria-label="User account">
                        <span className="material-symbols-outlined">account_circle</span>
                    </button>
                </div>
            </div>
            <button className="menu-toggle" id="menu-btn" aria-label="Open menu">
                <span className="material-symbols-outlined">menu</span>
            </button>
            <nav className="vertical-menu" id="main-menu">
                <ul>
                    <li className="has-submenu">
                        <a href="#bill-system">Bill System</a>
                        <ul className="submenu">
                            <li>
                                <a href="#generate-bill">Generate New Bill</a>
                            </li>
                            <li>
                                <a href="#view-bills">View Bills</a>
                            </li>
                            <li>
                                <a href="#edit-bills">Edit Bills</a>
                            </li>
                            <li>
                                <a href="#bill-history">Payment History</a>
                            </li>
                        </ul>
                    </li>
                    <li className="has-submenu">
                        <a href="#inventory">Menu</a>
                        <ul className="submenu">
                            <li>
                                <a>View Menu</a>
                            </li>
                            <li>
                                <a>Update Menu</a>
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
            <div className="charts-container">
                <div className="chart-container">
                    <canvas id="sales-bar" />
                </div>
                <div className="chart-container">
                    <canvas id="sales-line" />
                </div>
                <div className="chart-container">
                    <canvas id="sales-pie" />
                </div>
            </div>
            <hr />
            <hr />
            <div className="tracking-history">
                <h2>Transaction History</h2>
                <table style={{ width: "100%" }}>
                    <tbody>
                        <tr>
                            <th style={{ width: "20%" }}>Date</th>
                            <th style={{ width: "20%" }}>Bill No.</th>
                            <th>Amount</th>
                        </tr>
                        <tr>
                            <td>2024-03-01</td>
                            <td>INV-1001</td>
                            <td>$125.50</td>
                        </tr>
                        <tr>
                            <td>2024-03-02</td>
                            <td>INV-1002</td>
                            <td>$78.90</td>
                        </tr>
                        <tr>
                            <td>2024-03-03</td>
                            <td>INV-1003</td>
                            <td>$205.75</td>
                        </tr>
                        <tr>
                            <td>2024-03-04</td>
                            <td>INV-1004</td>
                            <td>$89.20</td>
                        </tr>
                        <tr>
                            <td>2024-03-05</td>
                            <td>INV-1005</td>
                            <td>$150.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}
