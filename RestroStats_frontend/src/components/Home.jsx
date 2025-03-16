import React, { useEffect, useState } from 'react';
import ChartComponent from "./ChartComponent.jsx";
import { useTheme } from './ThemeProvider.jsx';
import axios from 'axios';
import TransactionDisplay from './TransactionDisplay.jsx';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Home() {
    const { darkTheme, toggleTheme } = useTheme();

    const [analysisData, setAnalysisData] = useState(null);
    const [predictionData, setPredictionData] = useState(null);
    const [options, setOptions] = useState();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('analysis');
    const [error, setError] = useState(null);
    const [predictionForm, setPredictionForm] = useState({
        item_name: 'Vadapav',
        item_type: 'Fastfood',
        day_of_week: 'Monday',
        time_of_day: 'Evening',
        received_by: 'Mr.',
        item_price: 20
    });

    useEffect(() => {
        fetchAnalysisData();
        fetchOptions();
    }, []);

    const fetchAnalysisData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/get-analysis`);
            setAnalysisData(response.data.success ? response.data : null);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-options`);
            setOptions(response.data.success ? response.data : null);
        } catch (error) {
            setError(error.message);
        }
    };

    // const makePrediction = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     try {
    //         const response = await axios.post(`http://localhost:5000/predict`, predictionForm);
    //         setPredictionData(response.data.success ? response.data : null);
    //     } catch (error) {
    //         setError(error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const makePrediction = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/predict`, predictionForm);
            console.log("Prediction response:", response.data);
            setPredictionData(response.data.success ? response.data : response.data);
        } catch (error) {
            console.error("Prediction error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setPredictionForm({ ...predictionForm, [e.target.name]: e.target.value });
    };
    const handleChange = (e) => {
        setPredictionForm({ ...predictionForm, [e.target.name]: e.target.value });
    };

    console.log(predictionData)
    console.log(options)
    console.log(analysisData)
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Favorite Items Chart */}
                {analysisData && (
                    <div className={`rounded-xl shadow-lg overflow-hidden ${darkTheme ? 'bg-gray-800' : 'bg-white'} p-4`}>
                        <h2 className="text-lg font-semibold mb-4">Favorite Items</h2>
                        <ChartComponent
                            id="favorite-items-chart"
                            type="bar"
                            data={analysisData.favorite_items}
                        />
                    </div>
                )}

                {/* Daily Sales Chart */}
                {analysisData && (
                    <div className={`rounded-xl shadow-lg overflow-hidden ${darkTheme ? 'bg-gray-800' : 'bg-white'} p-4`}>
                        <h2 className="text-lg font-semibold mb-4">Daily Sales</h2>
                        <ChartComponent
                            id="daily-sales-chart"
                            type="bar"
                            data={analysisData.day_sales}
                        />
                    </div>
                )}

                {/* Monthly Sales Trend */}
                {analysisData && (
                    <div className={`rounded-xl shadow-lg overflow-hidden ${darkTheme ? 'bg-gray-800' : 'bg-white'} p-4`}>
                        <h2 className="text-lg font-semibold mb-4">Monthly Sales Trend</h2>
                        <ChartComponent
                            id="monthly-sales-chart"
                            type="line"
                            data={analysisData.monthly_sales}
                        />
                    </div>
                )}

                {/* Item Type Distribution */}
                {analysisData && (
                    <div className={`rounded-xl shadow-lg overflow-hidden ${darkTheme ? 'bg-gray-800' : 'bg-white'} p-4`}>
                        <h2 className="text-lg font-semibold mb-4">Item Type Distribution</h2>
                        <ChartComponent
                            id="item-type-chart"
                            type="pie"
                            data={analysisData.item_type_sales}
                        />
                    </div>
                )}

                {/* Sales Heatmap */}
                {/* {analysisData && (
                    <div className={`rounded-xl shadow-lg overflow-hidden ${darkTheme ? 'bg-gray-800' : 'bg-white'} p-4 col-span-1 md:col-span-2`}>
                        <h2 className="text-lg font-semibold mb-4">Sales by Day and Time</h2>
                        <ChartComponent
                            id="sales-heatmap"
                            type="heatmap"
                            data={analysisData.heatmap_data}
                        />
                    </div>
                )} */}

                {/* In your Home component where you're rendering charts */}
                {analysisData && (
                    <div className={`rounded-xl shadow-lg overflow-hidden ${darkTheme ? 'bg-gray-800' : 'bg-white'} p-4 col-span-1 md:col-span-2`}>
                        <h2 className="text-lg font-semibold mb-4">Sales by Day and Time</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border p-2">Day/Time</th>
                                        <th className="border p-2">Morning</th>
                                        <th className="border p-2">Afternoon</th>
                                        <th className="border p-2">Evening</th>
                                        <th className="border p-2">Night</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                        <tr key={day}>
                                            <td className="border p-2 font-medium">{day}</td>
                                            {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => {
                                                const cell = analysisData.heatmap_data.find(item => item.day === day && item.time === time);
                                                const value = cell ? cell.value : 0;

                                                // Calculate color intensity based on value
                                                const max = Math.max(...analysisData.heatmap_data.map(item => item.value));
                                                const intensity = Math.floor((value / max) * 255);
                                                const backgroundColor = `rgba(0, 0, ${intensity}, 0.7)`;

                                                return (
                                                    <td
                                                        key={`${day}-${time}`}
                                                        className="border p-2 text-center"
                                                        style={{ backgroundColor }}
                                                    >
                                                        ₹{value.toLocaleString()}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <form onSubmit={makePrediction} className={`p-4 mb-8 space-y-4 ${darkTheme ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-md`}>
                    <select name="item_name" onChange={handleInputChange} required>
                        <option value="">Select Item</option>
                        {options?.items?.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <select name="item_type" onChange={handleInputChange} required>
                        <option value="">Select Item Type</option>
                        {options?.item_types?.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <select name="day_of_week" onChange={handleInputChange} required>
                        <option value="">Select Day</option>
                        {options?.days?.map((day) => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>

                    <select name="time_of_day" onChange={handleInputChange} required>
                        <option value="">Select Time</option>
                        {options?.times?.map((time) => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>

                    <select name="received_by" onChange={handleInputChange} required>
                        <option value="">Select Customer Type</option>
                        {options?.customer_types?.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="item_price"
                        value={predictionForm.item_price}
                        onChange={handleInputChange}
                        required
                        placeholder="Item Price"
                        className="w-full p-2 border rounded"
                    />

                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                        {loading ? 'Predicting...' : 'Submit'}
                    </button>
                </form>
                {predictionData && (
                    <div className={`mt-4 p-4 rounded-md ${darkTheme ? 'bg-gray-800' : 'bg-green-100'}`}>
                        <h3 className="font-semibold mb-2">Prediction Results</h3>
                        <p className="result text-lg">
                            Predicted Sales: ₹ {predictionData.predicted_sales.toFixed(2)}
                        </p>
                    </div>
                )}
            </div>

            {/* Transaction History */}
            {/* <div className={`rounded-xl shadow-lg overflow-hidden ${darkTheme ? 'bg-gray-800' : 'bg-white'} p-6`}>
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
                                        <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
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
            </div> */}

            <TransactionDisplay />
        </div>
    );
}