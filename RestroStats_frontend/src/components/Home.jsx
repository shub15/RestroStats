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
    const [insightsData, setInsightsData] = useState(null);

    useEffect(() => {
        fetchAnalysisData();
        fetchOptions();
        fetchInsightsData();
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

    const makePrediction = async (e) => {
        const token = localStorage.getItem('restaurantToken');
        if (!token) return;
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/predict`, predictionForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
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

    const fetchInsightsData = async () => {
        const token = localStorage.getItem('restaurantToken');
        if (!token) return;
        try {
            const response = await axios.get(`http://localhost:5000/insights`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInsightsData(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    console.log(insightsData);

    return (
        <div className={`min-h-screen p-6 md:p-8 lg:p-12 transition-colors duration-300 ${darkTheme ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' :
                'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-800'
            }`}>
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 sm:mb-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                    Dashboard Overview
                </h1>
                {/* <button
                    onClick={toggleTheme}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                        darkTheme ? 
                        'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white' : 
                        'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800'
                    }`}
                >
                    {darkTheme ? (
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Light Mode
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            Dark Mode
                        </span>
                    )}
                </button> */}
            </div>

            {/* Key Insights Section */}
            {insightsData && (
                <div className={`mb-12 bg-blue-800 p-6 rounded-2xl shadow-xl transform hover:scale-102 transition-all duration-300 ${darkTheme ? 'text-white' : 'text-white'
                    }`}>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Key Insights
                    </h2>
                    <ul className="space-y-3">
                        {insightsData.insights.map((point, index) => (
                            <li key={index} className="flex items-start gap-3">
                                {/* <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900 bg-opacity-20 flex items-center justify-center mt-0.5">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span> */}
                                <span className="text-lg font-medium">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
                {analysisData && (
                    <>
                        {/* Favorite Items Chart */}
                        <div className={`rounded-2xl shadow-xl overflow-hidden ${darkTheme ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
                            } p-6 transform hover:scale-102 transition-all duration-300`}>
                            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkTheme ? 'text-blue-400' : 'text-blue-600'
                                }`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                Favorite Items
                            </h2>
                            <div className="h-80">
                                <ChartComponent
                                    id="favorite-items-chart"
                                    type="bar"
                                    data={analysisData.favorite_items}
                                />
                            </div>
                        </div>

                        {/* Daily Sales Chart */}
                        <div className={`rounded-2xl shadow-xl overflow-hidden ${darkTheme ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
                            } p-6 transform hover:scale-102 transition-all duration-300`}>
                            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkTheme ? 'text-green-400' : 'text-green-600'
                                }`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Daily Sales
                            </h2>
                            <div className="h-80">
                                <ChartComponent
                                    id="daily-sales-chart"
                                    type="bar"
                                    data={analysisData.day_sales}
                                />
                            </div>
                        </div>

                        {/* Monthly Sales Trend */}
                        <div className={`rounded-2xl shadow-xl overflow-hidden ${darkTheme ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
                            } p-6 transform hover:scale-102 transition-all duration-300`}>
                            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkTheme ? 'text-yellow-400' : 'text-yellow-600'
                                }`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                                Monthly Sales Trend
                            </h2>
                            <div className="h-80">
                                <ChartComponent
                                    id="monthly-sales-chart"
                                    type="line"
                                    data={analysisData.monthly_sales}
                                />
                            </div>
                        </div>

                        {/* Item Type Distribution */}
                        <div className={`rounded-2xl shadow-xl overflow-hidden ${darkTheme ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
                            } p-6 transform hover:scale-102 transition-all duration-300`}>
                            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkTheme ? 'text-purple-400' : 'text-purple-600'
                                }`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                </svg>
                                Item Type Distribution
                            </h2>
                            <div className="h-80">
                                <ChartComponent
                                    id="item-type-chart"
                                    type="pie"
                                    data={analysisData.item_type_sales}
                                />
                            </div>
                        </div>

                        {/* Sales Heatmap */}
                        <div className={`rounded-2xl shadow-xl overflow-hidden ${darkTheme ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
                            } p-6 col-span-1 md:col-span-2 transform hover:scale-101 transition-all duration-300`}>
                            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkTheme ? 'text-red-400' : 'text-red-600'
                                }`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                </svg>
                                Sales by Day and Time
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className={`${darkTheme ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <th className="border border-gray-600 p-3 font-semibold text-left">Day/Time</th>
                                            <th className="border border-gray-600 p-3 font-semibold text-center">Morning</th>
                                            <th className="border border-gray-600 p-3 font-semibold text-center">Afternoon</th>
                                            <th className="border border-gray-600 p-3 font-semibold text-center">Evening</th>
                                            <th className="border border-gray-600 p-3 font-semibold text-center">Night</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                            <tr key={day} className={`${darkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                                                <td className="border border-gray-600 p-3 font-medium">{day}</td>
                                                {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => {
                                                    const cell = analysisData.heatmap_data.find(item => item.day === day && item.time === time);
                                                    const value = cell ? cell.value : 0;

                                                    // Calculate color intensity based on value
                                                    const max = Math.max(...analysisData.heatmap_data.map(item => item.value));
                                                    const intensity = Math.floor((value / max) * 255);
                                                    const backgroundColor = `rgba(${intensity}, ${intensity}, 255, 0.8)`;

                                                    return (
                                                        <td
                                                            key={`${day}-${time}`}
                                                            className="border border-gray-600 p-3 text-center font-medium transition-all duration-300 hover:scale-105"
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
                    </>
                )}
            </div>

            {/* Prediction Form Section */}
            <div className={`rounded-2xl shadow-xl overflow-hidden ${darkTheme ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
                } p-6 mb-8`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkTheme ? 'text-white' : 'text-gray-800'
                    }`}>Sales Prediction</h2>

                <form onSubmit={makePrediction} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${darkTheme ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Item Name
                            </label>
                            <select
                                name="item_name"
                                onChange={handleInputChange}
                                required
                                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${darkTheme
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            >
                                <option value="">Select Item</option>
                                {options?.items?.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${darkTheme ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Item Type
                            </label>
                            <select
                                name="item_type"
                                onChange={handleInputChange}
                                required
                                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${darkTheme
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            >
                                <option value="">Select Item Type</option>
                                {options?.item_types?.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${darkTheme ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Day of Week
                            </label>
                            <select
                                name="day_of_week"
                                onChange={handleInputChange}
                                required
                                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${darkTheme
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            >
                                <option value="">Select Day</option>
                                {options?.days?.map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${darkTheme ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Time of Day
                            </label>
                            <select
                                name="time_of_day"
                                onChange={handleInputChange}
                                required
                                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${darkTheme
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            >
                                <option value="">Select Time</option>
                                {options?.times?.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${darkTheme ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Customer Type
                            </label>
                            <select
                                name="received_by"
                                onChange={handleInputChange}
                                required
                                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${darkTheme
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            >
                                <option value="">Select Customer Type</option>
                                {options?.customer_types?.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={`block text-sm font-medium ${darkTheme ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Item Price
                            </label>
                            <input
                                type="number"
                                name="item_price"
                                value={predictionForm.item_price}
                                onChange={handleInputChange}
                                required
                                placeholder="Item Price"
                                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${darkTheme
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500'
                                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-all duration-300 ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5'
                            } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Predicting...
                            </span>
                        ) : (
                            'Generate Prediction'
                        )}
                    </button>
                </form>

                {predictionData && (
                    <div className={`mt-6 p-6 rounded-xl transform transition-all duration-300 ${darkTheme
                            ? 'bg-gradient-to-r from-green-900 to-green-800'
                            : 'bg-gradient-to-r from-green-50 to-green-100'
                        }`}>
                        <h3 className={`text-xl font-bold mb-4 ${darkTheme ? 'text-green-400' : 'text-green-700'
                            }`}>
                            Prediction Results
                        </h3>
                        <p className="text-2xl font-bold">
                            Predicted Sales: ₹ {predictionData.predicted_sales.toFixed(2)}
                        </p>
                    </div>
                )}
            </div>

            {/* Transaction Display */}
            <TransactionDisplay limit={5} />
        </div>
    );
}