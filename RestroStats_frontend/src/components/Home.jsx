import React from 'react';
import { ChartComponent } from "../utils/Components.jsx";
import { useTheme } from './ThemeProvider.jsx';

export default function Home() {
    const { darkTheme, toggleTheme } = useTheme();

    return (
        <div className={`p-6 ${darkTheme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                <button 
                    onClick={toggleTheme} 
                    className={`px-4 py-2 rounded-lg ${darkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                    {darkTheme ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className={`rounded-xl shadow-lg overflow-hidden ${darkTheme ? 'bg-gray-800' : 'bg-white'} p-4`}>
                    <h2 className="text-lg font-semibold mb-4">Sales Breakdown</h2>
                    <ChartComponent id="sales-bar" type="bar" />
                </div>
                <div className={`rounded-xl shadow-lg overflow-hidden ${darkTheme ? 'bg-gray-800' : 'bg-white'} p-4`}>
                    <h2 className="text-lg font-semibold mb-4">Sales Trends</h2>
                    <ChartComponent id="sales-line" type="line" />
                </div>
                <div className={`rounded-xl shadow-lg overflow-hidden ${darkTheme ? 'bg-gray-800' : 'bg-white'} p-4`}>
                    <h2 className="text-lg font-semibold mb-4">Revenue Distribution</h2>
                    <ChartComponent id="sales-pie" type="pie" />
                </div>
            </div>

            {/* Transaction History */}
            <div className={`rounded-xl shadow-lg overflow-hidden ${darkTheme ? 'bg-gray-800' : 'bg-white'} p-6`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Transaction History</h2>
                    <button className={`px-3 py-1 text-sm rounded-lg ${darkTheme ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}>
                        View All
                    </button>
                </div>

                <div className="overflow-x-hidden">
                    <table className="min-w-lvh">
                        <thead>
                            <tr className={`${darkTheme ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                                <th className="py-3 text-left font-medium">Date</th>
                                <th className="py-3 text-left font-medium">Bill No.</th>
                                <th className="py-3 text-left font-medium">Amount</th>
                                <th className="py-3 text-left font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { date: '2024-03-01', bill: 'INV-1001', amount: '$125.50', status: 'Completed' },
                                { date: '2024-03-02', bill: 'INV-1002', amount: '$78.90', status: 'Completed' },
                                { date: '2024-03-03', bill: 'INV-1003', amount: '$205.75', status: 'Pending' },
                                { date: '2024-03-04', bill: 'INV-1004', amount: '$89.20', status: 'Completed' },
                                { date: '2024-03-05', bill: 'INV-1005', amount: '$150.00', status: 'Failed' }
                            ].map((transaction, index) => (
                                <tr 
                                    key={index}
                                    className={`${darkTheme ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'} border-b transition-colors`}
                                >
                                    <td className="py-3">{transaction.date}</td>
                                    <td className="py-3">{transaction.bill}</td>
                                    <td className="py-3 font-medium">{transaction.amount}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                            transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}