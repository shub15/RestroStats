import React, { useEffect } from 'react';
// import '../styles/styles.css';
// import '../styles/home.css';
// import '../styles/default.css';
// import { ChartComponent } from "../utils/Components.jsx";
import { useTheme } from './ThemeProvider.jsx';

export default function Home() {
    const { darkTheme, toggleTheme } = useTheme()

    return (
        <>
            <div className="charts-container">
                <div className="chart-container">
                    <ChartComponent id="sales-bar" type="bar" />
                </div>
                <div className="chart-container">
                    <ChartComponent id="sales-line" type="line" />
                </div>
                <div className="chart-container">
                    <ChartComponent id="sales-pie" type="pie" />
                </div>
            </div>
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