import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const API_BASE_URL = 'http://localhost:5000/api';

// Chart Component
const ChartComponent = ({ type = "bar", id, data, options }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext("2d");

        const chartInstance = new Chart(ctx, {
            type,
            data,
            options: options || { responsive: true, maintainAspectRatio: false }
        });

        return () => {
            chartInstance.destroy();
        };
    }, [type, data, options]);

    return (
        <div style={{ width: "100%", height: "250px" }}> {/* Fixed height */}

            <canvas ref={chartRef} id={id}></canvas>;
        </div>
    )
};

function ChartSales() {
    const [analysisData, setAnalysisData] = useState(null);
    const [predictionData, setPredictionData] = useState(null);
    const [options, setOptions] = useState(null);
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

    const makePrediction = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/predict`, predictionForm);
            setPredictionData(response.data.success ? response.data : null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setPredictionForm({ ...predictionForm, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Restaurant Sales Analysis & Prediction</h1>
            {error && <p className="text-red-500">{error}</p>}

            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button className={`tab ${activeTab === 'analysis' && 'active'}`} onClick={() => setActiveTab('analysis')}>Sales Analysis</button>
                <button className={`tab ${activeTab === 'prediction' && 'active'}`} onClick={() => setActiveTab('prediction')}>Sales Prediction</button>
            </div>

            {/* Analysis Tab */}
            {activeTab === 'analysis' && (
                <div>
                    <button className="btn" onClick={fetchAnalysisData} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
                    {analysisData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="chart-box">
                                <h2>Sales by Day of Week</h2>
                                <ChartComponent id="day-sales-chart" data={{ labels: analysisData.day_sales.labels, datasets: [{ label: 'Sales (Rs.)', data: analysisData.day_sales.values }] }} />
                            </div>
                            <div className="chart-box">
                                <h2>Top 10 Favorite Items</h2>
                                <ChartComponent id="favorite-items-chart" data={{ labels: analysisData.favorite_items.labels, datasets: [{ label: 'Quantity Sold', data: analysisData.favorite_items.values }] }} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Prediction Tab */}
            {activeTab === 'prediction' && (
                <div>
                    <form onSubmit={makePrediction} className="space-y-4">
                        <input type="text" name="item_name" value={predictionForm.item_name} onChange={handleInputChange} required placeholder="Item Name" />
                        <input type="text" name="item_type" value={predictionForm.item_type} onChange={handleInputChange} required placeholder="Item Type" />
                        <select name="day_of_week" value={predictionForm.day_of_week} onChange={handleInputChange} required>
                            <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                        </select>
                        <select name="time_of_day" value={predictionForm.time_of_day} onChange={handleInputChange} required>
                            <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Night</option>
                        </select>
                        <input type="text" name="received_by" value={predictionForm.received_by} onChange={handleInputChange} required placeholder="Received By" />
                        <input type="number" name="item_price" value={predictionForm.item_price} onChange={handleInputChange} required placeholder="Item Price" />
                        <button type="submit" className="btn" disabled={loading}>{loading ? 'Predicting...' : 'Predict Sales'}</button>
                    </form>
                    {predictionData && <p className="result">Predicted Sales: Rs. {predictionData.predicted_sales}</p>}
                </div>
            )}
        </div>
    );
}

export default ChartSales;
