import React, { useState, useEffect } from "react";
import TransactionDisplay from "./TransactionDisplay";
import { useTheme } from "./ThemeProvider";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function PaymentHistory() {
  const {darkTheme, toggleTheme} = useTheme()

  const [transactions, setTransactions] = useState([]);
  const [popularItem, setPopularItem] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'descending'
  });
  const [filterType, setFilterType] = useState('All');

  // Fetch transactions from API
  useEffect(() => {
    fetchTransactions();
    fetchPopularItem();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseURL}/transactions/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fetchPopularItem = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseURL}/popularitem`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPopularItem(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Toggle dark mode
  // const toggleDarkMode = () => {
  //   toggleTheme(!darkTheme);
  // };

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.key === 'timestamp') {
      const dateA = new Date(a[sortConfig.key]);
      const dateB = new Date(b[sortConfig.key]);
      return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
    } else {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
  });

  // Apply filter
  const filteredTransactions = filterType === 'All'
    ? sortedTransactions
    : sortedTransactions.filter(transaction => transaction.transaction_type === filterType);

  // Calculate totals
  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.transaction_amount, 0);
  const totalItems = filteredTransactions.reduce((sum, transaction) => sum + transaction.quantity, 0);

  return (
    <div className={`min-h-screen ${darkTheme ? `dark:bg-gray-900` : `bg-gray-100`} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${darkTheme ? `dark:text-white`:`text-gray-800`}`}>
            Payment History
          </h1>
          {/* <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Toggle {isDarkTheme ? "Light" : "Dark"} Mode
          </button> */}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Today's Revenue"
            value={`₹${totalAmount}`}
            icon="currency_rupee"
            trend="+12.5%"
            positive
          />
          <StatCard
            title="Total Orders"
            value={`${totalItems}`}
            icon="receipt_long"
            trend="-3.2%"
          />
          <StatCard
            title="Popular Item"
            value={`${popularItem.popular_item}`}
            icon="local_pizza"
            subtext="42 sold today"
          />
        </div>

        {/* Transactions */}
        <div className={` ${darkTheme ? `dark:bg-gray-800` : `bg-white`} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkTheme ? `dark:text-white` : `text-gray-800`}`}>
            Recent Transactions
          </h2>
          <TransactionDisplay limit={10} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, positive = false, subtext }) {
  const {darkTheme, toggleTheme} = useTheme()
  return (
    <div className={` ${darkTheme ? `dark:bg-gray-800`: `bg-white`} rounded-lg shadow p-5`}>
      <div className="flex items-center mb-3">
        <span className="material-symbols-outlined text-indigo-500 text-3xl mr-3">
          {icon}
        </span>
        <div>
          <h3 className={`text-lg font-semibold ${darkTheme ? `dark:text-gray-300` : `text-gray-700`}`}>
            {title}
          </h3>
          <p className={`text-2xl font-bold ${darkTheme ? `dark:text-white` : `text-gray-900`}`}>{value}</p>
        </div>
      </div>
      {trend && (
        <p
          className={`text-sm font-medium ${positive ? "text-green-500" : "text-red-500"
            }`}
        >
          {trend}
        </p>
      )}
      {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}
